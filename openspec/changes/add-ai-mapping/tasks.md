# Tasks: AI-Powered PDF Field Mapping

## 1. Foundation & Database
- [x] 1.1 Update `prisma/schema.prisma` to include `aiMappingUsage` and subscription status.
- [x] 1.2 Run database migration.
- [x] 1.3 Add environment variables for AI service (e.g., `OPENAI_API_KEY`).

## 2. Backend Implementation
- [x] 2.1 Create a utility to extract text and coordinates from PDF using `pdf-lib`.
- [x] 2.2 Implement AI mapping service layer in `src/lib/ai/field-mapping.ts`.
- [x] 2.3 Create API endpoint `POST /api/pdfs/[id]/analyze` with usage guard.
- [x] 2.4 Add validation logic for AI-generated field coordinates.

## 3. Frontend Implementation
- [x] 3.1 Add "AI Mapping" button to `FormBuilder` component.
- [x] 3.2 Implement "Analyzing PDF..." loading state with progress indicator.
- [x] 3.3 Create a "Preview AI Suggestions" mode where suggested fields are rendered in a different color (e.g., purple).
- [x] 3.4 Implement "Confirm All", "Remove", and "Edit" actions for AI suggestions.

## 4. Business Logic & Limits
- [x] 4.1 Implement server-side check for free tier limit (1 PDF).
- [x] 4.2 Add "Upgrade to Pro" call-to-action when limit is reached.

## 5. Testing & Validation
- [x] 5.1 Test with a standard government form (e.g., W-9).
- [x] 5.2 Test with a non-form PDF (flat text) to verify fallback behavior.
- [x] 5.3 Verify coordinate alignment across different PDF scales.

## 6. Error Handling & Monitoring
- [x] 6.1 Add error logging for AI API failures with structured error context.
- [x] 6.2 Implement retry logic with exponential backoff (3 retries, max 10s delay).
- [x] 6.3 Add monitoring for AI API response times and success rates.
- [x] 6.4 Create fallback message when AI service is unavailable.
- [x] 6.5 Implement timeout handling (30s max) for AI requests.
- [x] 6.6 Validate AI-generated coordinates against PDF boundaries.

## 7. Security & Rate Limiting
- [x] 7.1 Add rate limiting to `/api/pdfs/[id]/analyze` (5 requests/minute per user).
- [x] 7.2 Validate and sanitize AI-generated coordinates and field types.
- [x] 7.3 Ensure API key is stored in environment variables, never exposed client-side.
- [x] 7.4 Add CSRF protection to AI mapping endpoint.
- [x] 7.5 Implement request validation (authenticated users only, valid PDF ID).

## 8. Documentation & Deployment
- [x] 8.1 Document AI mapping feature in user guide.
- [x] 8.2 Add code comments explaining AI prompt structure and response parsing.
- [x] 8.3 Create deployment checklist (environment variables, database migration).
- [x] 8.4 Set up staging environment tests before production deployment.

## 9. Future Enhancements (For Accurate Auto-Detection)
- [ ] 9.1 Integrate `pdfjs-dist` for text extraction with coordinates
  - Install `pdfjs-dist` package
  - Extract text content with position data
  - Parse text blocks into structured format for AI context
- [ ] 9.2 Implement coordinate-aware AI prompting
   - Feed X/Y text map to LLM
   - Request field coordinates relative to text labels
- [ ] 9.3 Add OCR support for scanned PDFs
  - Integrate Tesseract.js or similar OCR library
  - Extract text from image-based PDFs
  - Combine with NER for field classification
- [ ] 9.4 Implement intelligent field type detection
  - Pattern matching for email, phone, zip codes
  - Named Entity Recognition (NER) for names, addresses
  - Field label proximity analysis
- [ ] 9.5 Build field caching system
  - Hash-based PDF identification
  - Store successful mappings for reuse
  - Reduce API costs for identical PDFs
- [ ] 9.6 Create field suggestion confidence UI
  - Visual indicators for high/low confidence fields
  - "Verify" workflow for low-confidence suggestions
  - User feedback loop to improve accuracy
- [ ] 9.7 Support multi-page form analysis
  - Analyze all pages, not just first page
  - Maintain context across pages
  - Handle page breaks and continued fields
- [ ] 9.8 Add custom field template library
  - Pre-built templates for W-9, I-9, 1040, etc.
  - User-created template sharing
  - Template marketplace for common forms
