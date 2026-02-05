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
            const isOnAuth = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/signup');

            // 1. Protect Dashboard Routes
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }

            // 2. Protect Admin Routes
            if (isOnAdmin) {
                if (isLoggedIn && (auth.user as any).role === 'admin') return true;
                return Response.redirect(new URL('/dashboard', nextUrl)); // Redirect non-admins to user dashboard
            }

            // 3. Redirect Logged-In Users away from Login/Signup
            if (isOnAuth && isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }

            return true;
        },
    },
    providers: [], // Providers defined in auth.ts
} satisfies NextAuthConfig
