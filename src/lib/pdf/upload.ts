import { put } from '@vercel/blob';

/**
 * Uploads a PDF file to Vercel Blob storage
 */
export async function uploadPdfToBlob(file: File, userId: string): Promise<string> {
    const filename = `${userId}/${Date.now()}-${file.name}`;

    const blob = await put(filename, file, {
        access: 'public',
        addRandomSuffix: true,
    });

    return blob.url;
}

/**
 * Uploads a PDF buffer to Vercel Blob storage (server-side)
 */
export async function uploadPdfBufferToBlob(
    buffer: Buffer,
    filename: string,
    userId: string
): Promise<string> {
    const blobFilename = `${userId}/${Date.now()}-${filename}`;

    const blob = await put(blobFilename, buffer, {
        access: 'public',
        addRandomSuffix: true,
    });

    return blob.url;
}

/**
 * Deletes a PDF from Vercel Blob storage
 */
export async function deletePdfFromBlob(url: string): Promise<void> {
    // Vercel Blob delete functionality
    // Note: Requires @vercel/blob delete method
    const { del } = await import('@vercel/blob');
    await del(url);
}
