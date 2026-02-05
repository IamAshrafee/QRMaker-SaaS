"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { createBioPage } from "@/actions/qrcodes"
import { toast } from "react-hot-toast"

export function CreateBioDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const title = formData.get("title") as string
        const slug = formData.get("slug") as string

        const res = await createBioPage({ title, slug: slug || undefined })

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Bio Page Created!")
            setOpen(false)
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
                    <Plus className="w-4 h-4 mr-2" /> Create Bio Page
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Bio Page</DialogTitle>
                    <DialogDescription>
                        Give your page a title. You can customize the design next.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Page Title</Label>
                            <Input id="title" name="title" placeholder="My Awesome Portfolio" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="slug">Custom URL (Optional)</Label>
                            <div className="flex items-center">
                                <span className="text-sm text-muted-foreground mr-2 whitespace-nowrap">
                                    qrmaker.saas/
                                </span>
                                <Input id="slug" name="slug" placeholder="username" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Page
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
