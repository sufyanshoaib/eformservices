# Proposal: Implement Social Authentication Pages

## Context
The project relies on NextAuth.js v5 for authentication. The configuration (`auth.ts`) is present, but the actual UI pages for Sign In and Sign Up are missing. The user needs a proper login interface that supports Google and Facebook authentication.

## Goal
Create the user interface for authentication, supporting social login (Google/Facebook) and email/password sign-in and registration, and ensure the existing NextAuth configuration works seamlessly with the new UI.

## Scope
-   **Frontend**: Create `/auth/signin` and `/auth/signup` pages using ShadCN UI components.
-   **Email Auth**: Implement email/password login and registration flows.
-   **Social Auth**: Connect the UI to Google and Facebook providers.
-   **Integration**: Connect the UI to the `signIn` and `signUp` server actions provided by NextAuth/Prisma.
-   **Configuration**: Verify environment variable requirements for Google and Facebook providers.

## Dependencies
-   `next-auth` (already installed)
-   `lucide-react` (icons for buttons)
-   `shadcn/ui` components (Button, Card, Input - already available or to be added)
