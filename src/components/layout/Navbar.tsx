"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-glorious-gradient flex items-center justify-center text-white font-bold">
                        Q
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-500">
                        QRMaker
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
                    <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
                    <Link href="#use-cases" className="hover:text-primary transition-colors">Use Cases</Link>
                    <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
                </div>

                {/* CTA Buttons */}
                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="hover:bg-indigo-50 dark:hover:bg-indigo-950/30">
                            Login
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="bg-glorious-gradient text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:scale-105">
                            Sign Up Free
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
