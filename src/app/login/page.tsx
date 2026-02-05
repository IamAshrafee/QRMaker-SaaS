"use client"

import { AuthLayout } from "@/components/auth/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useFormState, useFormStatus } from "react-dom"
import { authenticate } from "@/actions/login"

function LoginButton() {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            className="w-full bg-glorious-gradient text-white shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-opacity"
            disabled={pending}
        >
            {pending ? "Signing in..." : "Sign In"}
        </Button>
    )
}

export default function LoginPage() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined)

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Enter your credentials to access your account"
        >
            <form action={dispatch} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" id="email" type="email" placeholder="name@example.com" required className="bg-white/50 dark:bg-slate-950/50" />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="#" className="text-xs text-indigo-500 hover:text-indigo-400">Forgot password?</Link>
                    </div>
                    <Input name="password" id="password" type="password" required className="bg-white/50 dark:bg-slate-950/50" />
                </div>

                <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {errorMessage && (
                        <p className="text-sm text-red-500 font-medium">
                            {errorMessage}
                        </p>
                    )}
                </div>

                <LoginButton />
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-muted-foreground backdrop-blur-sm bg-slate-50/50 dark:bg-slate-950/50">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full bg-white/50 dark:bg-slate-950/50">
                    Github
                </Button>
                <Button variant="outline" className="w-full bg-white/50 dark:bg-slate-950/50">
                    Google
                </Button>
            </div>

            <div className="mt-6 text-center text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="font-semibold text-indigo-500 hover:text-indigo-400">
                    Sign up
                </Link>
            </div>
        </AuthLayout>
    )
}
