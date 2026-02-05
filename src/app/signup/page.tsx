"use client"

import { AuthLayout } from "@/components/auth/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useFormState, useFormStatus } from "react-dom"
import { registerUser } from "@/actions/register"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            className="w-full bg-glorious-gradient text-white shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-opacity"
            disabled={pending}
        >
            {pending ? "Creating Account..." : "Create Account"}
        </Button>
    )
}

export default function SignupPage() {
    const [state, dispatch] = useFormState(registerUser, undefined)
    const router = useRouter()

    useEffect(() => {
        // If success, we could redirect to login or dashboard
        // Note: Current action returns { success: string } on success
        if (state?.success) {
            router.push('/login?message=Account created! Please log in.')
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
                    <Input name="name" id="name" placeholder="John Doe" required className="bg-white/50 dark:bg-slate-950/50" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" id="email" type="email" placeholder="name@example.com" required className="bg-white/50 dark:bg-slate-950/50" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input name="password" id="password" type="password" required className="bg-white/50 dark:bg-slate-950/50" />
                </div>

                {state?.error && (
                    <div className="text-sm text-red-500 font-medium">
                        {typeof state.error === 'string' ? state.error : "Please check your inputs."}
                    </div>
                )}

                <SubmitButton />
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
