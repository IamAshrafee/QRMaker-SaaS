"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { createBioPage } from "@/actions/qrcodes"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export function CreateNewBioButton() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleCreate() {
        setLoading(true)
        // Create with defaults (random slug, "My Bio Page")
        const res = await createBioPage()

        if (res.error) {
            toast.error(res.error)
            setLoading(false)
        } else {
            toast.success("Bio Page Created!")
            // Directly redirect to content editor
            if (res.id) {
                router.push(`/dashboard/links/${res.id}/content`)
            } else {
                router.refresh()
                setLoading(false)
            }
        }
    }

    return (
        <Button
            onClick={handleCreate}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
        >
            {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Plus className="w-4 h-4 mr-2" />
            )}
            Create Bio Page
        </Button>
    )
}
