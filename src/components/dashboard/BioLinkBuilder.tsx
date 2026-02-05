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
import { SortableLinkItem } from "./SortableLinkItem"
import { Smartphone, Plus } from "lucide-react"

// Mock Initial Data
const initialLinks = [
    { id: '1', title: 'My Portfolio', url: 'https://ashrafee.com', active: true },
    { id: '2', title: 'Instagram', url: 'https://instagram.com', active: true },
    { id: '3', title: 'YouTube Channel', url: 'https://youtube.com', active: true },
]

export function BioLinkBuilder() {
    const [links, setLinks] = useState(initialLinks)
    const [mounted, setMounted] = useState(false)

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

    const handleUpdate = (id: string, field: string, value: any) => {
        setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l))
    }

    const handleDelete = (id: string) => {
        setLinks(links.filter(l => l.id !== id))
    }

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">

            {/* LEFT PANEL: Editor */}
            <div className="flex-1 overflow-y-auto p-6 border-r border-slate-200 dark:border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Bio Page Editor</h2>
                        <p className="text-muted-foreground">Add and rearrange your links.</p>
                    </div>
                    <Button onClick={handleAddLink} className="bg-indigo-600 hover:bg-indigo-700 text-white">
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
                        <div className="space-y-4">
                            {links.map(link => (
                                <SortableLinkItem
                                    key={link.id}
                                    {...link}
                                    onUpdate={handleUpdate}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            {/* RIGHT PANEL: Preview */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-8 sticky top-0">
                <div className="text-center mb-6">
                    <h3 className="font-semibold flex items-center gap-2 justify-center">
                        <Smartphone className="w-4 h-4" /> Live Mobile Preview
                    </h3>
                </div>

                {/* Mobile Mockup */}
                <div className="w-[320px] h-[640px] border-8 border-slate-800 rounded-[3rem] bg-white dark:bg-slate-950 overflow-hidden shadow-2xl relative">
                    {/* Search Bar / Top Bar Mock */}
                    <div className="h-6 bg-slate-900 w-1/2 mx-auto rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 z-10" />

                    {/* Screen Content */}
                    <div className="h-full w-full overflow-y-auto pt-12 pb-4 px-4 scrollbar-hide bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-slate-900 dark:to-slate-800">

                        {/* Avatar & Info */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 mb-4 border-4 border-white dark:border-slate-700 shadow-md" />
                            <h4 className="font-bold text-lg">@username</h4>
                            <p className="text-sm text-muted-foreground text-center">Software Engineer & Creator</p>
                        </div>

                        {/* Links List */}
                        <div className="space-y-3">
                            {links.map(link => (
                                <a
                                    key={link.id}
                                    href={link.url || '#'}
                                    target="_blank"
                                    className="block w-full p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-center hover:scale-[1.02] transition-transform"
                                >
                                    <span className="font-medium text-slate-900 dark:text-white">
                                        {link.title || "Untitled Link"}
                                    </span>
                                </a>
                            ))}
                        </div>

                        {/* Branding */}
                        <div className="mt-12 text-center">
                            <p className="text-[10px] text-muted-foreground font-semibold flex items-center justify-center gap-1">
                                <span className="w-3 h-3 bg-indigo-500 rounded-sm" />
                                Powered by QRMaker
                            </p>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}
