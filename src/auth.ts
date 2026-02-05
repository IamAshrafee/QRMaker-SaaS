import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { User } from "@/models/User"
import { compare } from "bcryptjs"
import connectDB from "@/lib/db"
// @ts-ignore
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    await connectDB();
                    const user = await User.findOne({ email: credentials.email });
                    if (!user) return null;

                    const passwordsMatch = await compare(credentials.password as string, user.password);

                    if (passwordsMatch) {
                        // Return plain object with all fields (not Mongoose document)
                        // This ensures all fields including role are available in JWT
                        return {
                            id: user._id.toString(),
                            name: user.name,
                            email: user.email,
                            username: user.username,
                            role: user.role,
                            plan: user.plan,
                        };
                    }
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
                // Set all session data from token
                session.user.id = token.sub;
                session.user.name = token.name as string;
                session.user.username = token.username as string | undefined;
                (session.user as any).role = token.role as string | undefined;
                (session.user as any).plan = token.plan as string | undefined;

                // Validate user still exists in database (async, non-blocking)
                connectDB().then(() => {
                    User.findById(token.sub).then((user) => {
                        if (!user) {
                            console.log("⚠️ Session invalid: User no longer exists in database");
                        }
                    }).catch((error) => {
                        console.error("Session validation error:", error);
                    });
                }).catch(() => { });
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                // Store all user data in token (including role and plan)
                token.username = user.username as string | undefined;
                token.role = (user as any).role;
                token.plan = (user as any).plan;
                token.name = (user as any).name;
            }
            return token;
        }
    },
})
