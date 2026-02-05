"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { GripVertical, Trash2 } from "lucide-react"

interface LinkItemProps {
    id: string
    title: string
    url: string
    active: boolean
    onUpdate: (id: string, field: string, value: any) => void
    onDelete: (id: string) => void
}

export function SortableLinkItem({ id, title, url, active, onUpdate, onDelete }: LinkItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <Card ref={setNodeRef} style={style} className="mb-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-4 flex items-start gap-3">
                {/* Drag Handle */}
                <div {...attributes} {...listeners} className="mt-3 cursor-grab text-slate-400 hover:text-slate-600">
                    <GripVertical className="w-5 h-5" />
                </div>

                {/* content */}
                <div className="flex-1 space-y-3">
                    <Input
                        placeholder="Link Title (e.g. My Website)"
                        value={title}
                        onChange={(e) => onUpdate(id, 'title', e.target.value)}
                        className="font-semibold"
                    />
                    <Input
                        placeholder="https://..."
                        value={url}
                        onChange={(e) => onUpdate(id, 'url', e.target.value)}
                        className="text-sm text-muted-foreground h-8"
                    />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                        onClick={() => onDelete(id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                    {/* Toggle Active could go here */}
                </div>
            </CardContent>
        </Card>
    )
}
