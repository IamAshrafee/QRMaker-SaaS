"use client"

import { Toaster } from "react-hot-toast"

export function ToastProvider() {
    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                className: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-lg',
            }}
        />
    )
}
