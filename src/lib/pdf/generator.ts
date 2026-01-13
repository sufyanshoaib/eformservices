import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface GeneratePdfParams {
    pdfUrl: string;
    fields: {
        id: string;
        page: number;
        x: number; // PDF Points
        y: number; // PDF Points
        width: number;
        height: number;
        type: string;
        value: string;
    }[];
}

export async function generateFilledPdf({ pdfUrl, fields }: GeneratePdfParams): Promise<Uint8Array> {
    try {
        // 1. Fetch the existing PDF
        const existingPdfBytes = await fetch(pdfUrl).then(res => {
            if (!res.ok) throw new Error(`Failed to fetch PDF: ${res.statusText}`);
            return res.arrayBuffer();
        });

        // 2. Load a PDFDocument
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // 3. Embed font
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // 4. Get pages
        const pages = pdfDoc.getPages();

        // 5. Draw fields
        for (const field of fields) {
            if (!field.value) continue;

            const pageNum = Number(field.page);
            const pageIndex = pageNum - 1;

            if (pageIndex < 0 || pageIndex >= pages.length) continue;

            const page = pages[pageIndex];
            const { height } = page.getSize();

            // Coordinates are stored as PDF Points (Top-Left origin) from the builder
            const x = Number(field.x);
            const yTop = Number(field.y);
            const w = Number(field.width);
            const h = Number(field.height);

            // Convert to PDF Coordinate System (Bottom-Left Origin)
            const y = height - yTop - h;

            // Text baseline adjustment
            const textY = y + (h / 2) - 4;

            // Draw content
            try {
                if (field.type === 'checkbox') {
                    if (field.value === 'true') {
                        page.drawText('X', {
                            x: x + (w / 2) - 4,
                            y: textY,
                            size: 14,
                            font: helveticaFont,
                            color: rgb(0, 0, 0),
                        });
                    }
                } else if (field.type === 'signature') {
                    if (field.value && field.value.startsWith('data:image')) {
                        try {
                            // Extract base64 data
                            const base64Data = field.value.split(',')[1];
                            const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

                            // Embed PNG (SignatureCanvas produces PNG)
                            const signatureImage = await pdfDoc.embedPng(imageBytes);

                            // Scale to fit within the box while maintaining aspect ratio
                            const imgDims = signatureImage.scaleToFit(w, h);

                            // Center the image in the box
                            const xOffset = (w - imgDims.width) / 2;
                            const yOffset = (h - imgDims.height) / 2;

                            page.drawImage(signatureImage, {
                                x: x + xOffset,
                                y: y + yOffset,
                                width: imgDims.width,
                                height: imgDims.height,
                            });
                        } catch (imgError) {
                            console.error('  Failed to embed signature image:', imgError);
                            // Fallback to text if image fails
                            page.drawText('(Signature Error)', { x, y: textY, size: 8, font: helveticaFont, color: rgb(1, 0, 0) });
                        }
                    }
                } else {
                    page.drawText(field.value, {
                        x: x + 2,
                        y: textY,
                        size: 9, // Slightly smaller for better fit
                        font: helveticaFont,
                        color: rgb(0, 0, 0),
                        maxWidth: w,
                    });
                }
            } catch (textError) {
                console.error('  Error drawing content:', textError);
            }
        }

        // 6. Serialize the PDFDocument to bytes
        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF');
    }
}
