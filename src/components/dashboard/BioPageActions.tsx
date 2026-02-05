"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ExternalLink, Pencil, BarChart3, Trash2, Palette } from "lucide-react"
import Link from "next/link"
import { deleteLink } from "@/actions/qrcodes"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

interface BioPageActionsProps {
    id: string
    slug: string
    url: string
    name: string
}

export function BioPageActions({ id, slug, url, name }: BioPageActionsProps) {
    const router = useRouter()

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this Bio Page?")) {
            const res = await deleteLink(id)
            if (res.error) {
                toast.error(res.error)
            } else {
                toast.success("Bio Page deleted")
                router.refresh()
            }
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <Link href={`/${slug}`} target="_blank">
                    <DropdownMenuItem className="cursor-pointer">
                        <ExternalLink className="mr-2 h-4 w-4" /> View Live Page
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link href={`/dashboard/links/${id}/content`}>
                    <DropdownMenuItem className="cursor-pointer font-medium">
                        <Pencil className="mr-2 h-4 w-4" /> Edit Content
                    </DropdownMenuItem>
                </Link>
                <Link href={`/dashboard/links/${id}/editor`}>
                    <DropdownMenuItem className="cursor-pointer">
                        <Palette className="mr-2 h-4 w-4" /> Edit Design
                    </DropdownMenuItem>
                </Link>
                <Link href={`/dashboard/links/${id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                        <BarChart3 className="mr-2 h-4 w-4" /> Analytics
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
