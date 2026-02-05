import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
    // General Settings
    siteName: { type: String, default: "QRMaker SaaS" },
    supportEmail: { type: String, default: "support@example.com" },

    // SEO Settings
    seo: {
        title: { type: String, default: "QRMaker - Next Gen QR Generator" },
        description: { type: String, default: "Create dynamic QR codes and Bio pages instantly." },
        keywords: { type: String, default: "qr code, bio page, generator, saas" }
    },

    // Third Party Scripts
    scripts: {
        googleAnalyticsId: { type: String, default: "" },
        customHead: { type: String, default: "" }, // Custom Scripts injected in HEAD
    },

    // System Controls
    system: {
        maintenanceMode: { type: Boolean, default: false },
        allowRegistration: { type: Boolean, default: true },
    },

    updatedAt: { type: Date, default: Date.now }
});

// Build a singleton model concept if needed,
// but for standard usage we just ensure we interact with the first document.
export const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
