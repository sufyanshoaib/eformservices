# Design: AI-Powered PDF Field Mapping

## Context
The goal is to automate the tedious process of mapping PDF form fields to web form inputs. We will use an LLM to "read" the PDF and suggest mappings.

## Goals
- Detect field labels, types (text, checkbox, etc.), and positions.
- Provide a high-confidence set of initial mappings.
- Allow users to "Apply" or "Discard" AI suggestions.
- Enforce usage limits (1 free PDF for non-subscribers).

## Decisions

### 1. Data Capture Strategy
We will use `pdf-lib` on the backend to extract text content and field metadata (if the PDF has actual form fields). If it's a "flat" PDF, we'll need to rely on coordinate-based text extraction or OCR. For the first iteration, we'll focus on text-based coordinate extraction.

### 2. AI Integration
- **Model**: OpenAI GPT-4o or similar, capable of processing structured text data + coordinates.
- **Input**: A JSON representation of text blocks on the PDF with their (x, y, w, h) coordinates.
- **Output**: A list of `FormField` objects matching our existing schema.

### 3. Usage Tracking
We'll add `aiMappingUsage` (Int) and `isSubscribed` (Boolean) to the `User` model.
- Free users: `aiMappingUsage < 1` allowed.
- Subscribed users: Unlimited or higher limit.

## Risks / Trade-offs
- **Accuracy**: AI might misattribute labels to fields. Users MUST be able to review and fix.
- **Cost**: LLM tokens for large PDFs. We should optimize the input JSON.
- **Page Overflow**: Handling multi-page PDFs efficiently.

## Open Questions
- Should we use vision-based analysis (multi-modal) for better layout understanding? (Starting with text-based as it's cheaper/faster).
