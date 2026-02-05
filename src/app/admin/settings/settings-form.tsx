"use client";

import { updateSettings } from "@/actions/settings-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useActionState, useEffect, useState } from "react";

// Define strict state type
interface FormState {
    error?: string;
    success?: string;
    message?: string | null;
}

const initialState: FormState = {
    message: null,
};

function SubmitButton({ isSaved }: { isSaved: boolean }) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            className={`min-w-[140px] transition-all duration-200 ${isSaved ? "bg-emerald-600 hover:bg-emerald-600" : "bg-indigo-600 hover:bg-indigo-700"
                } text-white`}
            disabled={pending}
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                </>
            ) : isSaved ? (
                <span className="opacity-80 font-medium animate-in fade-in zoom-in-95">Saved</span>
            ) : (
                "Save Changes"
            )}
        </Button>
    );
}

// Define the shape of the initial settings props
interface SettingsProps {
    siteName: string;
    supportEmail: string;
    seo: {
        title: string;
        description: string;
        keywords: string;
    };
    scripts: {
        googleAnalyticsId: string;
        customHead: string;
    };
    system: {
        maintenanceMode: boolean;
        allowRegistration: boolean;
    };
}

export function SettingsForm({ settings }: { settings: SettingsProps }) {
    const [state, dispatch] = useActionState(async (prevState: FormState, formData: FormData) => {
        const result = await updateSettings(formData);
        return { message: null, ...result };
    }, initialState);

    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (state?.success) {
            setIsSaved(true);
            const timer = setTimeout(() => {
                setIsSaved(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [state]);

    return (
        <form action={dispatch} className="space-y-6">
            {/* General Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>General Information</CardTitle>
                    <CardDescription>Basic details about your platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="siteName">Site Name</Label>
                        <Input id="siteName" name="siteName" defaultValue={settings.siteName} placeholder="QRMaker SaaS" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="supportEmail">Support Email</Label>
                        <Input id="supportEmail" name="supportEmail" defaultValue={settings.supportEmail} placeholder="support@example.com" />
                    </div>
                </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>SEO Configuration</CardTitle>
                    <CardDescription>Default meta tags for the landing page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="seo.title">Meta Title</Label>
                        <Input id="seo.title" name="seo.title" defaultValue={settings.seo?.title} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="seo.description">Meta Description</Label>
                        <Input id="seo.description" name="seo.description" defaultValue={settings.seo?.description} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="seo.keywords">Keywords</Label>
                        <Input id="seo.keywords" name="seo.keywords" defaultValue={settings.seo?.keywords} placeholder="qr, bio link, generator" />
                    </div>
                </CardContent>
            </Card>

            {/* Third Party Scripts */}
            <Card>
                <CardHeader>
                    <CardTitle>Third-Party Scripts</CardTitle>
                    <CardDescription>Analytics and tracking codes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="scripts.googleAnalyticsId">Google Analytics ID (G-XXXXXXXX)</Label>
                        <Input id="scripts.googleAnalyticsId" name="scripts.googleAnalyticsId" defaultValue={settings.scripts?.googleAnalyticsId} placeholder="G-12345678" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="scripts.customHead">Custom Head Scripts</Label>
                        <textarea
                            id="scripts.customHead"
                            name="scripts.customHead"
                            className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                            defaultValue={settings.scripts?.customHead}
                            placeholder="<script>...</script>"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* System Settings */}
            <Card className="border-red-200 dark:border-red-900">
                <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-400">System Controls</CardTitle>
                    <CardDescription>Danger Zone: Affects global availability.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label className="text-base">Allow Registration</Label>
                            <p className="text-sm text-slate-500">
                                If disabled, new users cannot sign up.
                            </p>
                        </div>
                        <Switch name="system.allowRegistration" defaultChecked={settings.system?.allowRegistration} />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/10">
                        <div className="space-y-0.5">
                            <Label className="text-base text-red-600 dark:text-red-400">Maintenance Mode</Label>
                            <p className="text-sm text-red-600/80 dark:text-red-400/80">
                                Takes the site offline for all non-admin users.
                            </p>
                        </div>
                        <Switch name="system.maintenanceMode" defaultChecked={settings.system?.maintenanceMode} />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4 pb-10">
                <Button type="button" variant="outline">Cancel</Button>
                <SubmitButton isSaved={isSaved} />
            </div>
        </form>
    );
}
