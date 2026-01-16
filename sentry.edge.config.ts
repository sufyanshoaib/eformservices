import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Set to 1.0 for full tracing in dev, tune down for prod
    tracesSampleRate: 1.0,

    // Debug: output Sentry debug info to console in dev
    debug: false,
});
