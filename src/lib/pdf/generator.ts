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
};

export async function generateFilledPdf({ pdfUrl, fields }: GeneratePdfParams): Promise<Uint8Array> {
    try {
        const existingPdfBytes = await fetch(pdfUrl).then(res => {
            if (!res.ok) throw new Error(`Failed to fetch PDF: ${res.statusText}`);
            return res.arrayBuffer();
        });

        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // Embed fonts
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const zapfDingbatsFont = await pdfDoc.embedFont(StandardFonts.ZapfDingbats);

        const pages = pdfDoc.getPages();

        for (const field of fields) {
            if (!field.value) continue;

            const pageNum = Number(field.page);
            const pageIndex = pageNum - 1;

            if (pageIndex < 0 || pageIndex >= pages.length) continue;

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
                if (field.type === 'checkbox' || field.type === 'radio') {
                    if (field.value === 'true' || field.value === 'checked' || field.value === 'yes' || field.value === 'on') {
                        const checkmarkSize = Math.min(w, h) * 0.8;

                        page.drawText('4', {
                            x: x + (w - checkmarkSize) / 2,
                            y: y + (h - checkmarkSize) / 2,
                            size: checkmarkSize,
                            font: zapfDingbatsFont,
                            color: fieldColor,
                        });

                        // If bold, draw it again slightly offset or just accept the Dingbat weight
                        // Dingbats are already heavy. Bold Dingbats aren't standard in pdf-lib easily.
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
                            console.error('  Failed to embed signature image:', imgError);
                            page.drawText('(Signature Error)', { x, y: textY, size: 8, font: helveticaFont, color: rgb(1, 0, 0) });
                        }
                    }
                } else {
                    page.drawText(field.value, {
                        x: x + 2,
                        y: textY,
                        size: 9,
                        font: isBold ? helveticaBoldFont : helveticaFont,
                        color: fieldColor,
                        maxWidth: w,
                    });
                }
            } catch (textError) {
                console.error('  Error drawing content:', textError);
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

        // 6. Serialize the PDFDocument to bytes
        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF');
    }
}
