# Tasks: Adhoc Quick Fill & Sign

- [ ] **Phase 1: Foundation**
    - [ ] Create `/src/app/quick-fill/page.tsx` with upload dropzone.
    - [ ] Implement `AdhocPdfViewer` (simplified version of `PdfViewer`).
- [ ] **Phase 2: Editor Logic**
    - [ ] Implement `click-to-place` coordinate capturing on the PDF canvas.
    - [ ] Create `AdhocField` component for inline text editing.
    - [ ] Implement signature placement and storage in local state.
- [ ] **Phase 3: Generation & API**
    - [ ] Add `/api/pdfs/adhoc-fill` route.
    - [ ] Integrate with `generateFilledPdf` helper.
    - [ ] Implement "Download" functionality with loading states.
- [ ] **Phase 4: Cleanup & Polish**
    - [ ] Add instructions/tooltips for users.
    - [ ] Add "Clear All" and "Undo" actions.
    - [ ] Final visual alignment and mobile responsiveness.
