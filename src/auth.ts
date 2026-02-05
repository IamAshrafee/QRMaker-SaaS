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

                try {
                    await connectDB();
                    console.log("Auth: Checking user", credentials.email)
                    const user = await User.findOne({ email: credentials.email });
                    if (!user) {
                        console.log("Auth: User not found")
                        return null;
                    }

                    console.log("Auth: Verifying password")
                    const passwordsMatch = await compare(credentials.password as string, user.password);

                    if (passwordsMatch) {
                        console.log("Auth: Password match, returning user")
                        return user;
                    }
                    console.log("Auth: Password mismatch")
                    return null;
                } catch (error) {
                    console.error("Auth Error:", error)
                    return null
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.username = token.username as string | undefined;
                (session.user as any).role = token.role as string | undefined; // Pass role to session
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.username = user.username as string | undefined;
                token.role = (user as any).role; // Store role in token
            }
            return token;
        }
    },
})
