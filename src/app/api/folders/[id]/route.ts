import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateFolderSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
});

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const validation = updateFolderSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.format() },
                { status: 400 }
            );
        }

        // Verify ownership
        const existingFolder = await prisma.pdfFolder.findUnique({
            where: { id },
        });

        if (!existingFolder || existingFolder.userId !== session.user.id) {
            return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
        }

        const updatedFolder = await prisma.pdfFolder.update({
            where: { id },
            data: {
                name: validation.data.name,
            },
        });

        return NextResponse.json(updatedFolder);
    } catch (error) {
        console.error('Error updating folder:', error);
        return NextResponse.json(
            { error: 'Failed to update folder' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Verify ownership
        const existingFolder = await prisma.pdfFolder.findUnique({
            where: { id },
        });

        if (!existingFolder || existingFolder.userId !== session.user.id) {
            return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
        }

        // PDFs will have folderId set to null due to SetNull referential action
        await prisma.pdfFolder.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting folder:', error);
        return NextResponse.json(
            { error: 'Failed to delete folder' },
            { status: 500 }
        );
    }
}
