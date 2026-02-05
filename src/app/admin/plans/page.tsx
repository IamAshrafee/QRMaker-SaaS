"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function PlansPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Plan Manager</h2>
                <p className="text-muted-foreground">Configure plan limits and features dynamically.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {['Free', 'Pro', 'Agency'].map((plan) => (
                    <Card key={plan}>
                        <CardHeader>
                            <CardTitle>{plan} Plan</CardTitle>
                            <CardDescription>Configure limits for {plan} users.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Monthly Price ($)</Label>
                                <Input defaultValue={plan == 'Free' ? '0' : plan == 'Pro' ? '19' : '49'} />
                            </div>
                            <div className="space-y-2">
                                <Label>QR Limit</Label>
                                <Input defaultValue={plan == 'Free' ? '5' : plan == 'Pro' ? '50' : '9999'} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Remove Branding</Label>
                                <Switch defaultChecked={plan !== 'Free'} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline">Save Changes</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
