"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Edit, MoreHorizontal, QrCode, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

const mockData = [
    { id: "1", name: "Restaurant Menu", url: "https://menu.com", scans: 120, createdAt: "Feb 1, 2026" },
    { id: "2", name: "WiFi Guest", url: "WIFI:S:...", scans: 45, createdAt: "Jan 28, 2026" },
]

export default function QRCodesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">QR Codes</h2>
                    <p className="text-muted-foreground">Manage your dynamic QR codes.</p>
                </div>
                <Link href="/dashboard/create">
                    <Button className="bg-primary text-primary-foreground shadow-lg">
                        + Create QR
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <Input placeholder="Search by name..." className="max-w-sm" />
            </div>

            <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Scans</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockData.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <QrCode className="w-4 h-4 text-slate-500" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{item.url}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        {item.scans}
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{item.createdAt}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                                            <DropdownMenuItem><Download className="w-4 h-4 mr-2" /> Download</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-500"><Trash className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
