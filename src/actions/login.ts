"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { User } from "@/models/User"
import connectDB from "@/lib/db"
import { redirect } from "next/navigation"

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        // Get user role to determine redirect
        const email = formData.get("email") as string;

        await connectDB();
        const user = await User.findOne({ email });

        // Determine redirect based on role
        const redirectTo = user?.role === "admin" ? "/admin" : "/dashboard";

        // Sign in without auto-redirect
        await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false
        })

        // Manually redirect based on role
        redirect(redirectTo);

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials."
                default:
                    return "Something went wrong."
            }
        }
        // If it's a redirect error (from redirect() call), throw it
        throw error
    }
}

export async function logout() {
    await signOut({ redirectTo: "/login" });
}
