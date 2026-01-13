import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validatePdfBuffer } from '@/lib/pdf/validation';
import { uploadPdfBufferToBlob } from '@/lib/pdf/upload';

// This is a placeholder for authentication
// TODO: Replace with actual NextAuth session check
async function getUserId(request: NextRequest): Promise<string | null> {
    const userId = 'dev-user-id';

    // Ensure the dev user exists in the database
    // This is a temporary fix until real auth is working
    await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
            id: userId,
            email: 'dev@example.com',
            name: 'Dev User',
        },
    });

    return userId;
}

/**
 * POST /api/pdfs - Upload a new PDF
 */
export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const userId = await getUserId(request);
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse form data
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Validate PDF
        const validation = validatePdfBuffer(buffer, file.name);
        if (!validation.valid) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        // Upload to Vercel Blob
        const fileUrl = await uploadPdfBufferToBlob(buffer, file.name, userId);

        // Save to database
        const pdf = await prisma.pdf.create({
            data: {
                userId,
                name: file.name.replace('.pdf', ''),
                fileName: file.name,
                fileUrl,
                fileSize: buffer.length,
                mimeType: file.type,
            },
        });

        return NextResponse.json({
            id: pdf.id,
            name: pdf.name,
            fileName: pdf.fileName,
            fileUrl: pdf.fileUrl,
            fileSize: pdf.fileSize,
            uploadedAt: pdf.uploadedAt,
        }, { status: 201 });

    } catch (error) {
        console.error('PDF upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload PDF' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/pdfs - List all PDFs for the authenticated user
 */
export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const userId = await getUserId(request);
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get pagination parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        // Fetch PDFs
        const [pdfs, total] = await Promise.all([
            prisma.pdf.findMany({
                where: { userId },
                orderBy: { uploadedAt: 'desc' },
                skip,
                take: limit,
                include: {
                    _count: {
                        select: { forms: true },
                    },
                },
            }),
            prisma.pdf.count({ where: { userId } }),
        ]);

        return NextResponse.json({
            pdfs: pdfs.map(pdf => ({
                id: pdf.id,
                name: pdf.name,
                fileName: pdf.fileName,
                fileUrl: pdf.fileUrl,
                fileSize: pdf.fileSize,
                uploadedAt: pdf.uploadedAt,
                formsCount: pdf._count.forms,
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });

    } catch (error) {
        console.error('PDF list error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch PDFs' },
            { status: 500 }
        );
    }
}
