"use client"

import { AuthLayout } from "@/components/auth/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { registerUser } from "@/actions/register"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { checkUsername } from "@/actions/username"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

function SubmitButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            className="w-full bg-glorious-gradient text-white shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-opacity"
            disabled={pending || disabled}
        >
            {pending ? "Creating Account..." : "Create Account"}
        </Button>
    )
}

export default function SignupPage() {
    const [state, dispatch, isPending] = useActionState(registerUser, undefined)
    const router = useRouter()

    // Username check state
    const [checkingUsername, setCheckingUsername] = useState(false)
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
    const [usernameError, setUsernameError] = useState("")

    async function handleUsernameCheck(username: string) {
        if (!username || username.length < 3) {
            setUsernameAvailable(null)
            return
        }
        setCheckingUsername(true)
        setUsernameError("")
        const res = await checkUsername(username)
        setCheckingUsername(false)
        if (res.available) {
            setUsernameAvailable(true)
        } else {
            setUsernameAvailable(false)
            setUsernameError(res.error || "Username taken")
        }
    }

    useEffect(() => {
        if (state?.success) {
            toast.success(state.success)
            router.push('/login')
        }
        if (state?.error) {
            const msg = typeof state.error === 'string' ? state.error : "Please check your inputs."
            toast.error(msg)
        }
    }, [state, router])

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Get started with your free account today"
        >
            <form action={dispatch} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        required
                        className="bg-white/50 dark:bg-slate-950/50"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                        <Input
                            id="username"
                            name="username"
                            placeholder="johndoe"
                            required
                            className={`bg-white/50 dark:bg-slate-950/50 pr-10 ${usernameAvailable === false ? "border-red-500 focus:border-red-500" :
                                    usernameAvailable === true ? "border-green-500 focus:border-green-500" : ""
                                }`}
                            onBlur={(e) => handleUsernameCheck(e.target.value)}
                        />
                        {checkingUsername && <Loader2 className="absolute right-3 top-2.5 h-5 w-5 animate-spin text-muted-foreground" />}
                        {usernameAvailable === true && !checkingUsername && <CheckCircle2 className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />}
                        {usernameAvailable === false && !checkingUsername && <XCircle className="absolute right-3 top-2.5 h-5 w-5 text-red-500" />}
                    </div>
                    {usernameError && <p className="text-xs text-red-500 font-medium mt-1">{usernameError}</p>}
                    <p className="text-xs text-muted-foreground mt-1">This will be your unique URL: qrmaker.saas/{usernameAvailable === true ? <span className="text-emerald-500 font-semibold">{document.getElementById('username')?.getAttribute('value') || 'username'}</span> : '{username}'}</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        className="bg-white/50 dark:bg-slate-950/50"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="bg-white/50 dark:bg-slate-950/50"
                    />
                </div>

                <div className="pt-2">
                    <SubmitButton disabled={usernameAvailable === false} />
                </div>
            </form>

            <div className="mt-6 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-indigo-500 hover:text-indigo-400">
                    Sign in
                </Link>
            </div>
        </AuthLayout>
    )
}
