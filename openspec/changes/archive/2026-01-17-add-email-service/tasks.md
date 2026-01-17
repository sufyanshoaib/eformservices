# Tasks: Email Service (Resend)

- [x] **1. Setup & Configuration**
    - [x] Install `resend` SDK.
    - [x] Configure `RESEND_API_KEY` (User to provide).
    - [x] Verify domain verification status (User action).
- [x] **2. Implementation**
    - [x] Create `src/lib/email/client.ts` (Shared client instance).
    - [x] Create `src/lib/email/templates/welcome.tsx` (Welcome email component).
    - [x] Create `src/lib/email/templates/submission-receipt.tsx` (Receipt component).
    - [x] Implement `sendWelcomeEmail` (in `auth.ts`).
    - [x] Implement `sendSubmissionReceipt` (in `route.ts`).
- [x] **3. Integration**
    - [x] Hook `sendWelcomeEmail` into `createUser` event.
    - [x] Hook `sendSubmissionReceipt` into form submission API.
- [ ] **4. Verification**
    - [ ] Trigger a sign-up and confirm email delivery.
    - [ ] Submit a form and confirm receipt with valid PDF attachment.
