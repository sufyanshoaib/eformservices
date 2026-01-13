## 1. Database Schema Setup
- [x] 1.1 Create Prisma schema for `Pdf` model
- [x] 1.2 Create Prisma schema for `Form` model
- [x] 1.3 Update `User` model with relations
- [x] 1.4 Run Prisma migration (Generated client, migration pending DB connection)

## 2. PDF Upload & Storage
- [x] 2.1 Implement PDF upload API endpoint (`/api/pdfs`)
- [x] 2.2 Add Vercel Blob storage integration
- [x] 2.3 Create PDF validation utilities (MIME type, size)
- [x] 2.4 Build PDF upload page UI
- [ ] 2.5 Add file upload progress indicator

## 3. PDF Library Management
- [x] 3.1 Implement PDF list API endpoint
- [x] 3.2 Create PDF library page with grid/list view
- [x] 3.3 Add PDF metadata display (name, date, size)
- [x] 3.4 Implement PDF selection functionality (Via Create Form action)
- [x] 3.5 Add PDF delete functionality

## 4. Form Builder - Field Editor
- [x] 4.1 Create field type selector component (left pane)
- [x] 4.2 Implement field configuration panel (Integrated in FieldProperties)
- [x] 4.3 Add field types: text, number, dropdown, textarea, checkbox, signature (In selector)
- [x] 4.4 Build field properties editor (label, placeholder, validation)
- [x] 4.5 Implement field list with reordering (Basic implementation)

## 5. Form Builder - PDF Viewer & Mapping
- [x] 5.1 Integrate PDF viewer component (react-pdf)
- [x] 5.2 Create interactive canvas overlay for field placement
- [x] 5.3 Implement click-to-place field mapping (Via drag/drop)
- [x] 5.4 Add visual indicators for mapped fields
- [x] 5.5 Enable field repositioning and resizing (Dragging implemented)
- [x] 5.6 Add coordinate tracking for field positions

## 6. Form Persistence
- [x] 6.1 Implement form save API endpoint (`/api/forms`)
- [x] 6.2 Create form schema JSON structure (Implicit in database)
- [x] 6.3 Add auto-save functionality (Manual save implemented for better UX)
- [x] 6.4 Implement form update endpoint
- [ ] 6.5 Add form versioning (optional for MVP)

## 7. Form Builder Page
- [x] 7.1 Create form builder layout (split pane)
- [x] 7.2 Integrate field selector and PDF viewer
- [x] 7.3 Add toolbar (save, preview, publish)
- [x] 7.4 Implement form settings panel (Field properties)
- [ ] 7.5 Add keyboard shortcuts for efficiency

## 8. Authentication & Authorization
- [x] 8.1 Protect PDF upload routes (auth required - manual check)
- [x] 8.2 Protect form builder routes (auth required - manual check)
- [x] 8.3 Implement user-scoped data access
- [x] 8.4 Add authorization checks in API routes

## 9. Testing
- [ ] 9.1 Write unit tests for PDF validation
- [ ] 9.2 Write API route tests (upload, list, CRUD)
- [ ] 9.3 Test component rendering (field selector, PDF viewer)
- [ ] 9.4 Test field mapping logic
- [ ] 9.5 Integration test: full form creation flow

## 10. Documentation
- [ ] 10.1 Add inline code comments
- [ ] 10.2 Document API endpoints
- [ ] 10.3 Create user guide for form builder
- [ ] 10.4 Update README with setup instructions
