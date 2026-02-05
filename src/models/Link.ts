import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    slug: { type: String, required: true, unique: true, index: true }, // The short ID or username
    type: { type: String, enum: ["qr", "bio"], required: true },

    // Common Fields
    destinationUrl: { type: String }, // For QR redirects
    title: { type: String },
    active: { type: Boolean, default: true },

    // QR Specific Configuration
    qrConfig: {
        color: { type: String, default: "#000000" },
        bgColor: { type: String, default: "#ffffff" },
        logo: { type: String },
        frame: { type: String, default: "square" },
    },

    // Bio Page Specific Configuration
    bioConfig: {
        avatar: { type: String },
        description: { type: String },
        theme: { type: String, default: "default" },
        socials: {
            twitter: String,
            instagram: String,
            linkedin: String,
            website: String
        },
        // List of links for the bio page
        links: [{
            title: String,
            url: String,
            icon: String,
            active: { type: Boolean, default: true }
        }]
    },

    // Smart Rules (Pro Features)
    password: { type: String },
    expiresAt: { type: Date },
    scanLimit: { type: Number },
    countryRestriction: [String],

    // Simple counter (detailed analytics stored separately)
    clicks: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const Link = mongoose.models.Link || mongoose.model("Link", LinkSchema);
