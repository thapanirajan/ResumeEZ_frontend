"use client"

import { X } from "lucide-react"
import { useEffect } from "react"
import JobFilter from "./JobFilters"

type Props = {
    open: boolean
    onClose: () => void
}

export default function MobileFilterDrawer({ open, onClose }: Props) {
    // Lock body scroll when drawer is open
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

            {/* Drawer panel */}
            <div
                className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
                role="dialog"
                aria-modal="true"
                aria-label="Job filters"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                    <h2 className="text-base font-bold text-slate-900">Filters</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        aria-label="Close filters"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Scrollable filter content */}
                <div className="flex-1 overflow-y-auto px-5 py-5">
                    <JobFilter onApply={onClose} />
                </div>
            </div>
        </>
    )
}
