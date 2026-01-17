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
        color?: string;
        fontWeight?: 'normal' | 'bold';
    }[];
}

const colorMap: Record<string, any> = {
    black: rgb(0, 0, 0),
    blue: rgb(0.145, 0.388, 0.922),
    red: rgb(0.863, 0.149, 0.149),
    green: rgb(0.02, 0.588, 0.412),
    emerald: rgb(0.02, 0.588, 0.412),
};

export async function generateFilledPdf({ pdfUrl, fields }: GeneratePdfParams): Promise<Uint8Array> {
    console.log(`[PDF Generator] Starting generation for ${pdfUrl} with ${fields.length} fields`);

    try {
        const existingPdfBytes = await fetch(pdfUrl).then(res => {
            if (!res.ok) throw new Error(`Failed to fetch PDF: ${res.statusText}`);
            return res.arrayBuffer();
        });

        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // Embed fonts
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);


        const pages = pdfDoc.getPages();

        for (const field of fields) {
            if (!field.value) continue;

            const pageNum = Number(field.page);
            const pageIndex = pageNum - 1;

            if (pageIndex < 0 || pageIndex >= pages.length) {
                console.warn(`[PDF Generator] Page index ${pageIndex} out of bounds for PDF with ${pages.length} pages`);
                continue;
            }

            const page = pages[pageIndex];
            const { height } = page.getSize();

            const x = Number(field.x);
            const yTop = Number(field.y);
            const w = Number(field.width);
            const h = Number(field.height);

            const y = height - yTop - h;
            const textY = y + (h / 2) - 4;

            const fieldColor = colorMap[field.color || 'black'] || rgb(0, 0, 0);
            const isBold = field.fontWeight === 'bold';

            try {
                if (field.type === 'checkbox' || field.type === 'radio' || field.type === 'checkmark') {
                    // Normalize boolean-like values
                    const val = String(field.value).toLowerCase();
                    const isSelected = val === 'true' || val === 'checked' || val === 'yes' || val === 'on' || val === '1';

                    if (isSelected) {
                        // Draw a vector checkmark (tick) to avoid font encoding issues
                        const strokeWidth = isBold ? 3 : 2;

                        // Define checkmark points relative to the bounding box
                        // Structure: Start(left-mid) -> Dip(center-bottom) -> End(right-top) 
                        const x1 = x + w * 0.25;
                        const y1 = y + h * 0.45;

                        const x2 = x + w * 0.45;
                        const y2 = y + h * 0.25; // The bottom point

                        const x3 = x + w * 0.80;
                        const y3 = y + h * 0.75;

                        // Draw the two segments of the checkmark
                        page.drawLine({
                            start: { x: x1, y: y1 },
                            end: { x: x2, y: y2 },
                            thickness: strokeWidth,
                            color: fieldColor,
                        });

                        page.drawLine({
                            start: { x: x2, y: y2 },
                            end: { x: x3, y: y3 },
                            thickness: strokeWidth,
                            color: fieldColor,
                        });
                    }
                } else if (field.type === 'signature') {
                    if (field.value && field.value.startsWith('data:image')) {
                        try {
                            const base64Data = field.value.split(',')[1];
                            const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

                            const signatureImage = await pdfDoc.embedPng(imageBytes);
                            const imgDims = signatureImage.scaleToFit(w, h);

                            const xOffset = (w - imgDims.width) / 2;
                            const yOffset = (h - imgDims.height) / 2;

                            page.drawImage(signatureImage, {
                                x: x + xOffset,
                                y: y + yOffset,
                                width: imgDims.width,
                                height: imgDims.height,
                            });
                        } catch (imgError) {
                            console.error('[PDF Generator] Failed to embed signature image:', imgError);
                            page.drawText('(Signature Error)', { x, y: textY, size: 8, font: helveticaFont, color: rgb(1, 0, 0) });
                        }
                    }
                } else {
                    page.drawText(String(field.value), {
                        x: x + 2,
                        y: textY,
                        size: 9,
                        font: isBold ? helveticaBoldFont : helveticaFont,
                        color: fieldColor,
                        maxWidth: w,
                    });
                }
            } catch (textError) {
                console.error(`[PDF Generator] Error drawing field ${field.id}:`, textError);
            }
        }

        // Add branding footer to all pages
        const footerText = 'Filled with eformly (eformly.app)';
        const footerFontSize = 8;
        const footerColor = rgb(0.5, 0.5, 0.5);

        for (const page of pages) {
            const { width } = page.getSize();
            const textWidth = helveticaFont.widthOfTextAtSize(footerText, footerFontSize);

            page.drawText(footerText, {
                x: (width - textWidth) / 2,
                y: 20,
                size: footerFontSize,
                font: helveticaFont,
                color: footerColor,
            });
        }

        const pdfBytes = await pdfDoc.save();
        console.log(`[PDF Generator] Successfully generated PDF (${pdfBytes.length} bytes)`);
        return pdfBytes;
    } catch (error) {
        console.error('[PDF Generator] Error generating PDF:', error);
        throw new Error('Failed to generate PDF');
    }
}
