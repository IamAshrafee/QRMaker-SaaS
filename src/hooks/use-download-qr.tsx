import { toast } from "react-hot-toast"
import { createRoot } from "react-dom/client"
import { QRCodeCanvas } from "qrcode.react"
import React from "react"
import { generateWiFiString, generateVCardString } from "../utils/qr-generators"

interface DownloadQROptions {
    shortCode: string
    name: string
    qrType?: "url" | "wifi" | "vcard" | "text"
    qrConfig?: {
        color: string
        bgColor: string
        logo?: string
    }
    wifiConfig?: {
        ssid: string
        password?: string
        encryption: string
        hidden: boolean
    }
    vCardConfig?: any
    textContent?: string
}

export function useDownloadQR() {

    const downloadQR = async ({ shortCode, name, qrType = "url", qrConfig, wifiConfig, vCardConfig, textContent }: DownloadQROptions) => {
        const toastId = toast.loading("Generating QR...")
        try {
            const size = 1000 // High Res
            const container = document.createElement("div")
            container.style.display = "none"
            document.body.appendChild(container)

            // Determine QR Value based on Type
            let qrValue = `${window.location.origin}/${shortCode}`

            if (qrType === "wifi" && wifiConfig) {
                qrValue = generateWiFiString(wifiConfig.ssid, wifiConfig.password, wifiConfig.encryption, wifiConfig.hidden)
            } else if (qrType === "vcard" && vCardConfig) {
                qrValue = generateVCardString(vCardConfig)
            } else if (qrType === "text" && textContent) {
                qrValue = textContent || ""
            }

            const root = createRoot(container)

            // Render the QRCodeCanvas into the hidden container
            const element = React.createElement(QRCodeCanvas, {
                value: qrValue,
                size: size,
                fgColor: qrConfig?.color || "#000000",
                bgColor: qrConfig?.bgColor || "#ffffff",
                level: "H",
                includeMargin: false,
                imageSettings: qrConfig?.logo ? {
                    src: qrConfig.logo,
                    height: size * 0.2,
                    width: size * 0.2,
                    excavate: true,
                } : undefined
            })

            root.render(element)

            // Wait for render and image loading
            await new Promise((resolve) => setTimeout(resolve, 500))

            const canvas = container.querySelector("canvas")
            if (!canvas) throw new Error("Canvas not generated")

            const dataUrl = canvas.toDataURL("image/png")

            const link = document.createElement('a')
            link.href = dataUrl
            link.download = `qr-${name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || shortCode}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Clean up
            root.unmount()
            document.body.removeChild(container)

            toast.success("QR Code downloaded", { id: toastId })
        } catch (error) {
            console.error(error)
            toast.error("Failed to generate download", { id: toastId })
        }
    }

    return { downloadQR }
}
