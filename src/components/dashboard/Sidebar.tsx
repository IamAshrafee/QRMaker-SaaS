"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    BarChart3,
    CreditCard,
    LayoutDashboard,
    Link as LinkIcon,
    QrCode,
    Settings,
    Smartphone,
    LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "QR Codes", href: "/dashboard/qrcodes", icon: QrCode },
    { name: "Bio Pages", href: "/dashboard/bio", icon: Smartphone },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 z-40">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                        Q
                    </div>
                    <span className="dark:text-white text-slate-900">QRMaker</span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
                <Link href="/dashboard/create">
                    <Button className="w-full justify-start gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition-opacity mb-6">
                        + Create New
                    </Button>
                </Link>

                {navItems.map((item) => {
                    const isActive = pathname === item.href

                    return (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={`w-full justify-start gap-2 ${isActive ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400" : ""}`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.name}
                            </Button>
                        </Link>
                    )
                })}
            </div>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">Ashrafee</p>
                        <p className="text-xs text-muted-foreground truncate">Free Plan</p>
                    </div>
                    <LogOut className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-red-500" />
                </div>
            </div>
        </aside>
    )
}
