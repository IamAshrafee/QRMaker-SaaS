"use server"

import bcrypt from "bcryptjs"
import { User } from "@/models/User"
import connectDB from "@/lib/db"
import { z } from "zod"

const RegisterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function registerUser(prevState: any, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    })

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { name, email, password } = validatedFields.data

    try {
        await connectDB()

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return { error: "Email already in use." }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Generate a default username from email logic or random
        // For now, simpler: check if username exists, if so append random logic
        // Implementation: simple slug from name + random 4 digits
        const baseSlug = name.toLowerCase().replace(/\s+/g, '')
        const username = `${baseSlug}${Math.floor(1000 + Math.random() * 9000)}`

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
