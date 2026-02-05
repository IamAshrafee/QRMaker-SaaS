import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema({
    link: { type: mongoose.Schema.Types.ObjectId, ref: "Link", required: true },
    timestamp: { type: Date, default: Date.now, index: true },

    // Visitor Data
    ip: String, // Hashed ideally
    userAgent: String,
    country: String,
    city: String,
    device: String, // Mobile, Desktop, Tablet
    browser: String,
    os: String,
    referrer: String,
});

export const Analytics = mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema);
