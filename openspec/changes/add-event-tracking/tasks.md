# Tasks: Event Tracking (PostHog)

- [ ] **1. Setup & Integration**
    - [ ] Install `posthog-js`.
    - [ ] Create `src/lib/analytics/posthog-provider.tsx` (Client Component).
    - [ ] Add `PostHogProvider` to `src/app/layout.tsx`.
- [ ] **2. Configuration**
    - [ ] Set up environment variables (`NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`).
    - [ ] Configure `maskInputOptions` to protect PII in session replays.
- [ ] **3. Verification**
    - [ ] Verify pageview events are firing on route changes.
    - [ ] Verify button clicks are autocaptured.
    - [ ] Confirm session recordings are being generated and sensitive text is masked.
