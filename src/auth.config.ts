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

            // 1. Protect Dashboard Routes (require login)
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }

            // 2. Protect Admin Routes (require login - role check done in page component)
            // NOTE: We can't check role here because middleware doesn't have access to custom JWT claims
            // Role checking is done in the admin page component using auth()
            if (isOnAdmin) {
                if (isLoggedIn) return true; // Just check if logged in, role verified in  page
                return false; // Redirect unauthenticated users to login page
            }

            // 3. Redirect Logged-In Users away from Login/Signup
            if (isOnAuth && isLoggedIn) {
                // Default to /dashboard - admin users will be redirected by login action
                return Response.redirect(new URL('/dashboard', nextUrl));
            }

            return true;
        },
    },
    providers: [], // Providers defined in auth.ts
} satisfies NextAuthConfig
