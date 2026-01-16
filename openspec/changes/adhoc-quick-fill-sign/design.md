# Design: Adhoc Quick Fill & Sign

## Architecture
The feature will reside in a new page `/quick-fill`. It will manage local state for the uploaded file and the added elements.

### Frontend Flow
1. **Selection**: User selects/drops a PDF.
2. **Preview**: `PDF.js` renders the PDF using a modified `AdhocPdfViewer`.
3. **Editing**:
   - `mode` state: `text` (default) or `signature`.
   - `onPageClick`: Captures relative coordinates and adds to `elements` state.
   - Text elements show an inline `<input>` that auto-focuses.
   - Signature elements show a `SignaturePad` popover.
4. **Action**: "Download" button sends `pdfUrl` (from Vercel Blob or local blob if small) and `elements` to the server.

### Backend Processing
- A new API route `/api/pdfs/adhoc-fill` or a Server Action.
- It will receive the list of elements and the PDF URL.
- It calls `generateFilledPdf` from `src/lib/pdf/generator.ts`.
- It returns the file as a downloadable blob.

## User Interface
- Minimalist header with "Quick Fill & Sign".
- Drag-and-drop zone (Initial state).
- Tool-bar (Active state):
  - [Text Tool] [Signature Tool] [Clear All] [Download PDF]
- Status indicators for uploading/generating.

## Security & Privacy
- Since no records are saved in the DB, there is minimal long-term risk.
- Files uploaded for adhoc filling should be cleaned up from temporary storage if possible, or handled as client-side-only blobs if we move to client-side PDF manipulation later. (Current plan uses server-side generation for consistency with existing features).
