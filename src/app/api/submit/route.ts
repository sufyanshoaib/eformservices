import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateFilledPdf } from '@/lib/pdf/generator';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { formId, data, styling } = body;

        if (!formId || !data) {
            return NextResponse.json({ error: 'Missing form data' }, { status: 400 });
        }

        // 1. Fetch form details including PDF URL and mappings
        const form = await prisma.form.findUnique({
            where: { id: formId },
            include: { pdf: true }
        });

        if (!form) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }

        // 2. Signature Privacy: Strip signatures from data before saving to DB
        const rawMappings = form.fieldMappings as any[];
        const sanitizedData = { ...data };

        rawMappings.forEach(field => {
            if (field.type === 'signature' && sanitizedData[field.id]) {
                sanitizedData[field.id] = '[SIGNATURE_REMOVED]';
            }
        });

        // 3. Save Sanitized Submission
        await prisma.submission.create({
            data: {
                formId,
                data: sanitizedData,
            }
        });

        // 4. Prepare ORIGINAL data (with signatures) for PDF generation
        const fields = rawMappings.map(field => ({
            id: field.id,
            page: field.page,
            x: field.x,
            y: field.y,
            width: field.width,
            height: field.height,
            type: field.type,
            value: data[field.id] || '',
            color: styling?.color,
            fontWeight: styling?.fontWeight
        }));

        // 4. Generate PDF
        const pdfBytes = await generateFilledPdf({
            pdfUrl: form.pdf.fileUrl,
            fields
        });

        // 5. Return PDF as stream
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', `attachment; filename="${form.name.replace(/\s+/g, '_')}_filled.pdf"`);
        headers.set('Content-Length', pdfBytes.length.toString());

        return new NextResponse(Buffer.from(pdfBytes), {
            status: 200,
            headers
        });

    } catch (error) {
        console.error('Submission error:', error);
        return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
    }
}
