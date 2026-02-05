import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }

            if (isOnAdmin) {
                // Add Role check here if available in auth object (needs session strategy update)
                if (isLoggedIn) return true;
                return false;
            }

            return true;
        },
    },
    providers: [], // Providers defined in auth.ts
} satisfies NextAuthConfig
