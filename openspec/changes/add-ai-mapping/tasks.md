# Tasks: AI-Powered PDF Field Mapping

## 1. Foundation & Database
- [ ] 1.1 Update `prisma/schema.prisma` to include `aiMappingUsage` and subscription status.
- [ ] 1.2 Run database migration.
- [ ] 1.3 Add environment variables for AI service (e.g., `OPENAI_API_KEY`).

## 2. Backend Implementation
- [ ] 2.1 Create a utility to extract text and coordinates from PDF using `pdf-lib`.
- [ ] 2.2 Implement AI mapping service layer in `src/lib/ai/field-mapping.ts`.
- [ ] 2.3 Create API endpoint `POST /api/pdfs/[id]/analyze` with usage guard.
- [ ] 2.4 Add validation logic for AI-generated field coordinates.

## 3. Frontend Implementation
- [ ] 3.1 Add "AI Mapping" button to `FormBuilder` component.
- [ ] 3.2 Implement "Analyzing PDF..." loading state with progress indicator.
- [ ] 3.3 Create a "Preview AI Suggestions" mode where suggested fields are rendered in a different color (e.g., purple).
- [ ] 3.4 Implement "Confim All", "Remove", and "Edit" actions for AI suggestions.

## 4. Business Logic & Limits
- [ ] 4.1 Implement server-side check for free tier limit (1 PDF).
- [ ] 4.2 Add "Upgrade to Pro" call-to-action when limit is reached.

## 5. Testing & Validation
- [ ] 5.1 Test with a standard government form (e.g., W-9).
- [ ] 5.2 Test with a non-form PDF (flat text) to verify fallback behavior.
- [ ] 5.3 Verify coordinate alignment across different PDF scales.
