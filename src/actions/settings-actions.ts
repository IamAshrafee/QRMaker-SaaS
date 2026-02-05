"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { Settings } from "@/models/Settings";
import { User } from "@/models/User";
import { revalidatePath } from "next/cache";

/**
 * Ensures the settings document exists and returns it.
 * If not found, creates a default one.
 */
export async function getSettings() {
    await connectDB();

    // Fetch the first (and only) settings doc
    let settings = await Settings.findOne({});

    if (!settings) {
        settings = await Settings.create({});
    }

    // Convert to plain object to pass to Client Component
    return JSON.parse(JSON.stringify(settings));
}

/**
 * Updates the global settings.
 * Secure: Only Super Admin can perform this.
 */
export async function updateSettings(formData: FormData) {
    const session = await auth();

    if (!session || !session.user) {
        return { error: "Unauthorized" };
    }

    // Double check DB role for security
    await connectDB();
    const dbUser = await User.findOne({ email: session.user.email });

    if (!dbUser || dbUser.role !== 'admin') {
        return { error: "Permission Denied: Admin only" };
    }

    // Parse Data from Form
    const settingsData = {
        siteName: formData.get("siteName"),
        supportEmail: formData.get("supportEmail"),
        seo: {
            title: formData.get("seo.title"),
            description: formData.get("seo.description"),
            keywords: formData.get("seo.keywords"),
        },
        scripts: {
            googleAnalyticsId: formData.get("scripts.googleAnalyticsId"),
            customHead: formData.get("scripts.customHead"),
        },
        system: {
            maintenanceMode: formData.get("system.maintenanceMode") === "on",
            allowRegistration: formData.get("system.allowRegistration") === "on",
        }
    };

    try {
        // Update the singleton document
        // We use findOneAndUpdate with upsert just in case race condition deleted it
        await Settings.findOneAndUpdate({}, settingsData, { upsert: true, new: true });

        revalidatePath("/admin/settings");
        revalidatePath("/"); // Revalidate home in case SEO changed

        return { success: "Settings updated successfully" };
    } catch (error) {
        console.error("Update Settings Error:", error);
        return { error: "Failed to update settings" };
    }
}
