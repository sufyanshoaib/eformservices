# Design: Error Monitoring

Standard Sentry integration pattern for Next.js App Router applications.

## Configuration Strategy
- **Client Side**: Capture uncaught errors and React Error Boundary events. Use `replaysOnErrorSampleRate: 1.0` to capture sessions only when errors occur.
- **Server Side**: Instrument API routes and Server Actions.
- **Edge**: Instrument Middleware (e.g., Auth checks).

## Environment Handling
- **Development**: Enable Sentry but may suppress sending events to save quota, or use a separate "Dev" project.
- **Production**: Full reporting enabled. 
- **Privacy Setup**: Enable `scrubbing` for PII (Personally Identifiable Information). We must ensure no PDF content or raw signatures are inadvertently sent in error payloads.

## Proposed Files
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `src/app/global-error.tsx`: Catch-all error boundary for the root layout.

## Data Privacy
- Explicitly configure `beforeSend` to scrub any form data fields named `password`, `token`, `signature`, `pdfBlob`.
