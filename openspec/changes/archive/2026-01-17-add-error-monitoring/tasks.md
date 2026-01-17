# Tasks: Error Monitoring (Sentry)

- [x] **1. Setup & Installation**
    - [x] Run the Sentry wizard (Performed manual installation).
    - [x] Verify `next.config.js` (or `.ts`) modifications.
    - [x] Create `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts`.
- [x] **2. Configuration**
    - [x] Set up environment variables (User to provide).
    - [x] Configure source map uploading in `next.config.ts` (keeping build secure).
    - [x] Tune sampling rates (Set to 1.0 initially).
- [ ] **3. Verification**
    - [x] Create a hidden test route `/api/debug-sentry` that throws a test error.
    - [ ] Trigger a client-side error and verify it appears in the Sentry dashboard. **(User Action Required)**
    - [ ] Verify source maps are uploaded and stack traces are readable.
