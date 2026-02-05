"use client";

import { useState, useTransition } from "react";
import { BIO_THEMES, BioTheme } from "@/lib/themes";
import { updateBioTheme } from "@/actions/bio-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, Paintbrush, Smartphone } from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface ThemeEditorProps {
    linkId: string;
    currentThemeId: string;
}

export function ThemeEditor({ linkId, currentThemeId }: ThemeEditorProps) {
    const [selectedThemeId, setSelectedThemeId] = useState(currentThemeId);
    const [isPending, startTransition] = useTransition();

    const handleSave = () => {
        startTransition(async () => {
            const result = await updateBioTheme(linkId, selectedThemeId);
            if (result.success) {
                toast.success(result.success);
            } else {
                toast.error(result.error || "Failed to update theme");
            }
        });
    };

    const currentTheme = BIO_THEMES.find(t => t.id === selectedThemeId) || BIO_THEMES[0];

    return (
        <div className="grid lg:grid-cols-3 gap-8 h-[calc(100vh-100px)]">

            {/* Left Panel: Theme Selection */}
            <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Pick a Theme</h2>
                        <p className="text-muted-foreground">Select a visual style for your Bio Page.</p>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isPending || selectedThemeId === currentThemeId}
                        className="min-w-[120px]"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Paintbrush className="w-4 h-4 mr-2" />}
                        {isPending ? "Saving..." : "Apply Theme"}
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {BIO_THEMES.map((theme) => (
                        <div
                            key={theme.id}
                            className={cn(
                                "group relative cursor-pointer rounded-xl border-2 transition-all overflow-hidden aspect-[3/4]",
                                selectedThemeId === theme.id ? "border-indigo-600 ring-4 ring-indigo-600/10 scale-[1.02]" : "border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                            )}
                            onClick={() => setSelectedThemeId(theme.id)}
                        >
                            {/* Theme Preview Background */}
                            <div
                                className="absolute inset-0 w-full h-full p-4 flex flex-col items-center justify-center gap-2"
                                style={{ background: theme.background }}
                            >
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-2" />
                                <div className={`h-3 w-2/3 rounded-full opacity-50 bg-current`} style={{ color: theme.textColor }} />
                                <div className={`h-3 w-1/2 rounded-full opacity-30 bg-current`} style={{ color: theme.textColor }} />

                                <div className="mt-4 w-full space-y-2">
                                    <div
                                        className="h-8 w-full flex items-center justify-center text-[10px] font-bold opacity-90"
                                        style={{
                                            background: theme.buttonBg,
                                            color: theme.buttonText,
                                            borderRadius: theme.buttonStyle === 'pill' ? '999px' : theme.buttonStyle === 'rounded' ? '0.5rem' : '0'
                                        }}
                                    >
                                        Button
                                    </div>
                                </div>
                            </div>

                            {/* Selection Checkmark */}
                            {selectedThemeId === theme.id && (
                                <div className="absolute top-3 right-3 bg-indigo-600 text-white rounded-full p-1 shadow-md">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                            )}

                            {/* Label on Hover */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur top-auto translate-y-full group-hover:translate-y-0 transition-transform">
                                <p className="font-semibold text-center text-sm">{theme.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel: Live Mobile Preview */}
            <div className="lg:col-span-1 hidden lg:flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sticky top-4">
                <div className="relative w-[300px] h-[600px] border-8 border-slate-900 rounded-[3rem] shadow-2xl bg-white overflow-hidden ring-1 ring-slate-900/5">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-xl z-20"></div>

                    {/* Iframe or Mock Render */}
                    <div className="w-full h-full overflow-y-auto scrollbar-hide" style={{ background: currentTheme.background }}>
                        <div className="p-6 pt-12 flex flex-col items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-slate-200 border-2 border-white/50 shadow-sm shrink-0" />
                            <div className="text-center space-y-1 w-full">
                                <div className="h-4 w-32 bg-current opacity-70 rounded mx-auto" style={{ color: currentTheme.textColor }} />
                                <div className="h-3 w-24 bg-current opacity-50 rounded mx-auto" style={{ color: currentTheme.textColor }} />
                            </div>

                            <div className="w-full space-y-3 mt-4">
                                {[1, 2, 3].map(i => (
                                    <div
                                        key={i}
                                        className="w-full h-12 flex items-center justify-center text-sm font-semibold shadow-sm"
                                        style={{
                                            background: currentTheme.buttonBg,
                                            color: currentTheme.buttonText,
                                            borderRadius: currentTheme.buttonStyle === 'pill' ? '999px' : currentTheme.buttonStyle === 'rounded' ? '0.75rem' : '0'
                                        }}
                                    >
                                        Link {i}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
