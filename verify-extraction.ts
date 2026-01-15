
const { PDFDocument, rgb } = require('pdf-lib');
// We need to use ts-node or similar to run the typescript file, or just use the compiled output.
// For simplicity in this environment, I will try to use the extract.ts functions if I can import them.
// Since I cannot easily compile/run TS on the fly without setup, I will "mock" the text here but rely on the actual code running.
// Wait, I can use `npx tsx` to run typescript files directly.

import { extractTextBlocks } from './src/lib/pdf/extract';

async function verify() {
    console.log('Generating test PDF...');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();

    // Draw text at specific location
    // PDF Coordinates: (50, 350) which is top-leftish (Y is from bottom)
    // 350y from bottom = 50y from top in a 400h page.
    page.drawText('Full Name:', {
        x: 50,
        y: 350,
        size: 12,
    });

    // Another text
    page.drawText('Email Address:', {
        x: 50,
        y: 300,
        size: 12,
    });

    const pdfBytes = await pdfDoc.save();
    console.log('PDF generated. Extracting text blocks...');

    try {
        const blocks = await extractTextBlocks(pdfBytes);
        console.log('Extraction complete. Found blocks:', blocks.length);
        console.log(JSON.stringify(blocks, null, 2));

        const nameBlock = blocks.find(b => b.text.includes('Full Name'));
        if (nameBlock) {
            console.log('✅ Found "Full Name" block');
            console.log(`   Coordinates: x=${nameBlock.x}, y=${nameBlock.y}`);
            // Check coordinate accuracy (allow small variance)
            // Expect x ~ 50. 
            // Expect y ~ 50 (converted to top-left). 
            // PDF Y=350. Page H=400. Top-Left Y = 400 - 350 - height.
            // Height approx 12. So Y should be approx 38.
            if (Math.abs(nameBlock.x - 50) < 5) console.log('   X coordinate matches expected (approx 50)');
            else console.log('   X coordinate mismatch (expected ~50)');
        } else {
            console.log('❌ Failed to find "Full Name" block');
        }
    } catch (e) {
        console.error('Extraction failed:', e);
    }
}

verify();
