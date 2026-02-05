"use server"

import { auth } from "@/auth"
import connectDB from "@/lib/db"
import { Link } from "@/models/Link"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// --- Schema Validation ---
const CreateLinkSchema = z.object({
    destinationUrl: z.string().url("Invalid URL format"),
    type: z.enum(["qr", "bio"]),
    title: z.string().optional(),
    qrConfig: z.object({
        color: z.string(),
        bgColor: z.string(),
        frame: z.string(),
    }).optional(),
})

// --- Helper: Generate Slug ---
async function generateUniqueSlug(): Promise<string> {
    let slug = ""
    let isUnique = false
    while (!isUnique) {
        // Generate 6-char random string
        slug = Math.random().toString(36).substring(2, 8)
        const existing = await Link.findOne({ slug })
        if (!existing) isUnique = true
    }
    return slug
}

// --- Actions ---

export async function createLink(prevState: any, formData: FormData) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return { error: "Unauthorized" }
        }

        // Parse raw data from FormData or direct JSON if we change approach
        // For now, let's assume raw data is passed as a JSON string in a hidden field OR we act as a direct API
        // ACTUALLY: It's better to accept standard arguments for server actions used in client components
    } catch (err) {
        // placeholder
    }
}

// Rewriting createLink to take direct objects for easier Client Component usage
export async function createQR(data: {
    destinationUrl: string,
    color: string,
    bgColor: string,
    title?: string
}) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { error: "Unauthorized" }

        const validated = CreateLinkSchema.safeParse({
            destinationUrl: data.destinationUrl,
            type: "qr",
            title: data.title || "Untitled QR",
            qrConfig: {
                color: data.color,
                bgColor: data.bgColor,
                frame: "square"
            }
        })

        if (!validated.success) {
            return { error: validated.error.issues[0].message }
        }

        await connectDB()

        const slug = await generateUniqueSlug()

        await Link.create({
            user: session.user.id,
            slug,
            type: "qr",
            destinationUrl: validated.data.destinationUrl,
            title: validated.data.title,
            qrConfig: validated.data.qrConfig
        })

        revalidatePath("/dashboard/qrcodes")
        return { success: true }

    } catch (error) {
        console.error("Create QR Error:", error)
        return { error: "Failed to create QR code" }
    }
}

export async function getLinks(limit = 20, offset = 0) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { error: "Unauthorized" }

        await connectDB()

        // Fetch links sorted by newest
        const links = await Link.find({ user: session.user.id, type: 'qr' }) // Filter by 'qr' for the QR page
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(offset)
            .lean() // Plain JS objects

        // Convert _id and dates to string for serialization
        const serialized = links.map((link: any) => ({
            id: link._id.toString(),
            name: link.title || link.destinationUrl,
            url: link.destinationUrl,
            scans: link.clicks || 0,
            createdAt: new Date(link.createdAt).toLocaleDateString(),
            slug: link.slug
        }))

        return { links: serialized }

    } catch (error) {
        console.error("Get Links Error:", error)
        return { error: "Failed to fetch links" }
    }
}

export async function deleteLink(id: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { error: "Unauthorized" }

        await connectDB()

        await Link.findOneAndDelete({ _id: id, user: session.user.id })

        revalidatePath("/dashboard/qrcodes")
        return { success: true }
    } catch (error) {
        return { error: "Failed to delete" }
    }
}

export async function getLinkStats(id: string) {
    // For Detail Page
    try {
        const session = await auth()
        if (!session?.user?.id) return { error: "Unauthorized" }

        await connectDB()
        const link = await Link.findOne({ _id: id, user: session.user.id }).lean()
        if (!link) return { error: "Not Found" }

        // Here we would fetch real analytics from Analytics model (future)
        // For 'Real Dev' phase - starting with just the link data
        return {
            link: {
                id: link._id.toString(),
                title: link.title,
                slug: link.slug,
                destinationUrl: link.destinationUrl,
                createdAt: link.createdAt,
                clicks: link.clicks
            }
        }

    } catch (error) {
        return { error: "Failed to fetch stats" }
    }
}
