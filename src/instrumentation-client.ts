import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Replay may only be available for the client
    replaysOnErrorSampleRate: 1.0,

    // Replay sample rate (starts at 0.1 for production)
    replaysSessionSampleRate: 0.1,

    // Integrations
    integrations: [
        Sentry.replayIntegration({
            // Additional replay configuration
            maskAllText: true,
            blockAllMedia: true,
        }),
    ],

    // Privacy: Scrub sensitive data before sending
    beforeSend(event) {
        // Sentry default scrubbers handle many standard PII fields
        return event;
    },

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
