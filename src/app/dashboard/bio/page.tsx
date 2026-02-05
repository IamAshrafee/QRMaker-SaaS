import QRCodesPage from "@/app/dashboard/qrcodes/page";

// Reusing same layout for now, would customizer for Bio specific features later
export default function BioLinksPage() {
    return (
        <div className="space-y-6">
            <div className="px-1 py-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900 rounded-lg text-yellow-800 dark:text-yellow-200 text-sm flex items-center justify-center">
                Work in Progress: Bio Link Specific Manager
            </div>
            <QRCodesPage />
        </div>
    )
}
