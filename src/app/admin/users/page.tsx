"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Shield, Trash, UserX } from "lucide-react"

const mockUsers = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "user", plan: "Free", status: "Active" },
    { id: 2, name: "Bob Smith", email: "bob@company.com", role: "admin", plan: "Pro", status: "Active" },
    { id: 3, name: "Charlie Brown", email: "charlie@test.com", role: "user", plan: "Agency", status: "Suspended" },
]

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                    <p className="text-muted-foreground">Manage user roles, plans, and access.</p>
                </div>
                <Button>Export CSV</Button>
            </div>

            <div className="flex items-center gap-4">
                <Input placeholder="Search users by email..." className="max-w-sm" />
            </div>

            <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Avatar</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'}`}>
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="font-semibold">{user.plan}</span>
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                    {user.status}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem><Shield className="w-4 h-4 mr-2" /> specific Change Role</DropdownMenuItem>
                                            <DropdownMenuItem className="text-orange-500"><UserX className="w-4 h-4 mr-2" /> Suspend User</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-500"><Trash className="w-4 h-4 mr-2" /> Delete Data</DropdownMenuItem>
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
