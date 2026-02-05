"use client"

import { useState, useEffect } from "react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "../ui/textarea"
import { SortableLinkItem } from "./SortableLinkItem"
import { Smartphone, Plus, Save, Loader2, Link as LinkIcon, User } from "lucide-react"
import { updateBioContent } from "@/actions/bio-actions"
import { toast } from "react-hot-toast"

interface BioContentEditorProps {
    linkId: string
    initialData: any
}

export function BioContentEditor({ linkId, initialData }: BioContentEditorProps) {
    const [mounted, setMounted] = useState(false)
    const [saving, setSaving] = useState(false)

    // State for Bio Config
    const [pageTitle, setPageTitle] = useState(initialData.title || "")
    const [avatar, setAvatar] = useState(initialData.bioConfig?.avatar || "")
    const [description, setDescription] = useState(initialData.bioConfig?.description || "")

    // Ensure links have 'id' property for dnd-kit
    const [links, setLinks] = useState<any[]>((initialData.bioConfig?.links || []).map((l: any) => ({
        ...l,
        id: l.id || l._id?.toString() || Math.random().toString(36).substr(2, 9)
    })))

    useEffect(() => {
        setMounted(true)
    }, [])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    if (!mounted) return null

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            setLinks((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const handleAddLink = () => {
        const newLink = {
            id: Math.random().toString(36).substr(2, 9),
            title: '',
            url: '',
            active: true
        }
        setLinks([newLink, ...links])
    }

    const handleUpdateLink = (id: string, field: string, value: any) => {
        setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l))
    }

    const handleDeleteLink = (id: string) => {
        setLinks(links.filter(l => l.id !== id))
    }

    const handleSave = async () => {
        setSaving(true)
        const payload = {
            title: pageTitle,
            avatar,
            description,
            links
        }

        const res = await updateBioContent(linkId, payload)

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Content saved successfully")
        }
        setSaving(false)
    }

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)]">

            {/* LEFT PANEL: Editor */}
            <div className="flex-1 overflow-y-auto pr-6 pb-20 space-y-8">

                {/* Header Actions */}
                <div className="flex items-center justify-between sticky top-0 bg-slate-50 dark:bg-slate-950 z-10 py-4 border-b">
                    <div>
                        <h2 className="text-2xl font-bold">Edit Content</h2>
                        <p className="text-muted-foreground">Manage your profile and links.</p>
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="min-w-[120px]">
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>

                {/* Profile Section */}
                <div className="space-y-4 rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-semibold text-lg">Profile Information</h3>
                    </div>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="pageTitle">Page Title (Internal)</Label>
                            <Input
                                id="pageTitle"
                                value={pageTitle}
                                onChange={(e) => setPageTitle(e.target.value)}
                                placeholder="My Portfolio Page"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="avatar">Avatar URL</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="avatar"
                                    value={avatar}
                                    onChange={(e) => setAvatar(e.target.value)}
                                    placeholder="https://github.com/shadcn.png"
                                />
                                {avatar && (
                                    <div className="w-10 h-10 rounded-full overflow-hidden border shrink-0">
                                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Bio Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                placeholder="Tell us about yourself..."
                                className="resize-none"
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                {/* Links Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <LinkIcon className="w-5 h-5 text-indigo-500" />
                            <h3 className="font-semibold text-lg">Links</h3>
                        </div>
                        <Button onClick={handleAddLink} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-2" /> Add Link
                        </Button>
                    </div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={links}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {links.length === 0 && (
                                    <div className="text-center p-8 border-2 border-dashed rounded-lg text-muted-foreground">
                                        No links added yet. Click "Add Link" to start.
                                    </div>
                                )}
                                {links.map(link => (
                                    <SortableLinkItem
                                        key={link.id}
                                        id={link.id}
                                        title={link.title}
                                        url={link.url}
                                        active={link.active}
                                        onUpdate={handleUpdateLink}
                                        onDelete={handleDeleteLink}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            </div>

            {/* RIGHT PANEL: Preview */}
            <div className="hidden lg:flex flex-1 bg-slate-100 dark:bg-slate-900/50 flex-col items-center justify-center p-8 sticky top-4 rounded-2xl border ml-6 h-[calc(100vh-140px)]">
                <div className="text-center mb-6">
                    <h3 className="font-semibold flex items-center gap-2 justify-center text-muted-foreground">
                        <Smartphone className="w-4 h-4" /> Live Mobile Preview
                    </h3>
                </div>

                {/* Mobile Mockup */}
                <div className="w-[300px] h-[600px] border-[10px] border-slate-900 rounded-[3rem] bg-white dark:bg-slate-950 overflow-hidden shadow-2xl relative ring-1 ring-slate-900/5">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-xl z-20"></div>

                    {/* Screen Content */}
                    <div className="h-full w-full overflow-y-auto px-4 pb-12 pt-14 scrollbar-hide bg-slate-50 dark:bg-slate-950">
                        {/* Avatar & Info */}
                        <div className="flex flex-col items-center mb-6 text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 mb-3 overflow-hidden border-2 border-white shadow-sm">
                                {avatar ? (
                                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-400">?</div>
                                )}
                            </div>
                            <h4 className="font-bold text-lg leading-tight break-all px-2">{initialData.title}</h4>
                            {/* Note: User Name is managed in User Profile usually, but here we can rely on Page Title or just generic. 
                               Actually Public Page uses `user.name`. Content Editor updates `link.title` (Page Title).
                               Let's display `pageTitle` or `user.name` if we had it.
                               For now, display pageTitle as proxy or user handle. 
                            */}
                            <p className="text-xs text-muted-foreground mt-1 px-4">{description}</p>
                        </div>

                        {/* Links List */}
                        <div className="space-y-3">
                            {links.map(link => (
                                <div
                                    key={link.id}
                                    className="block w-full p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center"
                                >
                                    <span className="font-medium text-sm text-slate-900 dark:text-white truncate block">
                                        {link.title || "Untitled Link"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
