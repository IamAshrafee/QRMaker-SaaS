"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Activity,
    Crown,
    LayoutDashboard,
    Link as LinkIcon,
    Settings,
    Users,
    LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
    { name: "Overview", href: "/admin", icon: Activity },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Plans", href: "/admin/plans", icon: Crown },
    { name: "All Links", href: "/admin/links", icon: LinkIcon },
    { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 border-r border-slate-200 dark:border-slate-800 bg-slate-900 text-white z-40">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
                    <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                        A
                    </div>
                    <span className="text-white">Admin Panel</span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href

                    return (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={`w-full justify-start gap-2 ${isActive
                                        ? "bg-red-600 text-white hover:bg-red-700"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.name}
                            </Button>
                        </Link>
                    )
                })}
            </div>

            {/* Footer / Back to App */}
            <div className="p-4 border-t border-slate-800">
                <Link href="/dashboard">
                    <Button variant="outline" className="w-full gap-2 border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white">
                        <LayoutDashboard className="w-4 h-4" />
                        Back to App
                    </Button>
                </Link>
            </div>
        </aside>
    )
}
