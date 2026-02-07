"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"
import { verifyPassword } from "@/actions/public"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

interface PasswordChallengeProps {
    linkId: string
    title?: string
}

export function PasswordChallenge({ linkId, title }: PasswordChallengeProps) {
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await verifyPassword(linkId, password)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Access Granted")
                router.refresh() // Reloads the server component to proceed
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center">
                        <Lock className="w-8 h-8 text-violet-500" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Protected Content</CardTitle>
                        <CardDescription>
                            This link is password protected. Please enter the password to view <span className="font-medium text-foreground">{title || "the content"}</span>.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="text-center text-lg tracking-widest"
                            autoFocus
                        />
                        <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" disabled={loading}>
                            {loading ? "Verifying..." : "Unlock"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
