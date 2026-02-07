"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, Edit, MoreHorizontal, Trash } from "lucide-react"
import Link from "next/link"
import { deleteLink } from "@/actions/qrcodes"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useDownloadQR } from "@/hooks/use-download-qr"

interface QRCodeActionsProps {
    id: string
    url: string
    shortCode: string
    name: string
    qrType?: "url" | "wifi" | "vcard" | "text"
    qrConfig?: any
    wifiConfig?: any
    vCardConfig?: any
    textContent?: string
}

export function QRCodeActions({ id, url, shortCode, name, qrType, qrConfig, wifiConfig, vCardConfig, textContent }: QRCodeActionsProps) {
    const router = useRouter()
    const { downloadQR } = useDownloadQR()

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

    const handleDownload = () => {
        downloadQR({ shortCode, name, qrType, qrConfig, wifiConfig, vCardConfig, textContent })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <Link href={`/dashboard/links/${id}/editor`} className="w-full">
                    <DropdownMenuItem className="cursor-pointer">
                        <Edit className="w-4 h-4 mr-2" /> Edit design
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
                    <Download className="w-4 h-4 mr-2" /> Download PNG
                </DropdownMenuItem>
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
