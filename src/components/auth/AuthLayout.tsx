"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-950">

            {/* Background Mesh Gradients */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-pink-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            {/* Back Button */}
            <div className="absolute top-8 left-8 z-10">
                <Link href="/">
                    <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Button>
                </Link>
            </div>

            {/* Auth Card */}
            <div className="relative z-10 w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="glass rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-white/10 dark:shadow-indigo-500/10 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-glorious-gradient mx-auto flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-indigo-500/30">
                            Q
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                        <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
                    </div>

                    {children}
                </div>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>Protected by QRMaker Security.</p>
                </div>
            </div>

        </div>
    )
}
