import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CreditCard, DollarSign, Users } from "lucide-react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AdminOverview() {
    // Server-side role check with full session access
    const session = await auth();

    // Redirect non-admin users to dashboard
    if (!session?.user || (session.user as any).role !== 'admin') {
        redirect('/dashboard');
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Admin Overview</h2>
                <p className="text-muted-foreground">The pulse of your business.</p>
            </div>

            {/* Stats Deck */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,450</div>
                        <p className="text-xs text-muted-foreground mt-1">+20% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">850</div>
                        <p className="text-xs text-muted-foreground mt-1">+12 new signups today</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Subs</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">142</div>
                        <p className="text-xs text-muted-foreground mt-1">Pro Plan Users</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Health</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">99.9%</div>
                        <p className="text-xs text-muted-foreground mt-1">Uptime</p>
                    </CardContent>
                </Card>

            </div>

            {/* Recent System Activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { text: "User JohnDoe upgraded to Pro", time: "2 mins ago" },
                                { text: "New signup: sarah@gmail.com", time: "15 mins ago" },
                                { text: "System Backup Completed", time: "1 hour ago" },
                                { text: "User Mike deleted 5 links", time: "3 hours ago" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
                                    <span className="text-sm">{item.text}</span>
                                    <span className="text-xs text-muted-foreground">{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>System Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900 rounded-md">
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">High CPU Usage</h4>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300">Server instance #4 is experiencing load spikes.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
