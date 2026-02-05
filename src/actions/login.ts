"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        // We can explicitly specify redirectTo
        await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/dashboard"
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials."
                default:
                    return "Something went wrong."
            }
        }
        throw error // Rethrow so Next.js redirects happen
    }
}

export async function logout() {
    await signOut({ redirectTo: "/login" });
}
