"use server"

import connectDB from "@/lib/db"
import { User } from "@/models/User"
import { z } from "zod"

const UsernameSchema = z.string().min(3).regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, dashes and underscores allowed")

export async function checkUsername(username: string) {
    const result = UsernameSchema.safeParse(username)
    if (!result.success) {
        return { available: false, error: result.error.issues[0].message }
    }

    await connectDB()

    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return { available: false, error: "Username is already taken" }
    }

    return { available: true }
}
