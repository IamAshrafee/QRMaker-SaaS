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

export function QRBuilder() {
    const [url, setUrl] = useState("")
    const [color, setColor] = useState("#000000")
    const [bgColor, setBgColor] = useState("#ffffff")

    // Download logic placeholder
    const handleDownload = () => {
        // Logic to grab SVG/Canvas and download
        alert("Download started (Mock)")
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
                            <Switch id="dynamic" defaultChecked />
                            <Label htmlFor="dynamic">Dynamic Link (Trackable)</Label>
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

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Smart Rules (Pro)</h3>
                    <Card className="bg-slate-50 dark:bg-slate-900 border-dashed">
                        <CardContent className="pt-6 text-center space-y-2">
                            <Label className="text-muted-foreground">Password Protection & Expiry</Label>
                            <Button variant="outline" size="sm" className="w-full">Upgrade to Unlock</Button>
                        </CardContent>
                    </Card>
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
                            value={url || "https://qrmaker.saas"}
                            size={200}
                            fgColor={color}
                            bgColor={bgColor}
                            level="H"
                        />
                    </div>
                </Card>

                <div className="mt-8 flex gap-4">
                    <Button onClick={handleDownload} className="w-40 bg-glorious-gradient text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Download PNG
                    </Button>
                    <Button variant="outline" className="w-40">
                        Download SVG
                    </Button>
                </div>

            </div>
        </div>
    )
}
