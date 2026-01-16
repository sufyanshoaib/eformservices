import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { deletePdfFromBlob } from '@/lib/pdf/upload';

import { auth } from '@/auth';

// Helper to get user ID
async function getUserId(request: NextRequest): Promise<string | null> {
    const session = await auth();
    return session?.user?.id || null;
}

/**
 * GET /api/pdfs/[id] - Get a specific PDF
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

        const pdf = await prisma.pdf.findFirst({
            where: {
                id: params.id,
                userId,
            },
            include: {
                _count: {
                    select: { forms: true },
                },
            },
        });

        if (!pdf) {
            return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
        }

        return NextResponse.json({
            id: pdf.id,
            name: pdf.name,
            fileName: pdf.fileName,
            fileUrl: pdf.fileUrl,
            fileSize: pdf.fileSize,
            uploadedAt: pdf.uploadedAt,
            formsCount: pdf._count.forms,
        });

    } catch (error) {
        console.error('PDF fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: 500 });
    }
}

/**
 * PATCH /api/pdfs/[id] - Update PDF (e.g., move to folder)
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
        const { folderId, name } = body;

        // Verify ownership
        const pdf = await prisma.pdf.findFirst({
            where: { id: params.id, userId },
        });

        if (!pdf) {
            return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
        }

        const updateData: any = {};

        // If folderId is provided (string or null), update the folder
        if (folderId !== undefined) {
            // Verify target folder exists and belongs to user if not null
            if (folderId) {
                const folder = await prisma.pdfFolder.findFirst({
                    where: { id: folderId, userId },
                });
                if (!folder) {
                    return NextResponse.json({ error: 'Target folder not found' }, { status: 404 });
                }
            }
            updateData.folderId = folderId;
        }

        // If name is provided, update the name
        if (name !== undefined) {
            updateData.name = name.trim();
        }

        if (Object.keys(updateData).length > 0) {
            const updatedPdf = await prisma.pdf.update({
                where: { id: params.id },
                data: updateData,
            });

            return NextResponse.json(updatedPdf);
        }

        return NextResponse.json({ error: 'No update data provided' }, { status: 400 });

    } catch (error) {
        console.error('PDF update error:', error);
        return NextResponse.json({ error: 'Failed to update PDF' }, { status: 500 });
    }
}

/**
 * DELETE /api/pdfs/[id] - Delete a PDF
 */
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const userId = await getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Find the PDF
        const pdf = await prisma.pdf.findFirst({
            where: {
                id: params.id,
                userId,
            },
            include: {
                _count: {
                    select: { forms: true },
                },
            },
        });

        if (!pdf) {
            return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
        }

        // Delete from Blob storage
        try {
            await deletePdfFromBlob(pdf.fileUrl);
        } catch (error) {
            console.error('Failed to delete from Blob storage:', error);
            // Continue with database deletion even if Blob deletion fails
        }

        // Delete from database (cascade will delete associated forms and submissions)
        await prisma.pdf.delete({
            where: { id: params.id },
        });

        return NextResponse.json({
            message: 'PDF deleted successfully',
            deletedFormsCount: pdf._count.forms,
        });

    } catch (error) {
        console.error('PDF delete error:', error);
        return NextResponse.json({ error: 'Failed to delete PDF' }, { status: 500 });
    }
}
