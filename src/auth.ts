import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { User } from "@/models/User"
import { compare } from "bcryptjs"
import connectDB from "@/lib/db"
// @ts-ignore
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                await connectDB();
                const user = await User.findOne({ email: credentials.email });
                if (!user) return null;

                const passwordsMatch = await compare(credentials.password as string, user.password);

                if (passwordsMatch) return user;

                return null;
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.username = token.username as string | undefined;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.username = user.username as string | undefined;
            }
            return token;
        }
    },
})
