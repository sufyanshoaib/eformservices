# Tasks: Event Tracking (PostHog)

- [x] **1. Setup & Integration**
    - [x] Install `posthog-js`.
    - [x] Create `src/lib/analytics/posthog-provider.tsx` (Client Component).
    - [x] Add `PostHogProvider` to `src/app/layout.tsx`.
- [x] **2. Configuration**
    - [x] Set up environment variables (User to provide).
    - [x] Configure `maskInputOptions` to protect PII in session replays.
- [ ] **3. Verification**
    - [ ] Verify pageview events are firing on route changes.
    - [ ] Verify button clicks are autocaptured.
    - [ ] Confirm session recordings are being generated and sensitive text is masked.
