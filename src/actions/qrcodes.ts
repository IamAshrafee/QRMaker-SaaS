"use server"

import { auth } from "@/auth"
import connectDB from "@/lib/db"
import { Link } from "@/models/Link"
import { Analytics } from "@/models/Analytics"
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

export async function getLinkStats(id: string, range: string = "30d") {
    try {
        const session = await auth()
        if (!session?.user?.id) return { error: "Unauthorized" }

        await connectDB()
        const link = await Link.findOne({ _id: id, user: session.user.id }).lean()
        if (!link) return { error: "Not Found" }

        // --- Date Range Logic ---
        let startDate = new Date()
        let daysToFill = 30 // default

        if (range === "all") {
            startDate = new Date(0) // beginning of time
            // For 'all', we might not want to fill empty days if the range is huge,
            // or we calculate days between created and now.
            // Let's approximate for chart filling:
            const created = new Date(link.createdAt)
            const now = new Date()
            const diffTime = Math.abs(now.getTime() - created.getTime());
            daysToFill = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        } else {
            const daysMap: Record<string, number> = {
                "7d": 7,
                "30d": 30,
                "60d": 60,
                "90d": 90,
                "1y": 365
            }
            daysToFill = daysMap[range] || 30
            startDate.setDate(startDate.getDate() - daysToFill)
        }

        // --- Aggregation: Timeline ---
        const timelineRaw = await Analytics.aggregate([
            { $match: { link: link._id, timestamp: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ])

        // Fill in missing dates
        const timeline = []
        // Limit filling to max 365 days to prevent loop explosion on 'all'
        const safeFillLimit = Math.min(daysToFill, 365)

        for (let d = safeFillLimit; d >= 0; d--) {
            const date = new Date()
            date.setDate(date.getDate() - d)
            const dateStr = date.toISOString().split('T')[0]
            const found = timelineRaw.find((t: any) => t._id === dateStr)

            const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

            timeline.push({
                date: displayDate,
                scans: found ? found.count : 0
            })
        }

        // --- Aggregation: Devices ---
        // Also Filter by Date Range? Usually yes.
        const matchStage = { link: link._id, timestamp: { $gte: startDate } }

        const deviceRaw = await Analytics.aggregate([
            { $match: matchStage },
            { $group: { _id: "$device", count: { $sum: 1 } } }
        ])

        const deviceColors: Record<string, string> = {
            "Mobile": "#6366f1",
            "Desktop": "#a855f7",
            "Tablet": "#ec4899",
            "Other": "#94a3b8"
        }

        const deviceData = deviceRaw.map((d: any) => ({
            name: d._id || "Other",
            value: d.count,
            color: deviceColors[d._id] || deviceColors["Other"]
        }))

        // --- Aggregation: Locations (All) ---
        // Removed $limit: 5
        const locationRaw = await Analytics.aggregate([
            { $match: matchStage },
            { $group: { _id: "$country", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])

        const locationData = locationRaw.map((l: any) => ({
            name: l._id || "Unknown",
            code: "UN",
            scans: l.count
        }))

        return {
            link: {
                id: link._id.toString(),
                title: link.title,
                slug: link.slug,
                destinationUrl: link.destinationUrl,
                createdAt: link.createdAt,
                clicks: link.clicks
            },
            stats: {
                timeline,
                deviceData,
                locationData,
                totalScans: link.clicks || 0
            }
        }

    } catch (error) {
        console.error("Stats Error:", error)
        return { error: "Failed to fetch stats" }
    }
}

export async function getUserStats(range: string = "30d") {
    try {
        const session = await auth()
        if (!session?.user?.id) return { error: "Unauthorized" }

        await connectDB()

        // 1. Get all user links
        const userLinks = await Link.find({ user: session.user.id }).select('_id').lean()
        const linkIds = userLinks.map((l: any) => l._id)

        if (linkIds.length === 0) {
            return {
                stats: {
                    timeline: [],
                    deviceData: [],
                    locationData: [],
                    totalScans: 0
                }
            }
        }

        // --- Date Range Logic (reused) ---
        let startDate = new Date()
        let daysToFill = 30

        if (range === "all") {
            startDate = new Date(0)
            daysToFill = 30 // Fallback for filling logic if needed, or just dont fill
        } else {
            const daysMap: Record<string, number> = {
                "7d": 7,
                "30d": 30,
                "60d": 60,
                "90d": 90,
                "1y": 365
            }
            daysToFill = daysMap[range] || 30
            startDate.setDate(startDate.getDate() - daysToFill)
        }

        const matchStage = { link: { $in: linkIds }, timestamp: { $gte: startDate } }

        // --- Aggregation: Timeline ---
        const timelineRaw = await Analytics.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ])

        // Fill in missing dates
        const timeline = []
        const safeFillLimit = Math.min(daysToFill, 365)

        for (let d = safeFillLimit; d >= 0; d--) {
            const date = new Date()
            date.setDate(date.getDate() - d)
            const dateStr = date.toISOString().split('T')[0]
            const found = timelineRaw.find((t: any) => t._id === dateStr)
            const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

            timeline.push({
                date: displayDate,
                scans: found ? found.count : 0
            })
        }

        // --- Aggregation: Devices ---
        const deviceRaw = await Analytics.aggregate([
            { $match: matchStage },
            { $group: { _id: "$device", count: { $sum: 1 } } }
        ])

        const deviceColors: Record<string, string> = {
            "Mobile": "#6366f1",
            "Desktop": "#a855f7",
            "Tablet": "#ec4899",
            "Other": "#94a3b8"
        }

        const deviceData = deviceRaw.map((d: any) => ({
            name: d._id || "Other",
            value: d.count,
            color: deviceColors[d._id] || deviceColors["Other"]
        }))

        // --- Aggregation: Locations ---
        const locationRaw = await Analytics.aggregate([
            { $match: matchStage },
            { $group: { _id: "$country", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])

        const locationData = locationRaw.map((l: any) => ({
            name: l._id || "Unknown",
            code: "UN",
            scans: l.count
        }))

        // Total Scans in this range
        const totalScans = timelineRaw.reduce((acc, curr) => acc + curr.count, 0)

        return {
            stats: {
                timeline,
                deviceData,
                locationData,
                totalScans
            }
        }

    } catch (error) {
        console.error("User Stats Error:", error)
        return { error: "Failed to fetch stats" }
    }
}
