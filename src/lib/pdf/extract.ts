import './polyfill'; // Polyfills must run first

export interface TextBlock {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
}

export interface PDFMetadata {
    pageCount: number;
    pages: Array<{
        width: number;
        height: number;
        number: number;
    }>;
}

// Dynamic import helper to ensure polyfills apply before PDF.js loads
async function getPdfJs() {
    // @ts-ignore
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    return pdfjsLib;
}

/**
 * Extract text content and coordinates from a PDF
 */
export async function extractPdfMetadata(pdfBytes: Uint8Array | ArrayBuffer): Promise<PDFMetadata> {
    try {
        const pdfjsLib = await getPdfJs();
        const data = new Uint8Array(pdfBytes);

        const loadingTask = pdfjsLib.getDocument({
            data,
            isEvalSupported: false,
            useSystemFonts: true,
            disableFontFace: true,
        });

        const pdfDoc = await loadingTask.promise;
        const pageCount = pdfDoc.numPages;

        const pages = [];
        for (let i = 1; i <= pageCount; i++) {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale: 1.0 });
            pages.push({
                width: viewport.width,
                height: viewport.height,
                number: i
            });
        }

        return {
            pageCount,
            pages
        };
    } catch (error) {
        console.error('Error extracting PDF metadata:', error);
        throw new Error('Failed to extract PDF metadata');
    }
}

/**
 * Extract text blocks with coordinates from PDF
 * Returns a structure suitable for LLM processing
 */
export async function extractTextBlocks(source: string | Uint8Array | ArrayBuffer): Promise<TextBlock[]> {
    try {
        const pdfjsLib = await getPdfJs();
        let pdfBytes: Uint8Array;

        if (typeof source === 'string') {
            const response = await fetch(source);
            if (!response.ok) {
                throw new Error(`Failed to fetch PDF: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            pdfBytes = new Uint8Array(arrayBuffer);
        } else if (source instanceof ArrayBuffer) {
            pdfBytes = new Uint8Array(source);
        } else {
            pdfBytes = source;
        }

        const loadingTask = pdfjsLib.getDocument({
            data: pdfBytes,
            isEvalSupported: false,
            useSystemFonts: true,
            disableFontFace: true,
        });

        const pdfDoc = await loadingTask.promise;
        const textBlocks: TextBlock[] = [];

        for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale: 1.0 });
            const textContent = await page.getTextContent();

            textContent.items.forEach((item: any) => {
                if ('str' in item && item.str.trim().length > 0) {
                    const tx = item.transform;
                    const x = tx[4];
                    const pdfY = tx[5];

                    const width = item.width || 0;
                    const height = item.height || Math.abs(tx[3]);

                    // Flip Y (PDF is bottom-up, Canvas is top-down)
                    const y = viewport.height - pdfY - (height * 0.8);

                    textBlocks.push({
                        text: item.str,
                        x: Math.round(x),
                        y: Math.round(y),
                        width: Math.round(width),
                        height: Math.round(height),
                        page: i
                    });
                }
            });
        }

        return textBlocks;
    } catch (error) {
        console.error('Error extracting text blocks:', error);
        throw new Error('Failed to extract text from PDF');
    }
}

/**
 * Prepare PDF data for AI analysis
 */
export function preparePdfForAI(metadata: PDFMetadata, textBlocks: TextBlock[]): string {
    const pdfInfo = {
        pageCount: metadata.pageCount,
        pages: metadata.pages.map(p => ({
            number: p.number,
            dimensions: {
                width: Math.round(p.width),
                height: Math.round(p.height),
            },
        })),
        textBlocks: textBlocks.map(block => ({
            text: block.text,
            box: [block.x, block.y, block.width, block.height],
            page: block.page,
        })),
    };

    return JSON.stringify(pdfInfo, null, 2);
}
