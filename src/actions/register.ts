"use server"

import bcrypt from "bcryptjs"
import { User } from "@/models/User"
import connectDB from "@/lib/db"
import { z } from "zod"

const RegisterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(3, "Username must be at least 3 chars").regex(/^[a-zA-Z0-9_-]+$/, "Invalid username format"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function registerUser(prevState: any, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        name: formData.get("name"),
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
    })

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { name, username, email, password } = validatedFields.data

    try {
        await connectDB()

        // Check if Global Registration is allowed
        const { getSettings } = await import("@/actions/settings-actions");
        const settings = await getSettings();

        if (settings.system?.allowRegistration === false) {
            return { error: "New user registration is currently disabled." }
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] })
        if (existingUser) {
            if (existingUser.email === email) return { error: "Email already in use." }
            if (existingUser.username === username) return { error: "Username is already taken." }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({
            name,
            email,
            username,
            password: hashedPassword,
            provider: "credentials",
        })

        return { success: "Account created! Please log in." }

    } catch (error) {
        console.error("Registration Error:", error)
        return { error: "Something went wrong." }
    }
}
