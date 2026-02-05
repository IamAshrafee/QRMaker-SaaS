"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts"
import { Globe, Smartphone } from "lucide-react"

// Mock data (could be passed as props later)
const timelineData = [
    { date: "Jan 1", scans: 10 },
    { date: "Jan 5", scans: 45 },
    { date: "Jan 10", scans: 30 },
    { date: "Jan 15", scans: 85 },
    { date: "Jan 20", scans: 120 },
    { date: "Jan 25", scans: 90 },
    { date: "Jan 30", scans: 150 },
]

const deviceData = [
    { name: "Mobile", value: 400, color: "#6366f1" },
    { name: "Desktop", value: 300, color: "#a855f7" },
    { name: "Tablet", value: 100, color: "#ec4899" },
]

const countryData = [
    { name: "United States", code: "US", scans: 350 },
    { name: "Bangladesh", code: "BD", scans: 200 },
    { name: "United Kingdom", code: "GB", scans: 150 },
    { name: "Canada", code: "CA", scans: 80 },
    { name: "Germany", code: "DE", scans: 50 },
]

export function AnalyticsCharts() {
    return (
        <div className="space-y-8">
            {/* Main Stats Chart */}
            <Card className="border-indigo-500/10 shadow-lg">
                <CardHeader>
                    <CardTitle>Performance (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timelineData}>
                                <defs>
                                    <linearGradient id="colorScansDetailed" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="scans" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorScansDetailed)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Secondary Stats */}
            <div className="grid gap-6 md:grid-cols-2">

                {/* Geography */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Top Locations</CardTitle>
                        <Globe className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {countryData.map((country, i) => (
                                <div key={country.code} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-sm font-bold text-muted-foreground w-4">{i + 1}</div>
                                        <div className="font-medium">{country.name}</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500" style={{ width: `${(country.scans / 350) * 100}%` }} />
                                        </div>
                                        <span className="text-sm font-bold w-8 text-right">{country.scans}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Devices */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Device Type</CardTitle>
                        <Smartphone className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deviceData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {deviceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-2">
                            {deviceData.map((item) => (
                                <div key={item.name} className="flex items-center gap-2 text-sm">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-muted-foreground">{item.name}</span>
                                    <span className="font-bold">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
