import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { nanoid } from 'nanoid';

async function getUserId(request: NextRequest): Promise<string | null> {
    return 'dev-user-id';
}

/**
 * GET /api/forms/[id] - Get a specific form
 */
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const userId = await getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const form = await prisma.form.findFirst({
            where: {
                id: params.id,
                userId,
            },
            include: {
                pdf: true,
                _count: {
                    select: { submissions: true },
                },
            },
        });

        if (!form) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }

        return NextResponse.json({
            id: form.id,
            name: form.name,
            pdfId: form.pdfId,
            pdf: {
                id: form.pdf.id,
                name: form.pdf.name,
                fileName: form.pdf.fileName,
                fileUrl: form.pdf.fileUrl,
            },
            fieldMappings: form.fieldMappings,
            isPublished: form.isPublished,
            shareableLink: form.shareableLink,
            submissionsCount: form._count.submissions,
            createdAt: form.createdAt,
            updatedAt: form.updatedAt,
        });

    } catch (error) {
        console.error('Form fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch form' }, { status: 500 });
    }
}

/**
 * PATCH /api/forms/[id] - Update a form
 */
export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const userId = await getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, fieldMappings, isPublished } = body;

        // Verify form belongs to user
        const existingForm = await prisma.form.findFirst({
            where: { id: params.id, userId },
        });

        if (!existingForm) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }

        // Prepare update data
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (fieldMappings !== undefined) updateData.fieldMappings = fieldMappings;
        if (isPublished !== undefined) {
            updateData.isPublished = isPublished;
            // Generate shareable link if publishing
            if (isPublished && !existingForm.shareableLink) {
                updateData.shareableLink = nanoid(10);
            }
            // Remove shareable link if unpublishing
            if (!isPublished) {
                updateData.shareableLink = null;
            }
        }

        const form = await prisma.form.update({
            where: { id: params.id },
            data: updateData,
        });

        return NextResponse.json({
            id: form.id,
            name: form.name,
            pdfId: form.pdfId,
            fieldMappings: form.fieldMappings,
            isPublished: form.isPublished,
            shareableLink: form.shareableLink,
            updatedAt: form.updatedAt,
        });

    } catch (error) {
        console.error('Form update error:', error);
        return NextResponse.json({ error: 'Failed to update form' }, { status: 500 });
    }
}

/**
 * DELETE /api/forms/[id] - Delete a form
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = await getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify form belongs to user
        const form = await prisma.form.findFirst({
            where: { id: params.id, userId },
        });

        if (!form) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }

        // Delete form (cascade will delete submissions)
        await prisma.form.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Form deleted successfully' });

    } catch (error) {
        console.error('Form delete error:', error);
        return NextResponse.json({ error: 'Failed to delete form' }, { status: 500 });
    }
}
