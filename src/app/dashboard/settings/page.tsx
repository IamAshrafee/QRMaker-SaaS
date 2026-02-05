"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, User, Megaphone } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account, preferences, and billing.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="bg-slate-100 dark:bg-slate-800 p-1">
                    <TabsTrigger value="profile" className="gap-2"><User className="w-4 h-4" /> Profile</TabsTrigger>
                    <TabsTrigger value="pixels" className="gap-2"><Megaphone className="w-4 h-4" /> Marketing</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal details here.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue="Ashrafee" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" defaultValue="ashrafee@example.com" disabled className="bg-slate-100 dark:bg-slate-900" />
                                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Change your password.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="current">Current Password</Label>
                                <Input id="current" type="password" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="new">New Password</Label>
                                <Input id="new" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline">Update Password</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Marketing Pixels Tab */}
                <TabsContent value="pixels" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Retargeting Pixels</CardTitle>
                            <CardDescription>Add your global tracking IDs. These will be automatically available in your Link Builder.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="fb_pixel">Facebook Pixel ID</Label>
                                <Input id="fb_pixel" placeholder="e.g. 1234567890" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="ga_id">Google Analytics ID (GT-XXXX)</Label>
                                <Input id="ga_id" placeholder="e.g. GT-A1B2C3" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tiktok_pixel">TikTok Pixel ID</Label>
                                <Input id="tiktok_pixel" placeholder="e.g. C1D2E3F4" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save Identifiers</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>


            </Tabs>
        </div>
    )
}
