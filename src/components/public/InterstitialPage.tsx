"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Wifi, Contact, Type, Copy, Check, Download } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { generateVCardString, generateWiFiString } from "@/utils/qr-generators"
import { QRCodeSVG } from "qrcode.react"

interface InterstitialPageProps {
    type: "wifi" | "vcard" | "text"
    data: any
}

export function InterstitialPage({ type, data }: InterstitialPageProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        toast.success("Copied to clipboard")
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownloadVCard = () => {
        const vcardString = generateVCardString(data.vCardConfig)
        const blob = new Blob([vcardString], { type: "text/vcard" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${data.vCardConfig.firstName || "contact"}.vcf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const qrValue =
        type === "wifi" ? generateWiFiString(data.wifiConfig?.ssid, data.wifiConfig?.password, data.wifiConfig?.encryption, data.wifiConfig?.hidden) :
            type === "vcard" ? generateVCardString(data.vCardConfig) :
                data.textContent || ""

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black p-4">
            <Card className="w-full max-w-md shadow-xl text-center">
                <CardHeader className="pb-2">
                    <div className="mx-auto mb-4 w-16 h-16 bg-violet-100 dark:bg-violet-900/20 rounded-full flex items-center justify-center">
                        {type === "wifi" && <Wifi className="w-8 h-8 text-violet-600" />}
                        {type === "vcard" && <Contact className="w-8 h-8 text-violet-600" />}
                        {type === "text" && <Type className="w-8 h-8 text-violet-600" />}
                    </div>
                    <CardTitle className="text-2xl">
                        {type === "wifi" ? "Connect to WiFi" :
                            type === "vcard" ? "Contact Card" :
                                "Text Message"}
                    </CardTitle>
                    <CardDescription>
                        {type === "wifi" ? "Scan the code or copy details below." :
                            type === "vcard" ? "Save this contact to your device." :
                                "View the message below."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                    {/* QR Code Display for easy rescanning */}
                    <div className="flex justify-center">
                        <div className="p-3 bg-white rounded-xl shadow-sm border">
                            <QRCodeSVG value={qrValue} size={150} />
                        </div>
                    </div>

                    {/* WiFi Content */}
                    {type === "wifi" && (
                        <div className="space-y-4 text-left bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Network</span>
                                <span className="font-semibold">{data.wifiConfig?.ssid}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Password</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono bg-white dark:bg-black px-2 py-0.5 rounded border">
                                        {data.wifiConfig?.password}
                                    </span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(data.wifiConfig?.password)}>
                                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* vCard Content */}
                    {type === "vcard" && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">{data.vCardConfig?.firstName} {data.vCardConfig?.lastName}</h3>
                            {data.vCardConfig?.mobile && <p className="text-muted-foreground">{data.vCardConfig.mobile}</p>}
                            {data.vCardConfig?.email && <p className="text-muted-foreground">{data.vCardConfig.email}</p>}

                            <Button onClick={handleDownloadVCard} className="w-full mt-2 gap-2 bg-violet-600 hover:bg-violet-700">
                                <Download className="w-4 h-4" /> Save Contact
                            </Button>
                        </div>
                    )}

                    {/* Text Content */}
                    {type === "text" && (
                        <div className="relative group">
                            <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-900 text-left min-h-[100px] whitespace-pre-wrap font-mono text-sm">
                                {data.textContent}
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleCopy(data.textContent || "")}
                            >
                                <Copy className="w-3 h-3 mr-1" /> Copy
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
