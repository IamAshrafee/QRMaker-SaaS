"use server"

import connectDB from "@/lib/db"
import { Link } from "@/models/Link" // We will store the bio configuration in a 'Link' collection or a dedicated one?
// Actually, based on previous analysis, Link model has 'bioConfig'. 
// We should probably have ONE 'bio' type Link per user, or store it on the User model?
// The Link model has 'slug'. If the bio page is accessed via '/username', the User model is queried.
// But the LINKS content is in `Link` model? 
// Strategy: Create/Update a Link document where type='bio' and user=userId.
// The slug for this link could be the username, or we just look it up by user ID.

import { User } from "@/models/User"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getBioData() {
    const session = await auth()
    if (!session?.user) return null

    await connectDB()

    // Find the user's bio configuration
    // We assume 1 bio page per user for now
    const bioLink = await Link.findOne({ user: session.user.id, type: 'bio' })

    if (bioLink) {
        // Return serializable data
        return JSON.parse(JSON.stringify(bioLink))
    }

    return null
}

export async function updateBioData(data: any) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    await connectDB()

    try {
        // Upsert the bio link document
        const bioLink = await Link.findOneAndUpdate(
            { user: session.user.id, type: 'bio' },
            {
                user: session.user.id,
                type: 'bio',
                slug: session.user.username || session.user.email?.split('@')[0], // Fallback slug
                title: data.title || "My Bio",
                bioConfig: {
                    avatar: session.user.image, // Default to user image
                    description: data.description || "Welcome to my page",
                    links: data.links // The array of links
                },
                active: true
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )

        revalidatePath('/dashboard/bio')
        revalidatePath(`/${bioLink.slug}`) // Revalidate public page

        return { success: true, data: JSON.parse(JSON.stringify(bioLink)) }

    } catch (error) {
        console.error("Update Bio Error:", error)
        return { error: "Failed to update bio page" }
    }
}
