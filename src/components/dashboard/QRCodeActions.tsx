"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, Edit, MoreHorizontal, Trash } from "lucide-react"
import Link from "next/link"
import { deleteLink } from "@/actions/qrcodes"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import QRCode from "qrcode"

interface QRCodeActionsProps {
    id: string
    url: string
    shortCode: string
}

export function QRCodeActions({ id, url, shortCode }: QRCodeActionsProps) {
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this QR code?")) return

        const result = await deleteLink(id)
        if (result.success) {
            toast.success("QR Code deleted")
            router.refresh()
        } else {
            toast.error(result.error || "Failed to delete")
        }
    }

    const handleDownload = async () => {
        try {
            // Generate QR Blob
            const qrUrl = `${window.location.origin}/${shortCode}`
            const dataUrl = await QRCode.toDataURL(qrUrl, { width: 400, margin: 2 })

            // Create Download Link
            const link = document.createElement('a')
            link.href = dataUrl
            link.download = `qr-${shortCode}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            toast.success("QR Code downloaded")
        } catch (error) {
            console.error(error)
            toast.error("Failed to generate download")
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem disabled><Edit className="w-4 h-4 mr-2" /> Edit (Coming Soon)</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}><Download className="w-4 h-4 mr-2" /> Download</DropdownMenuItem>
                <Link href={`/dashboard/links/${id}`} className="w-full">
                    <DropdownMenuItem className="cursor-pointer">
                        <MoreHorizontal className="w-4 h-4 mr-2" /> View Analytics
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={handleDelete} className="text-red-500 cursor-pointer">
                    <Trash className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
