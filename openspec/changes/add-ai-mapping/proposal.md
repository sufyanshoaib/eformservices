# Change: Add AI-Powered PDF Field Mapping

**Status**: In Progress
**Reason**: Implementing high-precision mapping using `pdfjs-dist` for coordinate-based text extraction. This allows the AI to "see" the form layout without using expensive vision APIs.

## Why
Currently, users must manually drag and drop fields to map them to PDF coordinates, which is time-consuming for large forms. This change introduces an AI-powered mapping feature that automatically detects PDF fields and suggests the best-fit form inputs, significantly reducing setup time for form creators.

## What Changes
- **AI Mapping Service**: Integration with an LLM (OpenAI or Anthropic) to analyze PDF structure and content.
- **Automated Field Detection**: Backend logic to extract text/keys from PDF and map them to standard form field types.
- **AI Mapping UI**: A new "AI Mapping" button in the form builder that triggers the analysis and populates suggested mappings.
- **Review & Edit Workflow**: An interactive UI for users to confirm, update, or delete AI-suggested fields.
- **Subscription Guard**: Access restricted to subscribed users, with a one-time free trial (1 PDF) for all users.

## Impact
- **Affected specs**: New capability `ai-mapping` (creates new spec, does not modify existing specs)
- **Affected code**: 
    - `src/components/forms/form-canvas.tsx` (AI button + preview mode)
    - `src/app/api/pdfs/[id]/analyze/route.ts` (new API endpoint)
    - `src/lib/ai/field-mapping.ts` (AI integration and response parsing)
    - `prisma/schema.prisma` (add `aiMappingUsage` and `isSubscribed` to User model)
- **New dependencies**: 
    - `openai` (npm package for API integration)
    - `pdfjs-dist` (PDF parsing and coordinate extraction)
- **Environment variables**:
    - `OPENAI_API_KEY` (required for production)
