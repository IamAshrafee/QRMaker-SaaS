"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, BarChart3, Target, Palette } from "lucide-react"

export function Features() {
    return (
        <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold">
                        Everything you need to <span className="text-gradient">Grow</span>
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Powerful features packed into a beautiful interface.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[800px] md:h-[600px]">

                    {/* Card A: Bio Link Builder (Large, 2x2) */}
                    <Card className="md:col-span-2 md:row-span-2 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 overflow-hidden relative group hover:shadow-2xl transition-all">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-2xl">Bio Link Builder</CardTitle>
                            <p className="text-muted-foreground">Create beautiful, mobile-first pages in drag-and-drop style.</p>
                        </CardHeader>
                        <CardContent className="absolute bottom-0 left-0 right-0 h-[300px] bg-slate-100 dark:bg-slate-900/50 translate-y-4 group-hover:translate-y-0 transition-transform p-4">
                            {/* Mockup of builder interface */}
                            <div className="w-full h-full rounded-t-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-2">
                                <div className="h-2 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                                <div className="h-10 w-full bg-slate-50 dark:bg-slate-900 rounded border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs text-muted-foreground">
                                    + Add Component
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card B: Analytics (Tall, 1x2) */}
                    <Card className="md:col-span-1 md:row-span-2 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 relative group hover:shadow-2xl transition-all">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-4 text-pink-600 dark:text-pink-400">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <CardTitle>Analytics</CardTitle>
                            <p className="text-muted-foreground text-sm">Real-time data.</p>
                        </CardHeader>
                        <CardContent className="flex items-end h-[200px] gap-2 px-4 pb-8">
                            {/* Fake Chart */}
                            <div className="w-1/4 h-[40%] bg-pink-200 dark:bg-pink-900/30 rounded-t-md group-hover:h-[60%] transition-all duration-500" />
                            <div className="w-1/4 h-[60%] bg-pink-300 dark:bg-pink-900/50 rounded-t-md group-hover:h-[80%] transition-all duration-700" />
                            <div className="w-1/4 h-[30%] bg-pink-400 dark:bg-pink-800 rounded-t-md group-hover:h-[50%] transition-all duration-300" />
                            <div className="w-1/4 h-[80%] bg-purple-500 rounded-t-md group-hover:h-[90%] transition-all duration-1000" />
                        </CardContent>
                    </Card>

                    {/* Card C: Retargeting (Small, 1x1) */}
                    <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-emerald-500" />
                                Pixel
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">Add FB & Google Pixels.</p>
                        </CardHeader>
                    </Card>

                    {/* Card D: Customization (Small, 1x1) */}
                    <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none hover:shadow-xl transition-all">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="w-5 h-5" />
                                Themes
                            </CardTitle>
                            <p className="text-xs text-indigo-100">Full control over colors.</p>
                        </CardHeader>
                    </Card>

                </div>
            </div>
        </section>
    )
}
