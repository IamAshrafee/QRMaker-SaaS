import Link from "next/link"

export function Footer() {
    return (
        <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8 text-sm">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <div className="w-6 h-6 rounded bg-indigo-500" />
                        QRMaker
                    </div>
                    <p className="text-muted-foreground">The ultimate SaaS for dynamic connections.</p>
                </div>

                <div>
                    <h4 className="font-bold mb-4">Product</h4>
                    <ul className="space-y-2 text-muted-foreground">
                        <li><Link href="#">Features</Link></li>
                        <li><Link href="#">Pricing</Link></li>
                        <li><Link href="#">Showcase</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-4">Company</h4>
                    <ul className="space-y-2 text-muted-foreground">
                        <li><Link href="#">About</Link></li>
                        <li><Link href="#">Contact</Link></li>
                        <li><Link href="#">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-4">Legal</h4>
                    <p className="text-muted-foreground">© 2026 QRMaker SaaS. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
