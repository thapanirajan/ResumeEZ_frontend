"use client"

import React from "react"

interface KpiCardProps {
    label: string
    value: string | number
    sub?: string
    icon: React.ElementType
    iconColor?: string
    iconBg?: string
    className?: string
}

export default function KpiCard({
    label,
    value,
    sub,
    icon: Icon,
    iconColor = "text-slate-400",
    iconBg,
    className = "",
}: KpiCardProps) {
    return (
        <div
            className={`group relative p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all hover:-translate-y-0.5 hover:shadow-md ${className}`}
        >
            {/* Content sits above any decorative layer */}
            <div className="relative z-10">
                {/* Top row: label + icon */}
                <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide leading-snug">
                        {label}
                    </p>

                    {iconBg ? (
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
                        >
                            <Icon className={`w-5 h-5 ${iconColor}`} />
                        </div>
                    ) : (
                        <Icon
                            className={`w-4 h-4 shrink-0 ${iconColor} group-hover:opacity-80 transition`}
                        />
                    )}
                </div>

                {/* Value */}
                <p className="text-3xl font-black text-slate-900 mt-3 leading-none tracking-tight">
                    {value}
                </p>

                {/* Sub-text */}
                {sub && (
                    <p className="text-xs text-slate-400 mt-1.5 leading-snug">{sub}</p>
                )}
            </div>

            {/* Subtle background shimmer on hover — z-0 so it never covers text */}
            <div className="pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-linear-to-br from-slate-50/60 to-transparent" />
        </div>
    )
}
