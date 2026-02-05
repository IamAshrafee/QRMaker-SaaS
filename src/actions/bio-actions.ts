"use server";

import connectDB from "@/lib/db";
import { Link } from "@/models/Link";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Update Bio Page Theme
export async function updateBioTheme(linkId: string, themeId: string) {
    const session = await auth();
    if (!session?.user?.email) return { error: "Unauthorized" };

    try {
        await connectDB();

        // Ensure user owns the link
        const link = await Link.findOne({ _id: linkId });
        if (!link) return { error: "Link not found" };

        // We verify ownership by checking if the user ID matches, but 'auth' session might be User ID or Email.
        // Assuming session.user.id is populated or we look up user first.
        // Let's look up user first to be safe if ID isn't in session token directly (depends on auth config).
        // Since we have email, let's trust we can query, but better:
        // Use the user ID from session if available. The Link model has `user: ObjectId`.
        // If session.user.id is string, we should use it.

        if (session.user.id !== link.user.toString()) {
            // In case session.user.id is missing or user is admin?
            // If user is admin, maybe they can edit? For now, restrict to owner.
            return { error: "Unauthorized: You do not own this link" };
        }

        link.bioConfig.theme = themeId;
        await link.save();

        revalidatePath(`/dashboard/links/${linkId}`);
        revalidatePath(`/${link.slug}`); // Revalidate public page

        return { success: "Theme updated successfully" };
    } catch (error) {
        console.error("Update Theme Error:", error);
        return { error: "Failed to update theme" };
    }
}

// Update Bio Page Links/Content
export async function updateBioContent(linkId: string, bioData: any) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await connectDB();
        const link = await Link.findOne({ _id: linkId, user: session.user.id });
        if (!link) return { error: "Link not found or unauthorized" };

        if (!link.bioConfig) link.bioConfig = {};

        // Patch update fields
        if (bioData.title !== undefined) link.title = bioData.title; // Page Title
        if (bioData.avatar !== undefined) link.bioConfig.avatar = bioData.avatar;
        if (bioData.description !== undefined) link.bioConfig.description = bioData.description;
        if (bioData.links !== undefined) link.bioConfig.links = bioData.links;
        if (bioData.socials !== undefined) link.bioConfig.socials = bioData.socials;

        await link.save();

        revalidatePath(`/dashboard/links/${linkId}`);
        revalidatePath(`/${link.slug}`);

        return { success: "Content saved" };
    } catch (error) {
        console.error("Update Content Error:", error);
        return { error: "Failed to save content" };
    }
}
