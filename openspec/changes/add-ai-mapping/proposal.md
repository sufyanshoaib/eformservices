# Change: Add AI-Powered PDF Field Mapping

## Why
Currently, users must manually drag and drop fields to map them to PDF coordinates, which is time-consuming for large forms. This change introduces an AI-powered mapping feature that automatically detects PDF fields and suggests the best-fit form inputs, significantly reducing setup time for form creators.

## What Changes
- **AI Mapping Service**: Integration with an LLM (OpenAI or Anthropic) to analyze PDF structure and content.
- **Automated Field Detection**: Backend logic to extract text/keys from PDF and map them to standard form field types.
- **AI Mapping UI**: A new "AI Mapping" button in the form builder that triggers the analysis and populates suggested mappings.
- **Review & Edit Workflow**: An interactive UI for users to confirm, update, or delete AI-suggested fields.
- **Subscription Guard**: Access restricted to subscribed users, with a one-time free trial (1 PDF) for all users.

## Impact
- **Affected specs**: `form-builder` (new capability `ai-mapping`)
- **Affected code**: 
    - `src/components/forms/form-builder.tsx` (UI for triggering AI)
    - `src/app/api/pdfs/[id]/analyze/route.ts` (new endpoint)
    - `src/lib/ai/field-mapping.ts` (logic for AI integration)
    - `prisma/schema.prisma` (user usage tracking)
