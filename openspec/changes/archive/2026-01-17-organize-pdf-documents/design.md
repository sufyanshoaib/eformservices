## Context
Users need a way to organize their growing collection of PDF templates. A simple folder structure is standard expectation. The public form also needs better context (a title).

## Goals / Non-Goals
- **Goals**:
    - Single-level folder structure (keep it simple first).
    - CRUD for folders.
    - Move PDFs between folders.
    - Show title on public page.
- **Non-Goals**:
    - Nested folders (sub-folders).
    - Sharing folders.
    - Drag-and-drop UI (use standard actions first).

## Decisions
- **Decision**: Use a flat `PdfFolder` model with `userId`.
    - **Why**: Simplifies database queries and UI logic. Nested folders add complexity (recursion, path management) that isn't strictly requested ("different folders").
- **Decision**: Public Form Title uses `Form.name`.
    - **Why**: Use the existing `Form` model's name. If `Form.name` is missing or same as PDF, it still works. User creates a "Form" from a "PDF", and the Form name allows customization (e.g., "Invoice - Client A") different from the file ("invoice_template_v2.pdf").

## Risks / Trade-offs
- **Risk**: Users might want nested folders immediately.
    - **Mitigation**: Launch with flat, add nesting later if requested.

## Migration Plan
- Run Prisma migration. Existing PDFs will have `folderId: null` (root).
