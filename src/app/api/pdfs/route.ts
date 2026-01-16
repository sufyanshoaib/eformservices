import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validatePdfBuffer } from '@/lib/pdf/validation';
import { uploadPdfBufferToBlob } from '@/lib/pdf/upload';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

// Helper to get user ID
async function getUserId(request: NextRequest): Promise<string | null> {
    const session = await auth();
    return session?.user?.id || null;
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
        const folderId = formData.get('folderId') as string | null;
        const customName = formData.get('name') as string | null;

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

        // Check if folder exists and belongs to user (if folderId provided)
        if (folderId) {
            const folder = await prisma.pdfFolder.findUnique({
                where: { id: folderId },
                select: { userId: true }
            });

            if (!folder || folder.userId !== userId) {
                return NextResponse.json(
                    { error: 'Invalid folder' },
                    { status: 400 }
                );
            }
        }

        // Upload to Vercel Blob
        const fileUrl = await uploadPdfBufferToBlob(buffer, file.name, userId);

        // Save to database
        const pdf = await prisma.pdf.create({
            data: {
                userId,
                folderId: folderId || null,
                name: customName || file.name.replace('.pdf', ''),
                fileName: file.name,
                fileUrl,
                fileSize: buffer.length,
                mimeType: file.type,
            },
        });

        console.log(`Successfully saved PDF to database: ${pdf.id}`);

        // Revalidate the PDF library page to show the new upload
        revalidatePath('/dashboard/pdfs');

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

        // Get pagination and filter parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const folderIdParam = searchParams.get('folderId');
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = { userId };

        if (folderIdParam === 'root') {
            where.folderId = null;
        } else if (folderIdParam) {
            where.folderId = folderIdParam;
        }

        // Fetch PDFs
        const [pdfs, total] = await Promise.all([
            prisma.pdf.findMany({
                where,
                orderBy: { uploadedAt: 'desc' },
                skip,
                take: limit,
                include: {
                    _count: {
                        select: { forms: true },
                    },
                },
            }),
            prisma.pdf.count({ where }),
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
