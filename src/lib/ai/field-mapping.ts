import OpenAI from 'openai';
import { PDFMetadata, TextBlock, preparePdfForAI } from '../pdf/extract';

// Field types supported by the form builder
export type FieldType = 'text' | 'number' | 'email' | 'textarea' | 'checkbox' | 'dropdown' | 'signature';

export interface SuggestedField {
    id: string;
    label: string;
    type: FieldType;
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number; // 0-1 score
    groupName?: string; // For radio buttons
    value?: string; // For radio/checkbox values
    options?: string[]; // For dropdown fields
}

export interface AIAnalysisResult {
    success: boolean;
    fields: SuggestedField[];
    error?: string;
    metadata?: {
        tokensUsed: number;
        processingTime: number;
    };
}

/**
 * Initialize OpenAI client
 * Throws error if API key is not configured
 */
function getOpenAIClient(): OpenAI {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error('OPENAI_API_KEY environment variable is not configured');
    }

    return new OpenAI({
        apiKey,
    });
}

/**
 * Generate AI prompt for PDF field detection with spatial awareness
 */
function generateFieldDetectionPrompt(metadata: PDFMetadata, textBlocks: TextBlock[]): string {
    const pdfContext = preparePdfForAI(metadata, textBlocks);

    return `You are a specialized PDF Form Layout Analyzer. Your job is to "see" the form structure based on the provided text coordinates and identify input fields.

    You will receive:
    1.  **PDF Metadata**: Page counts and dimensions.
    2.  **Text Blocks**: A list of text segments with their exact bounding boxes [x, y, width, height].
        *   Origin (0,0) is Top-Left.
        *   Text is extracted from the PDF.

    **Goal**: Return a JSON list of logical input fields that perfectly align with where a user would type or click.

    **Critical Rules for Bounding Boxes (TIGHTER IS BETTER):**
    *   **Do NOT create massive boxes.** The height of a text input should typically be 20-30 units, just enough for a single line of text.
    *   **Do NOT overlap fields.** If fields are vertically stacked, ensure their y-coordinates + height do not intersect.
    *   **Do NOT include the label text inside the field box.** The field should be adjacent to the label (to the right, or below).
    *   For **Checkboxes/Radio Buttons**, the box should be small (approx 15x15 or 20x20) and placed exactly where the visual square/circle is (usually to the left or right of the option text).

    **Understanding Spatial Relationships:**
    *   "Name: ________" -> Field starts immediately after "Name:".
    *   "Address" (centered heading) -> Field is likely a large text area below it.
    *   GRID/TABLES: If you see a row of labels "Date | Signature", the fields are below them.

    **Field Types & Groups:**
    *   **Radio Buttons**: Group related options together using the \`groupName\` property (e.g., "gender", "YesNo_Question1"). Assign a meaningful \`value\` to each option (e.g., "Male", "Yes").
    *   **Checkboxes**: Detect standalone checkboxes.

    **JSON Output Format:**
    Return ONLY a raw JSON string (no markdown formatting) with this structure:
    {
      "fields": [
        {
          "type": "text" | "number" | "date" | "radio" | "checkbox" | "select" | "textarea" | "signature",
          "label": "Label text closest to field",
          "page": 1,
          "x": 100, // Top-left X
          "y": 200, // Top-left Y
          "width": 150, // Reasonable width for input
          "height": 30, // TIGHT height (approx 30 for text)
          "groupName": "shared_name_for_radios", // Optional
          "value": "option_value", // Optional
          "confidence": 0.95 // 0.0 to 1.0
        }
      ]
    }

    **Analysis Context:**
    ${pdfContext}

    Limit to 50 most important fields. Respond ONLY with valid JSON.`;
}

/**
 * Parse AI response and validate field suggestions
 */
function parseAIResponse(response: string): SuggestedField[] {
    try {
        // Remove markdown code blocks if present
        let cleanResponse = response.trim();
        if (cleanResponse.startsWith('```')) {
            cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        }

        let parsed;
        try {
            parsed = JSON.parse(cleanResponse);
        } catch (e) {
            console.warn('JSON parse failed, attempting to repair truncated JSON...');
            const lastClosingBrace = cleanResponse.lastIndexOf('}');
            const lastClosingBracket = cleanResponse.lastIndexOf(']');

            let repaired = cleanResponse;
            if (lastClosingBracket > -1 && lastClosingBrace > -1) {
                repaired = cleanResponse.substring(0, lastClosingBrace + 1);
                if (!repaired.endsWith('}')) repaired += '}]}';
                else if (!repaired.endsWith(']')) repaired += ']}';

                try {
                    parsed = JSON.parse(repaired);
                } catch (e2) {
                    const lastComma = cleanResponse.lastIndexOf(',');
                    if (lastComma > -1) {
                        repaired = cleanResponse.substring(0, lastComma) + ']}';
                        try { parsed = JSON.parse(repaired); } catch (e3) { throw e; }
                    } else { throw e; }
                }
            } else { throw e; }
        }

        const fields = Array.isArray(parsed) ? parsed : [];
        if (parsed.fields && Array.isArray(parsed.fields)) {
            return parsed.fields
                .map((field: any, index: number) => ({
                    id: `ai-field-${Date.now()}-${index}`,
                    label: String(field.label || 'Unnamed Field'),
                    type: validateFieldType(field.type),
                    page: Math.max(1, parseInt(field.page) || 1),
                    x: Math.max(0, parseFloat(field.x) || 0),
                    y: Math.max(0, parseFloat(field.y) || 0),
                    width: Math.max(10, parseFloat(field.width) || 100),
                    height: Math.max(10, parseFloat(field.height) || 20),
                    confidence: Math.min(1, Math.max(0, parseFloat(field.confidence) || 0.5)),
                    options: Array.isArray(field.options) ? field.options : undefined,
                    groupName: typeof field.groupName === 'string' ? field.groupName : undefined,
                    value: typeof field.value === 'string' ? field.value : undefined,
                }))
                .slice(0, 50);
        }

        return fields
            .map((field: any, index: number) => ({
                id: `ai-field-${Date.now()}-${index}`,
                label: String(field.label || 'Unnamed Field'),
                type: validateFieldType(field.type),
                page: Math.max(1, parseInt(field.page) || 1),
                x: Math.max(0, parseFloat(field.x) || 0),
                y: Math.max(0, parseFloat(field.y) || 0),
                width: Math.max(10, parseFloat(field.width) || 100),
                height: Math.max(10, parseFloat(field.height) || 20),
                confidence: Math.min(1, Math.max(0, parseFloat(field.confidence) || 0.5)),
                options: Array.isArray(field.options) ? field.options : undefined,
                groupName: typeof field.groupName === 'string' ? field.groupName : undefined,
                value: typeof field.value === 'string' ? field.value : undefined,
            }))
            .slice(0, 50);
    } catch (error) {
        console.error('Failed to parse AI response:', error);
        return [];
    }
}

/**
 * Validate field type against allowed types
 */
function validateFieldType(type: any): FieldType {
    const validTypes: FieldType[] = ['text', 'number', 'email', 'textarea', 'checkbox', 'dropdown', 'signature'];
    const normalizedType = String(type || 'text').toLowerCase();

    // Map radio to checkbox/dropdown if needed, or keeping usage simple, map to text? 
    // Wait, the client doesn't support 'radio' in FieldType yet?
    // The FieldType definition at top has 'checkbox' but not 'radio'.
    // We should probably map 'radio' to 'checkbox' for now or add 'radio' support.
    // For now let's map 'radio' -> 'checkbox' and 'date' -> 'text' to be safe with existing types

    if (normalizedType === 'radio') return 'checkbox';
    if (normalizedType === 'date') return 'text';

    return validTypes.includes(normalizedType as FieldType)
        ? (normalizedType as FieldType)
        : 'text';
}

/**
 * Validate field coordinates against PDF boundaries
 */
export function validateFieldCoordinates(
    field: SuggestedField,
    metadata: PDFMetadata
): boolean {
    const pageIndex = field.page - 1;

    if (pageIndex < 0 || pageIndex >= metadata.pages.length) {
        return false;
    }

    const page = metadata.pages[pageIndex];

    // Check if field fits within page boundaries
    const fitsX = field.x >= 0 && (field.x + field.width) <= page.width;
    const fitsY = field.y >= 0 && (field.y + field.height) <= page.height;

    // Check minimum dimensions
    const hasMinSize = field.width >= 10 && field.height >= 10;

    return fitsX && fitsY && hasMinSize;
}

/**
 * Main function: Analyze PDF and generate field suggestions using AI
 */
export async function analyzePdfWithAI(
    metadata: PDFMetadata,
    textBlocks: TextBlock[],
    timeoutMs: number = 45000 // Increased timeout for larger payload
): Promise<AIAnalysisResult> {
    const startTime = Date.now();

    try {
        const client = getOpenAIClient();
        const prompt = generateFieldDetectionPrompt(metadata, textBlocks);

        // Create timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('AI analysis timeout')), timeoutMs);
        });

        // Race between API call and timeout
        const completion = await Promise.race([
            client.chat.completions.create({
                model: 'gpt-4o', // Using stronger model for spatial reasoning
                messages: [
                    {
                        role: 'system',
                        content: 'You are a PDF form analysis expert. Respond only with valid, minified JSON.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.2, // Low temperature for consistent outputs
                max_tokens: 4096, // Max output tokens for gpt-4o
                response_format: { type: "json_object" },
            }),
            timeoutPromise,
        ]);

        const responseText = completion.choices[0]?.message?.content || '[]';
        const suggestedFields = parseAIResponse(responseText);

        // Validate coordinates
        const validFields = suggestedFields.filter(field =>
            validateFieldCoordinates(field, metadata)
        );

        const processingTime = Date.now() - startTime;

        return {
            success: true,
            fields: validFields,
            metadata: {
                tokensUsed: completion.usage?.total_tokens || 0,
                processingTime,
            },
        };
    } catch (error: any) {
        console.error('AI analysis error:', error);

        const processingTime = Date.now() - startTime;

        return {
            success: false,
            fields: [],
            error: error.message || 'AI analysis failed',
            metadata: {
                tokensUsed: 0,
                processingTime,
            },
        };
    }
}

/**
 * Retry wrapper with exponential backoff
 */
export async function analyzePdfWithRetry(
    metadata: PDFMetadata,
    textBlocks: TextBlock[],
    maxRetries: number = 3
): Promise<AIAnalysisResult> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const result = await analyzePdfWithAI(metadata, textBlocks);

            if (result.success) {
                return result;
            }

            lastError = new Error(result.error || 'Analysis failed');
        } catch (error: any) {
            lastError = error;
        }

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries - 1) {
            const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    return {
        success: false,
        fields: [],
        error: lastError?.message || 'Failed after retries',
    };
}
