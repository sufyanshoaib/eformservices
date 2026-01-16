# Proposal: Adhoc Quick Fill & Sign

## Why
Currently, users must first upload a PDF and manually configure form fields before they or others can fill it out. This is overhead for simple tasks like signing a single document or filling out a one-off form. Users want a "Fast Track" experience where they can upload a PDF and immediately start placing text and signatures wherever they click.

## What
- **New Public Route**: `/quick-fill` accessible to anyone.
- **Interactive PDF Editor**:
  - Upload PDF directly on the page.
  - Click-to-place text elements.
  - Click-to-place signature elements.
  - Real-time editing of placed elements.
- **Instant Generation**:
  - "Download" button that generates the filled PDF immediately in the browser (via server action or API).
- **No Database Persistence**:
  - The adhoc session does not require creating a `Form` or `Pdf` record in the database, reducing clutter and privacy concerns for one-off tasks.

## Impact
- **New Components**: `QuickFillEditor`, `AdhocPdfViewer`.
- **API**: Reuse `src/lib/pdf/generator.ts` logic.
- **UX**: Provides a high-value, frictionless entry point for new users.
