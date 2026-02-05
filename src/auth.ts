import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import clientPromise from "@/lib/db" // Adjust if using adapter
import { User } from "@/models/User" // We might need an adapter or manual check
import { compare } from "bcryptjs"
import connectDB from "@/lib/db"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                await connectDB();
                const user = await User.findOne({ email: credentials.email });
                if (!user) return null; // Or throw error

                const passwordsMatch = await compare(credentials.password as string, user.password);

                if (passwordsMatch) return user;

                return null;
            },
        }),
        // Social Providers would act here
    ],
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token }) {
            return token;
        }
    },
})
