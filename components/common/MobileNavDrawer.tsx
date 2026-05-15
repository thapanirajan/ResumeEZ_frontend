"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { usePathname } from "next/navigation"

type Props = {
    open: boolean
    onClose: () => void
    children: React.ReactNode
}

export default function MobileNavDrawer({ open, onClose, children }: Props) {
    const pathname = usePathname()

    // Auto-close when the user navigates to a new page
    useEffect(() => {
        onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname])

    // Lock body scroll while the drawer is open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [open])

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
                    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Slide-in panel */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
            >
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 z-10 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    aria-label="Close navigation"
                >
                    <X className="h-5 w-5" />
                </button>
                <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
        </>
    )
}
