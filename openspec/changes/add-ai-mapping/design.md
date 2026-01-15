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

**Alternatives Considered:**
- **Vision-based (multimodal)**: Using GPT-4 Vision or Claude 3 Opus to analyze the PDF as an image. More accurate layout understanding but 3-5x more expensive per request. Deferred to v2 based on cost analysis.
- **Self-hosted model**: Fine-tuned open-source model (e.g., LLaMA) for lower per-request costs. Requires infrastructure, GPU resources, and maintenance. Too complex for MVP, revisit at scale.
- **Rule-based parsing**: No AI, pure pattern matching and heuristics. Insufficient accuracy for varied PDF formats and inconsistent labeling. Quick to implement but poor user experience.
- **OCR + NLP hybrid**: Use Tesseract OCR + spaCy for entity recognition. Lacks coordinate precision and struggles with complex layouts. Lower accuracy than LLM approach.

### 3. Usage Tracking
We'll add `aiMappingUsage` (Int) and `isSubscribed` (Boolean) to the `User` model.
- Free users: `aiMappingUsage < 1` allowed.
- Subscribed users: Unlimited or higher limit.

## Risks / Trade-offs
- **Accuracy**: AI might misattribute labels to fields. Users MUST be able to review and fix.
- **Cost**: LLM tokens for large PDFs. We should optimize the input JSON.
- **Page Overflow**: Handling multi-page PDFs efficiently.

## Migration Plan

**Deployment Steps:**
1. **Environment Setup**: Add `OPENAI_API_KEY` environment variable to staging and production environments
2. **Database Migration**: Run `prisma migrate dev` to add `aiMappingUsage` (Int, default 0) and `isSubscribed` (Boolean, default false) fields to User model
3. **Backend Deployment**: Deploy API endpoint `/api/pdfs/[id]/analyze` and AI service layer first
4. **Validation**: Test endpoint in staging with sample PDFs (W-9, I-9, standard forms)
5. **Frontend Deployment**: Deploy UI changes (AI Mapping button, preview mode)
6. **Feature Flag (Optional)**: Use environment variable `ENABLE_AI_MAPPING=true` for gradual rollout
7. **Monitoring**: Set up alerts for AI API errors and response times

**Rollback Strategy:**
- **Level 1 (Frontend)**: Disable AI Mapping button via feature flag, users continue with manual mapping
- **Level 2 (Backend)**: Remove API endpoint, no data corruption risk (usage counts are additive only)
- **Level 3 (Database)**: No rollback needed for new fields (nullable, don't break existing queries)
- **Cost Control**: Set max concurrent AI requests and daily budget limits in API layer

**Data Considerations:**
- Existing users default to `aiMappingUsage = 0`, eligible for free trial
- No backfill required
- Usage tracking is forward-only (no decrements)

## Open Questions
- Should we use vision-based analysis (multi-modal) for better layout understanding? **Decision**: Deferred to v2 based on cost/benefit analysis
- Should we cache AI results for identical PDFs? **Decision**: Yes, implement hash-based cache in v1.1 to reduce API costs
