# Proposal: Enhance Dashboard Experience and Analytics

## Context
The current dashboard provides minimal functionality for managing PDFs. Users have requested improvements to the UI/UX and the addition of analytics (per PDF/form). Furthermore, logged-in users landing on the homepage should see a clear "Go to Dashboard" call-to-action instead of sign-up prompts.

## Goal
Improve the overall user experience by:
1.  **Smart Navigation**: Directing logged-in users to the dashboard from the landing page.
2.  **Dashboard UI Redesign**: Modernizing the PDF library view with ShadCN cards, better empty states, and clearer actions.
3.  **Analytics**: Implementing per-form analytics to track views and submissions, visualizing this data on the dashboard.

## Scope

### In Scope
-   **Landing Page**:
    -   Update `hero.tsx` (and potentially other sections) to detect session state.
    -   Show "Go to Dashboard" button if session exists.
-   **Dashboard UI**:
    -   Redesign `/dashboard/pdfs` layout.
    -   Use proper ShadCN `Card` components for PDF items.
    -   Add better visual cues for file types and status.
-   **Analytics**:
    -   Update Prisma schema to add `views` to `Form` model (submissions are already tracked).
    -   Create a new analytics component/view on the dashboard card or a details modal.
    -   Track "View" events when a public form link is opened.
    -   Display "Views" vs "Submissions" conversion rate.

### Out of Scope
-   Deep analytics (geographic data, time spent, etc.).
-   Complex charts (keep it simple for now: counters and simple progress bars).
-   Team/Workspace features.

## Design Considerations
-   **Performance**: Session check on landing page should not block rendering (use client-side check or lightweight server check).
-   **Schema**:
    -   Add `views` (Int) to `Form`.
    -   Alternatively, create a `FormAnalytics` model if we want daily breakdowns in the future (sticking to simple counters for now as per "straightforward implementation" guardrail).
    -   Actually, let's add a `FormView` model to track timestamps for potential future graphing, but initially just show counts.
    -   *Decision*: For simplicity and scale, let's just add a `views` counter to `Form` model for now. If deeper analytics are needed later, we can migrate.
    -   Wait, simple counter is prone to abuse/spam. A `FormView` log is better but heavier. Let's stick to a simple counter for this iteration.

## Security
-   Ensure analytics incrementing is protected against basic bot spam (optional: rate limiting).
