"use server"

import { auth } from "@/auth"
import connectDB from "@/lib/db"
import { Link } from "@/models/Link"
import { Analytics } from "@/models/Analytics"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// --- Schema Validation ---
const CreateLinkSchema = z.object({
    destinationUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
    type: z.enum(["qr", "bio"]),
    title: z.string().optional(),

    // QR Type & Config
    qrType: z.enum(["url", "wifi", "vcard", "text"]).default("url"),
    qrConfig: z.object({
        color: z.string(),
        bgColor: z.string(),
        frame: z.string(),
        logo: z.string().optional(),
    }).optional(),

    // WiFi Config
    wifiConfig: z.object({
        ssid: z.string(),
        password: z.string().optional(),
        encryption: z.enum(["WPA", "WEP", "nopass"]),
        hidden: z.boolean().default(false),
    }).optional(),

    // vCard Config
    vCardConfig: z.object({
        firstName: z.string(),
        lastName: z.string(),
        phone: z.string().optional(),
        mobile: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
        website: z.string().url().optional().or(z.literal("")),
        company: z.string().optional(),
        jobTitle: z.string().optional(),
        address: z.string().optional(),
        fax: z.string().optional(),
    }).optional(),

    // Text Config
    textContent: z.string().optional(),

    // Smart Rules
    password: z.string().optional(),
    schedule: z.object({
        activeFrom: z.date().optional(),
        expireAt: z.date().optional(),
    }).optional(),
    pixels: z.object({
        facebook: z.string().optional(),
        google: z.string().optional(),
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
    } catch (err) {
        // placeholder
    }
}

// Rewriting createQR to support all new fields
export async function createQR(data: any) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { error: "Unauthorized" }

        // Pre-processing
        const qrType = data.qrType || "url"

        // Conditional URL Validation: URL is required only if qrType is 'url'
        let destinationUrl = data.destinationUrl
        if (qrType === 'url' && !destinationUrl) {
            return { error: "Destination URL is required" }
        }

        const payload = {
            destinationUrl: destinationUrl,
            type: "qr",
            qrType,
            title: data.title || "Untitled QR",
            qrConfig: {
                color: data.color || "#000000",
                bgColor: data.bgColor || "#ffffff",
                frame: data.frame || "square",
                logo: data.logo
            },
            wifiConfig: data.wifiConfig,
            vCardConfig: data.vCardConfig,
            textContent: data.textContent,
            password: data.password,
            schedule: data.schedule,
            pixels: data.pixels
        }

        const validated = CreateLinkSchema.safeParse(payload)

        if (!validated.success) {
            console.error("Validation Error:", validated.error.flatten())
            return { error: validated.error.issues[0].message }
        }

        await connectDB()

        const slug = await generateUniqueSlug()

        await Link.create({
            user: session.user.id,
            slug,
            ...validated.data
        })

        revalidatePath("/dashboard/qrcodes")
        return { success: true }

    } catch (error) {
        console.error("Create QR Error:", error)
        return { error: "Failed to create QR code" }
    }
}

export async function updateQR(id: string, data: any) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { error: "Unauthorized" }

        // Pre-processing
        const qrType = data.qrType || "url"

        // Conditional URL Validation
        let destinationUrl = data.destinationUrl
        if (qrType === 'url' && !destinationUrl) {
            return { error: "Destination URL is required" }
        }

        const payload = {
            destinationUrl: destinationUrl,
            qrType,
            title: data.title || "Untitled QR",
            qrConfig: {
                color: data.color || "#000000",
                bgColor: data.bgColor || "#ffffff",
                frame: data.frame || "square",
                logo: data.logo
            },
            wifiConfig: data.wifiConfig,
            vCardConfig: data.vCardConfig,
            textContent: data.textContent,
            password: data.password,
            schedule: data.schedule,
            pixels: data.pixels
        }

        // Re-use CreateLinkSchema for validation (ignoring 'type' which is set to 'qr' implicitly)
        // We need to extend/pick from the schema if we want partial updates, but for full update it's fine.
        // Or manually check.
        // Let's use strict manual check or just trust payload structure after basic Zod if possible.
        // Actually, let's just use the same logic as create but update.

        await connectDB()

        // Verify ownership
        const link = await Link.findOne({ _id: id, user: session.user.id })
        if (!link) return { error: "Not Found or Unauthorized" }

        // Update fields
        link.destinationUrl = payload.destinationUrl
        link.qrType = payload.qrType
        link.title = payload.title
        link.qrConfig = payload.qrConfig
        link.wifiConfig = payload.wifiConfig
        link.vCardConfig = payload.vCardConfig
        link.textContent = payload.textContent
        link.password = payload.password
        link.schedule = payload.schedule
        link.pixels = payload.pixels

        await link.save()

        revalidatePath("/dashboard/qrcodes")
        return { success: true }

    } catch (error) {
        console.error("Update QR Error:", error)
        return { error: "Failed to update QR code" }
    }
}

export async function createBioPage(data?: { title?: string, slug?: string }) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { error: "Unauthorized" }
        await connectDB()

        const slug = data?.slug || await generateUniqueSlug()

        // Check slug uniqueness if custom slug provided (simple check)
        if (data?.slug) {
            const existing = await Link.findOne({ slug: data.slug })
            if (existing) return { error: "Link ID already exists" }
        }

        const newLink = await Link.create({
            user: session.user.id,
            slug,
            type: "bio",
            title: data?.title || "My Bio Page",
            bioConfig: {
                theme: 'default',
                links: [],
                avatar: "",
                description: "Welcome to my page"
            }
        })

        revalidatePath("/dashboard/bio")
        return { success: true, id: newLink._id.toString() }
    } catch (error) {
        console.error("Create Bio Page Error:", error)
        return { error: "Failed to create Bio Page" }
    }
}

export async function getLinks(limit = 20, offset = 0, type: 'qr' | 'bio' = 'qr') {
    try {
        const session = await auth()
        if (!session?.user?.id) return { error: "Unauthorized" }

        await connectDB()

        // Fetch links sorted by newest
        const links = await Link.find({ user: session.user.id, type })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(offset)
            .lean() // Plain JS objects

        // Convert _id and dates to string for serialization
        const serialized = links.map((link: any) => ({
            id: link._id.toString(),
            name: link.title || link.slug,
            url: link.type === 'qr' ? link.destinationUrl : `${process.env.NEXT_PUBLIC_APP_URL || ''}/${link.slug}`,
            scans: link.clicks || 0,
            createdAt: new Date(link.createdAt).toLocaleDateString(),
            slug: link.slug,
            type: link.type, // 'qr' or 'bio'
            qrType: link.qrType || 'url', // 'url', 'wifi', 'vcard', 'text'
            qrConfig: link.qrConfig,
            wifiConfig: link.wifiConfig,
            vCardConfig: link.vCardConfig,
            textContent: link.textContent
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
                type: link.type,
                destinationUrl: link.destinationUrl,
                createdAt: link.createdAt,
                clicks: link.clicks,
                qrConfig: link.qrConfig,
                qrType: link.qrType || 'url',
                wifiConfig: link.wifiConfig,
                vCardConfig: link.vCardConfig,
                textContent: link.textContent
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
