import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnQuickFill = nextUrl.pathname.startsWith('/quick-fill');

            if (isOnDashboard || isOnQuickFill) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
    },
    providers: [], // Add empty providers to satisfy NextAuthConfig, will be populated in auth.ts
} satisfies NextAuthConfig;
