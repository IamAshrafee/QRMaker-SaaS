"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, QrCode } from "lucide-react"
import { useState } from "react"

export function Hero() {
    const [url, setUrl] = useState("")

    return (
        <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center">
            {/* Background Mesh */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="container relative mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Text & Input */}
                    <div className="space-y-8 animate-in slide-in-from-left-10 duration-700 fade-in">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium border border-indigo-100 dark:border-indigo-800">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            v2.0 is Live
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                            One Link. <br />
                            <span className="text-gradient">Infinite Possibilities.</span>
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                            Create Dynamic QR Codes and Bio-Link Pages in seconds. Track scans, retarget users, and update content without re-printing.
                        </p>

                        {/* Guest Input */}
                        <div className="p-2 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 max-w-md">
                            <Input
                                placeholder="Enter your website URL..."
                                className="border-none shadow-none focus-visible:ring-0 bg-transparent text-lg h-12"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                            <Button size="lg" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity rounded-xl px-6">
                                <QrCode className="mr-2 h-5 w-5" />
                                Create
                            </Button>
                        </div>

                        <div className="text-sm text-muted-foreground flex items-center gap-4">
                            <span>✓ No credit card required</span>
                            <span>✓ 5 Free Dynamic Links</span>
                        </div>
                    </div>

                    {/* Right: 3D Mockup */}
                    <div className="relative h-[600px] w-full flex items-center justify-center animate-in slide-in-from-right-10 duration-1000 fade-in delay-200">
                        {/* Phone Outer Frame */}
                        <div className="relative w-[300px] h-[600px] rounded-[3rem] border-8 border-slate-900 bg-slate-900 shadow-2xl animate-[float_6s_ease-in-out_infinite]">
                            {/* Screen */}
                            <div className="absolute inset-2 bg-white dark:bg-slate-950 rounded-[2.5rem] overflow-hidden flex flex-col items-center pt-8 px-4 border border-slate-700/50">
                                {/* Dynamic Content Preview */}
                                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 mb-4 animate-pulse" />
                                <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
                                <div className="w-48 h-4 bg-slate-100 dark:bg-slate-800/50 rounded mb-8" />

                                {/* Fake Buttons */}
                                <div className="w-full space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-14 w-full rounded-xl border border-slate-200 dark:border-slate-800 flex items-center px-4 hover:scale-105 transition-transform cursor-pointer shadow-sm">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50" />
                                        </div>
                                    ))}
                                </div>

                                {/* Floating Elements on top */}
                                <div className="absolute bottom-8 left-4 right-4 h-16 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center text-xs font-mono text-muted-foreground">
                                    Scanning... [142.52.1.0]
                                </div>
                            </div>

                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-2xl" />
                        </div>

                        {/* Decorative Elements behind phone */}
                        <div className="absolute top-20 -right-10 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl rotate-12 blur-2xl opacity-40 animate-[pulse_4s_infinite]" />
                        <div className="absolute bottom-40 -left-20 w-32 h-32 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full blur-3xl opacity-30 animate-[pulse_5s_infinite]" />
                    </div>

                </div>
            </div>
        </section>
    )
}
