import { Sidebar } from "@/components/dashboard/Sidebar"
import { Topbar } from "@/components/dashboard/Topbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Sidebar />
            <Topbar />
            <main className="lg:ml-64 p-6 animate-in fade-in duration-500">
                {children}
            </main>
        </div>
    )
}
