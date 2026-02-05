import { getSettings } from "@/actions/settings-actions";
import { auth } from "@/auth";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
    const session = await auth();
    // Basic Client-side role check happens in Layout usually, but good to be safe
    if (session?.user?.role !== "admin") {
        return <div className="p-8 text-red-500">Unauthorized: Admin Access Required</div>;
    }

    const settings = await getSettings();

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Global Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Manage core configurations for your SaaS platform.
                </p>
            </div>

            <SettingsForm settings={settings} />
        </div>
    );
}
