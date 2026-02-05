"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Download, Zap } from "lucide-react"

export default function BillingPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Billing & Plans</h2>
                <p className="text-muted-foreground">Manage your subscription, payment methods, and invoices.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_300px]">

                {/* Main Content */}
                <div className="space-y-8">

                    {/* Current Plan & Usage */}
                    <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl text-indigo-600 dark:text-indigo-400">Free Plan</CardTitle>
                                    <CardDescription>Your current active subscription</CardDescription>
                                </div>
                                <Badge className="bg-indigo-500 hover:bg-indigo-600">Active</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">QR Codes Generated</span>
                                    <span className="text-muted-foreground">5 / 5 Used</span>
                                </div>
                                <Progress value={100} className="h-2" />
                                <p className="text-xs text-red-500">You have reached your limit.</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Monthly Scans</span>
                                    <span className="text-muted-foreground">1,204 / 5,000</span>
                                </div>
                                <Progress value={24} className="h-2" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-glorious-gradient shadow-lg hover:opacity-90">
                                <Zap className="w-4 h-4 mr-2 fill-current" /> Upgrade to Pro
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Available Plans */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Pro Plan */}
                        <Card className="relative border-2 border-indigo-500 shadow-xl scale-105 z-10">
                            <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md">
                                Popular
                            </div>
                            <CardHeader>
                                <CardTitle>Pro Plan</CardTitle>
                                <div className="mt-2">
                                    <span className="text-3xl font-bold">$12</span>
                                    <span className="text-muted-foreground">/month</span>
                                </div>
                                <CardDescription>For growing businesses.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {["50 Dynamic QR Codes", "Unlimited Scans", "Advanced Analytics", "Custom Designs", "No Ads"].map((feature) => (
                                    <div key={feature} className="flex items-center gap-2 text-sm">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Choose Pro</Button>
                            </CardFooter>
                        </Card>

                        {/* Business Plan */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Business</CardTitle>
                                <div className="mt-2">
                                    <span className="text-3xl font-bold">$29</span>
                                    <span className="text-muted-foreground">/month</span>
                                </div>
                                <CardDescription>For agencies and teams.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {["Unlimited QR Codes", "Team Members", "API Access", "White Labeling", "Priority Support"].map((feature) => (
                                    <div key={feature} className="flex items-center gap-2 text-sm">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full">Choose Business</Button>
                            </CardFooter>
                        </Card>
                    </div>

                </div>

                {/* Sidebar: Payment & History */}
                <div className="space-y-6">

                    {/* Payment Method */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-3 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                <CreditCard className="w-6 h-6 text-slate-500" />
                                <div className="flex-1">
                                    <p className="font-medium text-sm">•••• 4242</p>
                                    <p className="text-xs text-muted-foreground">Expires 12/28</p>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full text-sm">Update Card</Button>
                        </CardContent>
                    </Card>

                    {/* Invoice History */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Invoices</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-md transition-colors group cursor-pointer">
                                    <div>
                                        <p className="text-sm font-medium">Feb 01, 2026</p>
                                        <p className="text-xs text-muted-foreground">$12.00 • Pro Plan</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="group-hover:text-indigo-500">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button variant="link" className="w-full text-xs text-muted-foreground">View All</Button>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}
