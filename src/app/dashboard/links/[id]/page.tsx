import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, QrCode as QrIcon } from "lucide-react"
import Link from "next/link"
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts"
import { getLinkStats } from "@/actions/qrcodes"
import { notFound } from "next/navigation"

export default async function LinkDetailPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ range?: string }>
}) {
    const { id } = await params
    const { range } = await searchParams
    const selectedRange = range || "30d"

    const { link, stats, error } = await getLinkStats(id, selectedRange)

    if (error || !link) {
        if (error === "Not Found") return notFound()
        return <div>Error loading link details.</div>
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <Link href="/dashboard/qrcodes" className="flex items-center text-sm text-muted-foreground hover:text-indigo-400 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Links
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <QrIcon className="w-8 h-8 text-indigo-500" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">{link.title || "Untitled QR"}</h2>
                            <p className="text-muted-foreground font-mono text-sm">qrmaker.saas/{link.slug} • Created {new Date(link.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-indigo-500/20 hover:bg-indigo-500/10">
                        <Download className="w-4 h-4 mr-2" /> Download QR
                    </Button>
                    <Button className="bg-glorious-gradient hover:opacity-90">
                        Edit Design
                    </Button>
                </div>
            </div>

            {/* Client-Side Charts */}
            <AnalyticsCharts
                timeline={stats?.timeline || []}
                deviceData={stats?.deviceData || []}
                locationData={stats?.locationData || []}
            />

        </div>
    )
}
