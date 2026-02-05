"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"
import { createBioPage } from "@/actions/qrcodes"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

interface ActivateBioButtonProps {
    username: string
    name: string
}

export function ActivateBioButton({ username, name }: ActivateBioButtonProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleActivate() {
        setLoading(true)
        // Auto-create using username as slug
        const res = await createBioPage({
            title: name,
            slug: username
        })

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Bio Page Activated!")
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-slate-50/50 dark:bg-slate-900/50 space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-2">
                <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold">Activate Your Bio Page</h3>
            <p className="text-muted-foreground max-w-sm">
                Claim your personal link at <span className="font-mono text-indigo-500 font-medium">/{username}</span> instantly.
            </p>
            <Button
                onClick={handleActivate}
                disabled={loading}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md mt-4"
            >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? "Activating..." : "Claim My Page"}
            </Button>
        </div>
    )
}
