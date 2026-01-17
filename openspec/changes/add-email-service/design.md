# Design: Email Service

## Stack
- **Provider**: Resend (API-based, high deliverability).
- **Templating**: `react-email` (or raw HTML/Tailwind) for DX.

## Component Structure
We will store email templates alongside other UI components or in a dedicated `lib` structure.

```
src/
  lib/
    email/
      client.ts        // Resend instance export
      templates/
        welcome.tsx    // Welcome email component
        receipt.tsx    // Submission receipt
```

## Sending Logic
- **Welcome Email**: Triggered in `auth.ts` inside the `signIn` callback (first-time detection) or after successful `signUp`.
- **Receipt Email**: Triggered in `/api/submit/route.ts` after PDF generation. The PDF buffer will be attached directly to the email payload.

## Attachments
Resend supports attachments via Buffer. We will pass the generated PDF bytes directly:
```ts
attachments: [
  {
    filename: 'form_submission.pdf',
    content: pdfBuffer,
  },
]
```
