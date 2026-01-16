import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
    /* config options here */
    serverExternalPackages: ['pdfjs-dist', 'canvas'],
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
};

export default withSentryConfig(nextConfig, {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "eformly",
    project: "javascript-nextjs",

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,


    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    sourcemaps: {
        disable: true,
    },

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
});
