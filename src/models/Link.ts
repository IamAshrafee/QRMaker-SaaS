import mongoose, { Schema, Document, Model } from "mongoose"

// --- Interfaces ---
export interface ILink extends Document {
    user: mongoose.Types.ObjectId
    slug: string
    title?: string
    destinationUrl?: string // Optional now, as wifi/vcard might not have it
    type: "qr" | "bio"
    active: boolean

    // QR Specifics
    qrType: "url" | "wifi" | "vcard" | "text"
    qrConfig: {
        color: string
        bgColor: string
        frame: string // 'square', 'dots', 'rounded'
        logo?: string // URL or Base64
    }

    // WiFi Specifics
    wifiConfig?: {
        ssid: string
        password?: string
        encryption: "WPA" | "WEP" | "nopass"
        hidden: boolean
    }

    // vCard Specifics
    vCardConfig?: {
        firstName: string
        lastName: string
        phone?: string
        mobile?: string
        email?: string
        website?: string
        company?: string
        jobTitle?: string
        address?: string
        fax?: string
    }

    // Text Specifics
    textContent?: string

    // Bio Page Specifics
    bioConfig?: {
        theme: string
        avatar?: string
        description?: string
        socials?: {
            twitter?: string
            instagram?: string
            linkedin?: string
            website?: string
        }
        links: {
            title: string
            url: string
            icon: string
            active: boolean
        }[]
    }

    // Smart Rules (Pro Features)
    password?: string // Hashed password for protected links
    schedule?: {
        activeFrom?: Date
        expireAt?: Date
    }
    pixels?: {
        facebook?: string
        google?: string
    }
    countryRestriction?: string[]
    scanLimit?: number

    clicks: number
    createdAt: Date
    updatedAt: Date
}

// --- Schema Definition ---
const LinkSchema = new Schema<ILink>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String },
    destinationUrl: { type: String },
    type: { type: String, enum: ["qr", "bio"], default: "qr" },
    active: { type: Boolean, default: true },

    // QR Config
    qrType: { type: String, enum: ["url", "wifi", "vcard", "text"], default: "url" },
    qrConfig: {
        color: { type: String, default: "#000000" },
        bgColor: { type: String, default: "#ffffff" },
        frame: { type: String, default: "square" },
        logo: { type: String }
    },

    // WiFi Config
    wifiConfig: {
        ssid: String,
        password: String,
        encryption: { type: String, enum: ["WPA", "WEP", "nopass"], default: "WPA" },
        hidden: { type: Boolean, default: false }
    },

    // vCard Config
    vCardConfig: {
        firstName: String,
        lastName: String,
        phone: String,
        mobile: String,
        email: String,
        website: String,
        company: String,
        jobTitle: String,
        address: String,
        fax: String
    },

    // Text Config
    textContent: { type: String },

    // Bio Config
    bioConfig: {
        theme: { type: String, default: "default" },
        avatar: String,
        description: String,
        socials: {
            twitter: String,
            instagram: String,
            linkedin: String,
            website: String
        },
        links: [{
            title: String,
            url: String,
            icon: String,
            active: { type: Boolean, default: true }
        }]
    },

    // Smart Rules
    password: { type: String },
    schedule: {
        activeFrom: Date,
        expireAt: Date
    },
    pixels: {
        facebook: String,
        google: String
    },
    countryRestriction: [String],
    scanLimit: Number,

    clicks: { type: Number, default: 0 }
}, { timestamps: true })

export const Link: Model<ILink> = mongoose.models.Link || mongoose.model<ILink>("Link", LinkSchema)
