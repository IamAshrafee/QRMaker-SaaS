import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserStats } from "@/actions/qrcodes"
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts"
import { BarChart3, TrendingUp, Users } from "lucide-react"

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
    const { range } = await searchParams
    const { stats, error } = await getUserStats(range || "30d")

    if (error) {
        return <div className="p-8 text-red-500">Failed to load analytics.</div>
    }

    const totalScans = stats?.totalScans || 0
    // Rough estimation for active links if we wanted (not returned by action yet, but totalScans suggests activity)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Analytics Overview</h2>
                <p className="text-muted-foreground">Aggregated performance across all your QR codes and Bio pages.</p>
            </div>

            {/* Top Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Scans (Period)</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalScans}</div>
                        <p className="text-xs text-muted-foreground">
                            For the selected date range
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Device</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.deviceData?.[0]?.name || "N/A"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Most popular device type
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Location</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.locationData?.[0]?.name || "N/A"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Most active country
                        </p>
                    </CardContent>
                </Card>
            </div>

            <AnalyticsCharts
                timeline={stats?.timeline || []}
                deviceData={stats?.deviceData || []}
                locationData={stats?.locationData || []}
            />
        </div>
    )
}
