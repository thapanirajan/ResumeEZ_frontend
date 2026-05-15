"use client";

import RoleGuard from "@/components/common/RoleGuard";
import RecruiterSidebar from "@/components/Recruiter/RecruiterSidebar";
import MobileNavDrawer from "@/components/common/MobileNavDrawer";
import { ReactNode, useEffect, useState } from "react";
import { Pin, PinOff, Menu } from "lucide-react";
import Logo from "@/components/landing/Logo";

export default function HrLayout({ children }: { children: ReactNode }) {
    const [isPinned, setIsPinned] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("recruiter-sidebar-pinned");
        if (stored === "true") setIsPinned(true);
    }, []);

    const togglePin = () => {
        setIsPinned((prev) => {
            const next = !prev;
            localStorage.setItem("recruiter-sidebar-pinned", String(next));
            return next;
        });
    };

    const isExpanded = isPinned || isHovered;

    return (
        <RoleGuard role="RECRUITER">
            <div className="flex min-h-screen bg-slate-50/60">
                {/* ── Mobile top bar ── */}
                <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
                    <Logo href="/" />
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        aria-label="Open navigation menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </header>

                {/* ── Mobile nav drawer ── */}
                <MobileNavDrawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
                    <div data-expanded="true" className="group h-full bg-white">
                        <RecruiterSidebar />
                    </div>
                </MobileNavDrawer>

                {/* ── Desktop sidebar ── */}
                <aside
                    data-expanded={isExpanded}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`group relative hidden h-screen shrink-0 border-r border-slate-100 bg-white shadow-sm transition-all duration-300 lg:flex lg:flex-col ${isExpanded ? "w-64" : "w-20"}`}
                >
                    <button
                        type="button"
                        onClick={togglePin}
                        className="absolute right-2 top-[26px] z-10 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-800"
                        aria-label={isPinned ? "Unpin sidebar" : "Pin sidebar"}
                        title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
                    >
                        {isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                    </button>
                    <RecruiterSidebar />
                </aside>

                {/* ── Main content ── */}
                <main className="flex-1 overflow-y-auto p-6 pt-20 min-w-0 lg:h-screen lg:pt-6">
                    {children}
                </main>
            </div>
        </RoleGuard>
    );
}
