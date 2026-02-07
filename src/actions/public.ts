"use server"

import { cookies } from "next/headers"
import { Link } from "@/models/Link"
import connectDB from "@/lib/db"

export async function verifyPassword(linkId: string, password: string) {
    try {
        await connectDB()
        const link = await Link.findById(linkId)

        if (!link) {
            return { error: "Link not found" }
        }

        // In a real app, use bcrypt.compare
        // MVP: Direct comparison
        if (link.password !== password) {
            return { error: "Incorrect password" }
        }

        // Set cookie to remember access
        // Name: qr_unlock_{linkId}
        const cookieStore = await cookies()
        cookieStore.set(`qr_unlock_${linkId}`, password, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/"
        })

        return { success: true }

    } catch (error) {
        console.error("Verify Password Error:", error)
        return { error: "Verification failed" }
    }
}
