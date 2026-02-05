"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
    {
        name: "Starter",
        price: "0",
        description: "For individuals",
        features: ["5 QR Codes", "1 Bio Page", "Basic Analytics", "Standard Support"],
        highlight: false,
        cta: "Start Free"
    },
    {
        name: "Pro",
        price: "19",
        description: "For businesses",
        features: ["50 QR Codes", "10 Bio Pages", "Advanced Analytics", "Retargeting Pixels", "No Ads"],
        highlight: true,
        cta: "Get Pro"
    },
    {
        name: "Agency",
        price: "49",
        description: "For power users",
        features: ["Unlimited QRs", "United Bio Pages", "Team Members", "White Label", "API Access"],
        highlight: false,
        cta: "Contact Us"
    }
]

export function Pricing() {
    return (
        <section id="pricing" className="py-24">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
                    <p className="text-muted-foreground">Start for free, upgrade when you grow.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`relative rounded-2xl p-8 border ${plan.highlight
                                    ? "border-indigo-500 bg-slate-900/5 dark:bg-slate-900 shadow-2xl shadow-indigo-500/10 scale-105 z-10"
                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-bold">${plan.price}</span>
                                <span className="text-muted-foreground ml-2">/mo</span>
                            </div>

                            <div className="space-y-4 mb-8">
                                {plan.features.map((feature, f) => (
                                    <div key={f} className="flex items-center text-sm">
                                        <Check className="w-4 h-4 text-emerald-500 mr-2" />
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <Button
                                className={`w-full ${plan.highlight ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white"}`}
                            >
                                {plan.cta}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
