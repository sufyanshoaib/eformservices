# Proposal: Add Form Sharing Options

## Context
Currently, users can only copy the shareable link of a published form to their clipboard. While functional, it requires manual effort to share across different platforms like social media or email. Adding native sharing options will improve the user experience and encourage more form distributions.

## Goal
Provide a "Share" button alongside the "Copy Link" button in the dashboard that opens a set of platform-specific sharing options (Email, WhatsApp, Twitter/X, LinkedIn) or uses the Web Share API on supported devices.

## Scope

### In Scope
-   **New Component**: `ShareFormButton.tsx` using ShadCN dropdown or popover.
-   **Platforms**:
    -   Email (mailto)
    -   WhatsApp (wa.me)
    -   Twitter/X (intent)
    -   LinkedIn (share article)
    -   Web Share API (for mobile/supported browsers)
-   **Dashboard Integration**: Add the button to the PDF card in `/dashboard/pdfs`.

### Out of Scope
-   In-app messaging/sharing.
-   Detailed analytics for platform-specific sharing hits (initially).
-   Customizable share messages (fixed templates for now).

## Design Considerations
-   **UI**: Use a generic "Share" icon (Lucide `Share2`).
-   **Consistency**: Match the styling of the existing `CopyLinkButton`.

## Security
-   Ensure the shareable link is only available for published forms.
