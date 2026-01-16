import { NextRequest, NextResponse } from 'next/server';
import { generateFilledPdf } from '@/lib/pdf/generator';
import { uploadPdfBufferToBlob } from '@/lib/pdf/upload';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const elementsJson = formData.get('elements') as string;

        if (!file || !elementsJson) {
            return NextResponse.json({ error: 'Missing file or elements' }, { status: 400 });
        }

        const elements = JSON.parse(elementsJson);
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // For adhoc, we need to upload the file temporarily to a URL 
        // to pass it to our generator, OR we modify the generator to accept Buffer.
        // Let's use a temporary upload to Vercel Blob (linked to system user)
        const pdfUrl = await uploadPdfBufferToBlob(buffer, file.name, 'adhoc-user');

        // Map elements to the format expected by generateFilledPdf
        const fields = elements.map((el: any) => ({
            id: el.id,
            page: el.page,
            x: el.x,
            y: el.y,
            width: el.width,
            height: el.height,
            type: el.type === 'checkmark' ? 'checkbox' : el.type,
            value: el.value,
            color: el.color,
            fontWeight: el.fontWeight
        }));

        // Generate PDF
        const pdfBytes = await generateFilledPdf({
            pdfUrl,
            fields
        });

        // Return PDF as stream
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', `attachment; filename="${file.name.replace('.pdf', '')}_signed.pdf"`);
        headers.set('Content-Length', pdfBytes.length.toString());

        return new NextResponse(Buffer.from(pdfBytes), {
            status: 200,
            headers
        });

    } catch (error) {
        console.error('Adhoc fill error:', error);
        return NextResponse.json({ error: 'Failed to process PDF' }, { status: 500 });
    }
}
