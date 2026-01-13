import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { nanoid } from 'nanoid';

// This is a placeholder for authentication
async function getUserId(request: NextRequest): Promise<string | null> {
    return 'dev-user-id';
}

/**
 * POST /api/forms - Create a new form
 */
export async function POST(request: NextRequest) {
    try {
        const userId = await getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { pdfId, name, fieldMappings } = body;

        if (!pdfId || !name) {
            return NextResponse.json(
                { error: 'Missing required fields: pdfId, name' },
                { status: 400 }
            );
        }

        // Verify PDF belongs to user
        const pdf = await prisma.pdf.findFirst({
            where: { id: pdfId, userId },
        });

        if (!pdf) {
            return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
        }

        // Create form
        const form = await prisma.form.create({
            data: {
                userId,
                pdfId,
                name,
                fieldMappings: fieldMappings || [],
            },
        });

        return NextResponse.json({
            id: form.id,
            name: form.name,
            pdfId: form.pdfId,
            fieldMappings: form.fieldMappings,
            isPublished: form.isPublished,
            shareableLink: form.shareableLink,
            createdAt: form.createdAt,
            updatedAt: form.updatedAt,
        }, { status: 201 });

    } catch (error) {
        console.error('Form creation error:', error);
        return NextResponse.json({ error: 'Failed to create form' }, { status: 500 });
    }
}

/**
 * GET /api/forms - List all forms for the authenticated user
 */
export async function GET(request: NextRequest) {
    try {
        const userId = await getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const pdfId = searchParams.get('pdfId');

        const where: any = { userId };
        if (pdfId) {
            where.pdfId = pdfId;
        }

        const forms = await prisma.form.findMany({
            where,
            orderBy: { updatedAt: 'desc' },
            include: {
                pdf: {
                    select: {
                        name: true,
                        fileName: true,
                    },
                },
                _count: {
                    select: { submissions: true },
                },
            },
        });

        return NextResponse.json({
            forms: forms.map(form => ({
                id: form.id,
                name: form.name,
                pdfId: form.pdfId,
                pdfName: form.pdf.name,
                isPublished: form.isPublished,
                shareableLink: form.shareableLink,
                submissionsCount: form._count.submissions,
                createdAt: form.createdAt,
                updatedAt: form.updatedAt,
            })),
        });

    } catch (error) {
        console.error('Forms list error:', error);
        return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 });
    }
}
