# Change: Organize PDF Documents

## Why
Users currently have a flat list of PDFs, which becomes unmanageable as the number of documents grows. There is also no way to group related documents. additionally, the public-facing form view lacks a clear title, confusing users about which document they are filling out.

## What Changes
- **PDF Folders**: Users can create, rename, and delete folders to organize their PDFs.
- **Move Functionality**: Users can move PDFs into and out of folders.
- **Form Title Display**: The form's name/title will be prominently displayed on the public form filling page.
- **Database Schema**:
    - Add `PdfFolder` model.
    - Add `folderId` to `Pdf` model.

## Impact
- Affected specs: `pdf-management`, `form-presentation` (new)
- Affected code:
    - Backend: Prisma schema, API routes for folders and PDFs.
    - Frontend: PDF Dashboard (`/dashboard/pdfs`), Public Form Page (`/s/[slug]`).
