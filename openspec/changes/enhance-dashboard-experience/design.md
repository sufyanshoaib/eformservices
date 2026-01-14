# Design: Dashboard Enhancements

## 1. Landing Page Session Awareness

### Component: `src/components/landing/hero.tsx`
-   **Logic**:
    -   Use `useSession()` from `next-auth/react` (requires wrapping Hero in `SessionProvider` or making it a client component).
    -   Alternatively, fetch session in `page.tsx` (server component) and pass `isLoggedIn` prop to `Hero`.
    -   **Decision**: Check Session in Server Component (`page.tsx`) -> Pass prop to `Hero`.
-   **UI Changes**:
    -   If `isLoggedIn`:
        -   Primary CTA: "Go to Dashboard" (Link to `/dashboard/pdfs`)
        -   Secondary CTA: Keep "See how it works"
    -   If `!isLoggedIn`:
        -   Primary CTA: "Get Started Free" (Link to `/auth/signup`)

## 2. Dashboard UI Redesign

### Page: `src/app/dashboard/pdfs/page.tsx`
-   **Layout**: Grid (responsive).
-   **Card Design**:
    -   Use `Card`, `CardHeader`, `CardContent`, `CardFooter`.
    -   **Header**: PDF Name (truncated), Icon.
    -   **Content**:
        -   Metadata (Size, Upload Date).
        -   **Analytics Section**:
            -   Row with 2 columns: Views | Submissions.
            -   Small "Conversion Rate" badge.
    -   **Footer**:
        -   Actions: "Edit Form", "View Submissions", "Delete" (Destructive, behind icon or menu).
        -   "Copy Link" button if published.

## 3. Analytics Implementation

### Schema
```prisma
model Form {
  // ... existing fields
  views Int @default(0)
}
```

### Tracking
-   **Trigger**: When `src/app/s/[slug]/page.tsx` (or whatever the public form route is) loads using `useEffect` or server-side if keeping it server-only (but server-side view tracking on GET is tricky with Next.js caching).
-   **Implementation**: Server Action `incrementFormView(formId)`.
    -   Call this action in the `useEffect` of the public form component.

### Visualization
-   For this iteration, simple stats numbers on the dashboard card.
-   Metric: `Conversion Rate = (Submissions / Views) * 100`%
