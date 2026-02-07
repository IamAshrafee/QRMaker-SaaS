

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { QrCode } from "lucide-react"

import Link from "next/link"
import { getLinks } from "@/actions/qrcodes"
import { QRCodeActions } from "@/components/dashboard/QRCodeActions"

export default async function QRCodesPage() {
    const { links, error } = await getLinks()

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
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
                        {error && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-red-500 py-10">
                                    Failed to load links.
                                </TableCell>
                            </TableRow>
                        )}

                        {links && links.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    No QR codes found. Create one above!
                                </TableCell>
                            </TableRow>
                        )}

                        {links && links.map((item: any) => (
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
                                    <QRCodeActions
                                        id={item.id}
                                        url={item.url}
                                        shortCode={item.slug}
                                        name={item.name}
                                        qrConfig={item.qrConfig}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
