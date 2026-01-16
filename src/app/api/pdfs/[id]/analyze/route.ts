import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { extractPdfMetadata, extractTextBlocks } from '@/lib/pdf/extract';
import { analyzePdfWithRetry, validateFieldCoordinates } from '@/lib/ai/field-mapping';

// Rate limiting store (in-memory for MVP, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

/**
 * Check rate limit for user
 */
function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const userLimit = rateLimitStore.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
        // Reset or initialize
        rateLimitStore.set(userId, {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW,
        });
        return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
    }

    if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
        return { allowed: false, remaining: 0 };
    }

    userLimit.count++;
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - userLimit.count };
}

/**
 * POST /api/pdfs/[id]/analyze
 * Analyze PDF with AI to generate field suggestions
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // 1. Authentication check
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized. Please sign in.' },
                { status: 401 }
            );
        }

        // 2. Get user from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                aiMappingUsage: true,
                isSubscribed: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found.' },
                { status: 404 }
            );
        }

        // 3. Check usage limits (free tier: 1 PDF, subscribed: unlimited)
        if (!user.isSubscribed && user.aiMappingUsage >= 1) {
            return NextResponse.json(
                {
                    error: 'Free trial limit reached.',
                    message: 'You have used your free AI mapping analysis. Upgrade to Pro for unlimited access.',
                    upgradeRequired: true,
                },
                { status: 403 }
            );
        }

        // 4. Rate limiting
        const rateLimit = checkRateLimit(user.id);
        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Rate limit exceeded.',
                    message: 'Too many requests. Please wait before trying again.',
                },
                { status: 429 }
            );
        }

        // 5. Validate PDF ownership and fetch PDF
        const { id: pdfId } = await params;
        const pdf = await prisma.pdf.findUnique({
            where: { id: pdfId },
            select: {
                id: true,
                userId: true,
                fileUrl: true,
                name: true,
            },
        });

        if (!pdf) {
            return NextResponse.json(
                { error: 'PDF not found.' },
                { status: 404 }
            );
        }

        // Check ownership
        if (pdf.userId !== user.id) {
            console.log('[AI Analyze] Access denied:', { userId: user.id, pdfUserId: pdf.userId });
            return NextResponse.json(
                { error: 'Forbidden. You do not own this PDF.' },
                { status: 403 }
            );
        }

        // 6. Extract PDF metadata and text blocks
        let metadata;
        let textBlocks;
        try {
            const response = await fetch(pdf.fileUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch PDF');
            }
            const pdfBytes = await response.arrayBuffer();
            metadata = await extractPdfMetadata(pdfBytes);

            // Extract text blocks with coordinates (using fresh fetch from URL inside helper for now)
            textBlocks = await extractTextBlocks(pdf.fileUrl);

        } catch (error) {
            console.error('PDF extraction error:', error);
            return NextResponse.json(
                {
                    error: 'Failed to process PDF.',
                    message: 'The PDF file could not be analyzed. Please ensure it is a valid PDF.',
                },
                { status: 400 }
            );
        }

        // 7. Analyze with AI
        const analysisResult = await analyzePdfWithRetry(metadata, textBlocks, 3);

        if (!analysisResult.success) {
            // Don't increment usage on failure
            return NextResponse.json(
                {
                    error: 'AI analysis failed.',
                    message: analysisResult.error || 'The AI service is temporarily unavailable. Please try again.',
                    details: analysisResult.error,
                },
                { status: 500 }
            );
        }

        // 8. Validate all field coordinates
        const validFields = analysisResult.fields.filter(field =>
            validateFieldCoordinates(field, metadata)
        );

        if (validFields.length === 0) {
            return NextResponse.json(
                {
                    error: 'No fields detected.',
                    message: 'AI mapping could not detect any valid form fields in this PDF. You can add fields manually.',
                    suggestions: [],
                },
                { status: 200 }
            );
        }

        // 9. Increment usage counter
        await prisma.user.update({
            where: { id: user.id },
            data: {
                aiMappingUsage: {
                    increment: 1,
                },
            },
        });

        // 10. Return successful response
        return NextResponse.json({
            success: true,
            pdfName: pdf.name,
            pageCount: metadata.pageCount,
            suggestions: validFields,
            metadata: {
                tokensUsed: analysisResult.metadata?.tokensUsed,
                processingTime: analysisResult.metadata?.processingTime,
                fieldsDetected: validFields.length,
            },
            usage: {
                current: user.aiMappingUsage + 1,
                limit: user.isSubscribed ? 'unlimited' : 1,
            },
        });
    } catch (error: any) {
        console.error('API error in /api/pdfs/[id]/analyze:', error);

        return NextResponse.json(
            {
                error: 'Internal server error.',
                message: 'An unexpected error occurred. Please try again.',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined,
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/pdfs/[id]/analyze
 * Check analysis eligibility without performing analysis
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                aiMappingUsage: true,
                isSubscribed: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const { id: pdfId } = await params;
        const pdf = await prisma.pdf.findUnique({
            where: { id: pdfId },
            select: { id: true, userId: true },
        });

        if (!pdf || pdf.userId !== user.id) {
            return NextResponse.json(
                { error: 'PDF not found or access denied' },
                { status: 404 }
            );
        }

        const canUse = user.isSubscribed || user.aiMappingUsage < 1;
        const rateLimit = checkRateLimit(user.id);

        return NextResponse.json({
            eligible: canUse && rateLimit.allowed,
            usage: {
                current: user.aiMappingUsage,
                limit: user.isSubscribed ? 'unlimited' : 1,
            },
            rateLimit: {
                remaining: rateLimit.remaining,
            },
            upgradeRequired: !user.isSubscribed && user.aiMappingUsage >= 1,
        });
    } catch (error) {
        console.error('GET /api/pdfs/[id]/analyze error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
