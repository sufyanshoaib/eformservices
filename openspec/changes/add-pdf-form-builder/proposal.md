# Change: Add PDF Form Builder

## Why

Users need a way to upload PDF templates and create fillable web forms by mapping form fields to specific locations in the PDF. This is the core feature of the eFormServices platform, enabling form creators to transform static PDFs into interactive, shareable forms.

Currently, there is no capability to:
- Upload and manage PDF templates
- Create and edit form field definitions
- Map form fields to PDF coordinates visually

## What Changes

This change introduces two new capabilities:

1. **PDF Management** - Upload, store, list, and select PDF templates
2. **Form Builder** - Visual editor to create/edit form fields and map them to PDF locations

### Key Features

- **PDF Upload**: Authenticated users can upload PDF files (max 10MB)
- **PDF Library**: View list of uploaded PDFs with metadata (name, upload date, size)
- **PDF Selection**: Select a PDF to create or edit a form
- **Form Field Editor**: Left pane with field type selector (text, number, dropdown, textarea, checkbox, signature)
- **PDF Viewer**: Right pane displaying the PDF with interactive area selection
- **Field Mapping**: Drag-and-drop or click to map form fields to PDF coordinates
- **Form Persistence**: Save form schemas with field mappings per user account

## Impact

### Affected Specs
- **NEW**: `specs/pdf-management/spec.md` - PDF upload and library management
- **NEW**: `specs/form-builder/spec.md` - Form field creation and mapping

### Affected Code
- **NEW**: `/app/(dashboard)/pdfs/page.tsx` - PDF library page
- **NEW**: `/app/(dashboard)/pdfs/upload/page.tsx` - PDF upload page
- **NEW**: `/app/(dashboard)/forms/[formId]/edit/page.tsx` - Form builder editor
- **NEW**: `/app/api/pdfs/route.ts` - PDF upload and list API
- **NEW**: `/app/api/forms/route.ts` - Form CRUD API
- **NEW**: `/components/pdf/pdf-viewer.tsx` - PDF display component
- **NEW**: `/components/forms/field-selector.tsx` - Form field type selector
- **NEW**: `/components/forms/form-canvas.tsx` - Interactive PDF mapping canvas
- **NEW**: `/lib/pdf/upload.ts` - PDF upload utilities
- **NEW**: `/lib/pdf/validation.ts` - PDF validation logic
- **NEW**: Prisma schema updates for `pdfs` and `forms` tables

### Database Schema Changes
```prisma
model Pdf {
  id          String   @id @default(cuid())
  userId      String
  name        String
  fileName    String
  fileUrl     String
  fileSize    Int
  mimeType    String
  uploadedAt  DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  forms       Form[]
}

model Form {
  id              String   @id @default(cuid())
  userId          String
  pdfId           String
  name            String
  fieldMappings   Json     // Array of field definitions with coordinates
  isPublished     Boolean  @default(false)
  shareableLink   String?  @unique
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  pdf             Pdf      @relation(fields: [pdfId], references: [id], onDelete: Cascade)
  submissions     Submission[]
}
```

## Breaking Changes

None - this is a new feature with no existing functionality to break.

## Security Considerations

- PDF uploads restricted to authenticated users only
- File type validation (PDF MIME type only)
- File size limit enforcement (10MB)
- Virus scanning recommended for future implementation
- User can only access their own PDFs and forms
- Vercel Blob storage with secure URLs
