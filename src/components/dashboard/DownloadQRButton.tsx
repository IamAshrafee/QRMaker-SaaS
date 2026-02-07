"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useDownloadQR } from "@/hooks/use-download-qr"
import React from "react"

interface DownloadQRButtonProps {
    shortCode: string
    name: string
    qrType?: "url" | "wifi" | "vcard" | "text"
    qrConfig?: any
    wifiConfig?: any
    vCardConfig?: any
    textContent?: string
    className?: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function DownloadQRButton({ shortCode, name, qrType, qrConfig, wifiConfig, vCardConfig, textContent, className, variant = "outline" }: DownloadQRButtonProps) {
    const { downloadQR } = useDownloadQR()

    return (
        <Button
            variant={variant}
            className={className}
            onClick={() => downloadQR({ shortCode, name, qrType, qrConfig, wifiConfig, vCardConfig, textContent })}
        >
            <Download className="w-4 h-4 mr-2" /> Download QR
        </Button>
    )
}
