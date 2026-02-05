import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

// Mock Role Guard Component (Replace with real Auth later)
async function RoleGuard({ children }: { children: React.ReactNode }) {
    const session = await auth()
    if (session?.user?.role !== "admin") redirect("/dashboard")

    return <>{children}</>
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                <AdminSidebar />
                <main className="lg:ml-64 p-8 animate-in fade-in duration-500">
                    {children}
                </main>
            </div>
        </RoleGuard>
    )
}
