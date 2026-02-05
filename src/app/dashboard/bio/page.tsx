import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Smartphone } from "lucide-react"
import { getLinks } from "@/actions/qrcodes"
import { BioPageActions } from "@/components/dashboard/BioPageActions"
// import { CreateBioDialog } from "@/components/dashboard/CreateBioDialog" // Deprecated for this view? Or keep if we want to allow custom slug still? User said "it will not show the modal".
import { CreateNewBioButton } from "@/components/dashboard/CreateNewBioButton"
import { ActivateBioButton } from "@/components/dashboard/ActivateBioButton"
import { auth } from "@/auth"

export default async function BioDashboardPage() {
    const session = await auth()
    const { links, error } = await getLinks(20, 0, 'bio')

    const userHasLinks = links && links.length > 0
    const username = session?.user?.username || "user"
    const name = session?.user?.name || "My Bio Page"

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Bio Pages</h2>
                    <p className="text-muted-foreground">Manage your personal bio link pages.</p>
                </div>
                {/* Only show "Create Custom" if user already has their main page, or generic create logic */}
                {userHasLinks && <CreateNewBioButton />}
            </div>

            {!userHasLinks ? (
                // Empty State: One-Click Activation
                <ActivateBioButton username={username} name={name} />
            ) : (
                // Table State
                <>
                    <div className="flex items-center gap-4">
                        <Input placeholder="Search by title..." className="max-w-sm" />
                    </div>

                    <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Page Title</TableHead>
                                    <TableHead>Url</TableHead>
                                    <TableHead>Views</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {error && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-red-500 py-10">
                                            Failed to load bio pages.
                                        </TableCell>
                                    </TableRow>
                                )}

                                {links && links.map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="w-8 h-8 rounded bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                                <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{item.name}</div>
                                        </TableCell>
                                        <TableCell>
                                            <a href={item.url} target="_blank" className="text-xs text-indigo-500 hover:underline truncate max-w-[200px] block">
                                                {item.slug}
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                {item.scans}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{item.createdAt}</TableCell>
                                        <TableCell className="text-right">
                                            <BioPageActions
                                                id={item.id}
                                                slug={item.slug}
                                                url={item.url}
                                                name={item.name}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </>
            )}
        </div>
    )
}
