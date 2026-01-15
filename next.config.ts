import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    serverExternalPackages: ['pdfjs-dist', 'canvas'],
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
};

export default nextConfig;
