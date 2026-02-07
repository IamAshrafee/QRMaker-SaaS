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
import { Download, Wifi, Globe, Contact, Type, Eye, Lock, Calendar, Target, Upload, Image as ImageIcon } from "lucide-react"

import { createQR, updateQR } from "@/actions/qrcodes"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { PhoneMockup } from "./PhoneMockup"
import { generateVCardString, generateWiFiString } from "@/utils/qr-generators"

const PRESET_COLORS = [
    "#000000", "#FFFFFF", "#F43F5E", "#E11D48", "#BE123C", // Reds
    "#8B5CF6", "#7C3AED", "#6D28D9", // Violets
    "#3B82F6", "#2563EB", "#1D4ED8", // Blues
    "#10B981", "#059669", "#047857", // Greens
    "#F59E0B", "#D97706", "#B45309", // Ambers
]

interface QRBuilderProps {
    initialData?: any
}

export function QRBuilder({ initialData }: QRBuilderProps) {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    const [type] = useState(initialData?.qrType || "url") // We usually don't change type after creation for simplicity, or we can. Let's allowing switching for now if UI allows.
    // Actually our UI allows switching tabs. So let's sync it.
    const [qrType, setQrType] = useState<"url" | "wifi" | "vcard" | "text">(initialData?.qrType || "url")

    // --- State: Destination & Content ---
    const [url, setUrl] = useState(initialData?.destinationUrl || "")
    const [textContent, setTextContent] = useState(initialData?.textContent || "")
    const [wifiConfig, setWifiConfig] = useState(initialData?.wifiConfig || { ssid: "", password: "", encryption: "WPA", hidden: false })
    const [vCardConfig, setVCardConfig] = useState(initialData?.vCardConfig || { firstName: "", lastName: "", phone: "", email: "", website: "" })

    // --- State: Design ---
    const [color, setColor] = useState(initialData?.qrConfig?.color || "#000000")
    const [bgColor, setBgColor] = useState(initialData?.qrConfig?.bgColor || "#ffffff")
    const [frame, setFrame] = useState(initialData?.qrConfig?.frame || "square")
    const [logo, setLogo] = useState<string | null>(initialData?.qrConfig?.logo || null)

    // --- State: Smart Rules ---
    const [password, setPassword] = useState(initialData?.password || "")

    // --- Handlers ---

    const handleSave = async () => {
        setIsSaving(true)

        const payload: any = {
            qrType,
            title: initialData?.title || "New QR Code", // Keep existing title if editing
            color,
            bgColor,
            frame,
            logo: logo || undefined
        }

        if (qrType === "url") payload.destinationUrl = url
        if (qrType === "text") payload.textContent = textContent
        if (qrType === "wifi") payload.wifiConfig = wifiConfig
        if (qrType === "vcard") payload.vCardConfig = vCardConfig

        // Pro Features
        if (password) payload.password = password

        let result
        if (initialData && initialData.id) {
            result = await updateQR(initialData.id, payload)
        } else {
            result = await createQR(payload)
        }

        setIsSaving(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(initialData ? "QR Code Updated!" : "QR Code Created!")
            // If creating, redirect. If updating, maybe stay or redirect. Let's redirect for consistency.
            router.push("/dashboard/qrcodes")
            router.refresh()
        }
    }

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

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setLogo(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // --- Render Helpers ---

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden">

            {/* LEFT PANEL: Builder Controls */}
            <div className="lg:w-1/2 xl:w-2/5 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0a]">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-900">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                        QR Builder
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Create intelligent, dynamic QR codes.</p>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                    {/* Step 1: Destination */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold flex items-center">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-xs font-bold mr-2">1</span>
                            Choose Destination
                        </h2>

                        <Tabs defaultValue="url" onValueChange={(v: any) => setQrType(v)} className="w-full">
                            <TabsList className="grid w-full grid-cols-4 mb-4">
                                <TabsTrigger value="url"><Globe className="w-4 h-4" /><span className="ml-2 hidden sm:inline">URL</span></TabsTrigger>
                                <TabsTrigger value="wifi"><Wifi className="w-4 h-4" /><span className="ml-2 hidden sm:inline">WiFi</span></TabsTrigger>
                                <TabsTrigger value="vcard"><Contact className="w-4 h-4" /><span className="ml-2 hidden sm:inline">vCard</span></TabsTrigger>
                                <TabsTrigger value="text"><Type className="w-4 h-4" /><span className="ml-2 hidden sm:inline">Text</span></TabsTrigger>
                            </TabsList>

                            {/* URL Input */}
                            <TabsContent value="url" className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Website URL</Label>
                                    <Input
                                        placeholder="https://example.com"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="h-12 text-lg"
                                    />
                                    <p className="text-xs text-muted-foreground">Redirect users to any webpage. Dynamic & trackable.</p>
                                </div>
                            </TabsContent>

                            {/* WiFi Input */}
                            <TabsContent value="wifi" className="space-y-4">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label>Network Name (SSID)</Label>
                                        <Input
                                            placeholder="MyWiFi"
                                            value={wifiConfig.ssid}
                                            onChange={(e) => setWifiConfig({ ...wifiConfig, ssid: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Password</Label>
                                        <Input
                                            type="password"
                                            placeholder="********"
                                            value={wifiConfig.password}
                                            onChange={(e) => setWifiConfig({ ...wifiConfig, password: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="hidden-network"
                                            checked={wifiConfig.hidden}
                                            onCheckedChange={(c) => setWifiConfig({ ...wifiConfig, hidden: c })}
                                        />
                                        <Label htmlFor="hidden-network">Hidden Network</Label>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* vCard Input */}
                            <TabsContent value="vcard" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>First Name</Label>
                                        <Input
                                            value={vCardConfig.firstName}
                                            onChange={(e) => setVCardConfig({ ...vCardConfig, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Last Name</Label>
                                        <Input
                                            value={vCardConfig.lastName}
                                            onChange={(e) => setVCardConfig({ ...vCardConfig, lastName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <Label>Phone Number</Label>
                                        <Input
                                            placeholder="+1 234 567 8900"
                                            value={vCardConfig.phone}
                                            onChange={(e) => setVCardConfig({ ...vCardConfig, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <Label>Email</Label>
                                        <Input
                                            placeholder="john@example.com"
                                            value={vCardConfig.email}
                                            onChange={(e) => setVCardConfig({ ...vCardConfig, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Text Input */}
                            <TabsContent value="text" className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Plain Text</Label>
                                    <textarea
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Enter your text here..."
                                        value={textContent}
                                        onChange={(e) => setTextContent(e.target.value)}
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </section>

                    <hr className="border-t border-slate-100 dark:border-slate-800" />

                    {/* Step 2: Design */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold flex items-center">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-xs font-bold mr-2">2</span>
                            Customize Design
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Colors */}
                            <div className="space-y-3">
                                <Label>Data Pattern Color</Label>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full border shadow-sm" style={{ backgroundColor: color }} />
                                    <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 cursor-pointer" />
                                </div>
                                {/* Preset Colors */}
                                <div className="flex flex-wrap gap-2">
                                    {PRESET_COLORS.slice(0, 10).map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className="w-6 h-6 rounded-full border border-slate-200 focus:ring-2 ring-violet-500 transition-all hover:scale-110"
                                            style={{ backgroundColor: c }}
                                            aria-label={`Select color ${c}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Background Color</Label>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full border shadow-sm" style={{ backgroundColor: bgColor }} />
                                    <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 cursor-pointer" />
                                </div>
                            </div>
                        </div>

                        {/* Logo Upload */}
                        <div className="space-y-3 pt-2">
                            <Label>Logo Overlay</Label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-700 overflow-hidden">
                                    {logo ? (
                                        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                                    ) : (
                                        <ImageIcon className="w-8 h-8 text-slate-400" />
                                    )}
                                    {logo && (
                                        <button
                                            onClick={() => setLogo(null)}
                                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"
                                        >
                                            <span className="sr-only">Remove</span>
                                            <div className="w-3 h-3 flex items-center justify-center text-[10px]">✕</div>
                                        </button>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="cursor-pointer"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Upload a square logo (PNG/JPG). It will be centered on the QR code.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="border-t border-slate-100 dark:border-slate-800" />

                    {/* Step 3: Smart Rules */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold flex items-center">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-xs font-bold mr-2">3</span>
                                Smart Rules
                            </h2>
                            <span className="bg-violet-100 text-violet-800 text-xs px-2 py-0.5 rounded-full font-medium">Pro</span>
                        </div>

                        <div className="space-y-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111]">

                            <div className="flex items-start gap-3">
                                <Lock className="w-5 h-5 text-slate-400 mt-1" />
                                <div className="flex-1 space-y-2">
                                    <Label>Password Protection</Label>
                                    <Input
                                        type="password"
                                        placeholder="Set a password to unlock"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-white dark:bg-black"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-3 opacity-60 cursor-not-allowed">
                                <Calendar className="w-5 h-5 text-slate-400 mt-1" />
                                <div className="flex-1 space-y-1">
                                    <Label>Schedule (Coming Soon)</Label>
                                    <p className="text-xs text-muted-foreground">Set active and expiration dates.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 opacity-60 cursor-not-allowed">
                                <Target className="w-5 h-5 text-slate-400 mt-1" />
                                <div className="flex-1 space-y-1">
                                    <Label>Retargeting (Coming Soon)</Label>
                                    <p className="text-xs text-muted-foreground">Add Facebook/Google pixels.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Padding for bottom button visibility */}
                    <div className="h-20" />
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-[#0a0a0a]">
                    <Button onClick={handleSave} disabled={isSaving} className="w-full bg-glorious-gradient text-white h-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all">
                        {isSaving ? "Saving..." : (initialData ? "Update QR Code" : "Create QR Code")}
                    </Button>
                </div>
            </div>

            {/* RIGHT PANEL: Live Preview */}
            <div className="hidden lg:flex flex-1 bg-slate-100 dark:bg-[#050505] items-center justify-center p-12 relative overflow-hidden">

                {/* Background Decor */}
                <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
                </div>

                <div className="z-10 flex flex-col items-center gap-8">
                    <div className="flex items-center gap-2 bg-white/80 dark:bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm">
                        <Eye className="w-4 h-4 text-violet-500" />
                        <span className="text-sm font-medium">Live Preview</span>
                    </div>

                    <PhoneMockup>
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6">

                            {/* Visual Feedback based on type */}
                            {qrType === "wifi" && <Wifi className="w-12 h-12 text-violet-500 mb-2" />}
                            {qrType === "vcard" && <Contact className="w-12 h-12 text-violet-500 mb-2" />}

                            <h3 className="text-xl font-bold">
                                {qrType === 'url' ? 'Scan & Go' :
                                    qrType === 'wifi' ? 'Connect to WiFi' :
                                        qrType === 'vcard' ? 'Add Contact' : 'View Message'}
                            </h3>

                            <div className="bg-white p-4 rounded-xl shadow-lg ring-1 ring-slate-100 dark:ring-slate-800">
                                <QRCodeSVG
                                    id="qr-code-svg"
                                    value={
                                        qrType === "url" ? (url || "https://qrmaker.saas") :
                                            qrType === "wifi" ? generateWiFiString(wifiConfig.ssid, wifiConfig.password, wifiConfig.encryption, wifiConfig.hidden) :
                                                qrType === "vcard" ? generateVCardString(vCardConfig) :
                                                    qrType === "text" ? (textContent || "Your text here") :
                                                        "https://qrmaker.saas"
                                    }
                                    size={180}
                                    fgColor={color}
                                    bgColor={bgColor}
                                    level="H"
                                    includeMargin={false}
                                    imageSettings={logo ? {
                                        src: logo,
                                        height: 34,
                                        width: 34,
                                        excavate: true
                                    } : undefined}
                                />
                            </div>

                            <p className="text-sm text-muted-foreground w-4/5">
                                {qrType === 'url' ? 'Point your camera at the code to visit the link.' :
                                    qrType === 'wifi' ? 'Scan to automatically join the network.' :
                                        'Scan to view content.'}
                            </p>
                        </div>
                    </PhoneMockup>

                    <Button onClick={handleDownload} variant="outline" className="bg-white/50 backdrop-blur border-white/40 hover:bg-white/80">
                        <Download className="w-4 h-4 mr-2" />
                        Download SVG
                    </Button>
                </div>
            </div>
        </div>
    )
}
