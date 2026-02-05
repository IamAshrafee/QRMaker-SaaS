"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Download, Wifi, Globe, Contact } from "lucide-react"

import { createQR } from "@/actions/qrcodes"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export function QRBuilder() {
    const [url, setUrl] = useState("")
    const [color, setColor] = useState("#000000")
    const [bgColor, setBgColor] = useState("#ffffff")
    const [isSaving, setIsSaving] = useState(false)
    const router = useRouter()

    const handleSave = async () => {
        if (!url) {
            toast.error("Please enter a URL")
            return
        }

        setIsSaving(true)
        const result = await createQR({
            destinationUrl: url,
            color,
            bgColor,
            title: "New QR Code" // Could add a title input later
        })

        setIsSaving(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("QR Code Saved!")
            router.push("/dashboard/qrcodes")
        }
    }

    // Download logic (frontend only for now)
    const handleDownload = () => {
        const svg = document.getElementById("qr-code-svg")
        if (svg) {
            const xml = new XMLSerializer().serializeToString(svg)
            const dataUrl = "data:image/svg+xml;base64," + btoa(xml)
            const link = document.createElement("a")
            link.href = dataUrl
            link.download = "qrcode.svg"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">

            {/* LEFT PANEL: Controls */}
            <div className="flex-1 overflow-y-auto p-6 border-r border-slate-200 dark:border-slate-800 space-y-8">

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Create QR Code</h2>
                    <p className="text-muted-foreground">Customize your destination and design.</p>
                </div>

                <Tabs defaultValue="url" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="url"><Globe className="w-4 h-4 mr-2" /> URL</TabsTrigger>
                        <TabsTrigger value="wifi"><Wifi className="w-4 h-4 mr-2" /> WiFi</TabsTrigger>
                        <TabsTrigger value="vcard"><Contact className="w-4 h-4 mr-2" /> vCard</TabsTrigger>
                    </TabsList>

                    <TabsContent value="url" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Website URL</Label>
                            <Input
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="dynamic" defaultChecked disabled />
                            <Label htmlFor="dynamic">Dynamic Link (Always On)</Label>
                        </div>
                    </TabsContent>

                    <TabsContent value="wifi">
                        <div className="p-4 bg-muted rounded-md text-sm text-center">
                            WiFi Config Coming Soon...
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Design</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Foreground Color</Label>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded border" style={{ backgroundColor: color }} />
                                <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Background Color</Label>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded border" style={{ backgroundColor: bgColor }} />
                                <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <Button onClick={handleSave} disabled={isSaving} className="w-full bg-glorious-gradient text-white h-12 text-lg">
                        {isSaving ? "Saving..." : "Save QR Code"}
                    </Button>
                </div>

            </div>

            {/* RIGHT PANEL: Preview */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-8 sticky top-0">

                <div className="text-center mb-8">
                    <h3 className="font-semibold text-xl mb-2">Live Preview</h3>
                    <p className="text-sm text-muted-foreground">Scan with your phone to test.</p>
                </div>

                <Card className="w-[300px] h-[300px] flex items-center justify-center shadow-2xl bg-white border-0 ring-1 ring-slate-200">
                    <div className="bg-white p-4 rounded-lg">
                        <QRCodeSVG
                            id="qr-code-svg"
                            value={url || "https://qrmaker.saas"}
                            size={200}
                            fgColor={color}
                            bgColor={bgColor}
                            level="H"
                        />
                    </div>
                </Card>

                <div className="mt-8 flex gap-4">
                    <Button onClick={handleDownload} variant="outline" className="w-40">
                        <Download className="w-4 h-4 mr-2" />
                        Download SVG
                    </Button>
                </div>

            </div>
        </div>
    )
}
