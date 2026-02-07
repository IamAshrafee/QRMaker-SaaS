import React from "react"
import { cn } from "@/lib/utils"

interface PhoneMockupProps {
    children: React.ReactNode
    className?: string
    statusBar?: boolean
}

export function PhoneMockup({ children, className, statusBar = true }: PhoneMockupProps) {
    return (
        <div className={cn("relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl", className)}>
            {/* Haptic Button Triggers (Pure CSS visuals) */}
            <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
            <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>

            {/* Inner Display */}
            <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white dark:bg-slate-950 relative">

                {/* Dynamic Island / Notch */}
                {statusBar && (
                    <div className="flex justify-between items-center px-6 pt-3 pb-2 text-[10px] font-medium text-black dark:text-white absolute w-full z-10 top-0 left-0 bg-transparent">
                        <span>9:41</span>
                        <div className="w-20 h-5 bg-black rounded-full absolute left-1/2 transform -translate-x-1/2 top-2"></div>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 bg-current rounded-full opacity-20"></div> {/* Signal */}
                            <div className="w-3 h-3 bg-current rounded-full opacity-20"></div> {/* WiFi */}
                            <div className="w-4 h-2.5 border border-current rounded-[2px]"></div> {/* Battery */}
                        </div>
                    </div>
                )}

                {/* Main Content Area - Scrollable */}
                <div className="h-full w-full overflow-y-auto no-scrollbar pt-8 pb-4">
                    {children}
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gray-300 dark:bg-gray-600 rounded-full opacity-50"></div>
            </div>
        </div>
    )
}
