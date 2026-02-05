"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts"
import React from "react"
import { Globe, Smartphone, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

interface AnalyticsChartsProps {
    timeline: { date: string, scans: number }[]
    deviceData: { name: string, value: number, color: string }[]
    locationData: { name: string, code: string, scans: number }[]
}

export function AnalyticsCharts({ timeline, deviceData, locationData }: AnalyticsChartsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentRange = searchParams.get("range") || "30d"

    const handleRangeChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("range", value)
        router.push(`?${params.toString()}`)
    }

    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="space-y-8 animate-pulse text-transparent select-none">Loading...</div>
    }

    return (
        <div className="space-y-8">
            {/* Controls */}
            <div className="flex justify-end">
                <Select value={currentRange} onValueChange={handleRangeChange}>
                    <SelectTrigger className="w-[180px] bg-white dark:bg-slate-950">
                        <Calendar className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Select Range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                        <SelectItem value="60d">Last 60 Days</SelectItem>
                        <SelectItem value="90d">Last 3 Months</SelectItem>
                        <SelectItem value="1y">Last Year</SelectItem>
                        <SelectItem value="all">Lifetime</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Main Stats Chart */}
            <Card className="border-indigo-500/10 shadow-lg">
                <CardHeader>
                    <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full min-h-[350px]">
                        <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={0} debounce={1}>
                            <AreaChart data={timeline}>
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

                {/* Geography - Scrollable */}
                <Card className="flex flex-col max-h-[400px]">
                    <CardHeader className="flex flex-row items-center justify-between shrink-0">
                        <CardTitle className="text-lg">Visitor Locations</CardTitle>
                        <Globe className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="overflow-y-auto pr-2 custom-scrollbar">
                        <div className="space-y-4">
                            {/* Check if locationData is valid array before mapping */}
                            {(!locationData || locationData.length === 0) && <p className="text-center text-muted-foreground py-10">No location data yet.</p>}
                            {locationData && locationData.map((country, i) => (
                                <div key={country.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-sm font-bold text-muted-foreground w-6">{i + 1}.</div>
                                        <div className="font-medium">{country.name}</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 md:w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            {/* Safe math for width calculation */}
                                            <div className="h-full bg-indigo-500" style={{ width: `${(country.scans / Math.max(...locationData.map(l => l.scans), 1)) * 100}%` }} />
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
                        <div className="h-[250px] w-full min-h-[250px]">
                            {/* Check if deviceData is valid and has data */}
                            {(!deviceData || deviceData.every(d => d.value === 0)) ? (
                                <div className="flex items-center justify-center h-full text-muted-foreground">No device data yet.</div>
                            ) : (
                                <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={0} debounce={1}>
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
                            )}
                        </div>
                        <div className="space-y-2">
                            {/* Only show legend if there is data */}
                            {deviceData && !deviceData.every(d => d.value === 0) && deviceData.map((item) => (
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
