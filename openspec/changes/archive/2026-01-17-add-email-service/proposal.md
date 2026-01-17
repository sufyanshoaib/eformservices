# Proposal: Add Email Service (Resend)

Integrate Resend to enable transactional emails for key user actions. This ensures users are notified of important events like account creation and document completion, improving engagement and trust.

## Problem
Currently, the application relies solely on UI feedback. Users do not receive:
- Welcome emails upon sign-up.
- Confirmation when a PDF form is filled.
- Copies of their generated PDFs via email (a common user expectation).

## Proposed Solution
- Integrate the `resend` SDK.
- Create a reusable `EmailService` abstraction.
- Use `react-email` (or standard HTML templates) for consistent branding.
- Implement two initial notification types:
    1.  **Welcome Email**: Sent on first login/signup.
    2.  **Form Submission Receipt**: Sent to the form owner (and optionally the respondent) with the PDF attached.

## Capabilities
- **Reliability**: High deliverability for transactional messages.
- **Auditing**: Track delivery status via the Resend dashboard.
- **Scalability**: Capable of handling increased volume as the user base grows.
