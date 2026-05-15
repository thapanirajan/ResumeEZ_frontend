"use client";

import CandidateSidebar from "@/components/candidate/CandidateSidebar";
import RoleGuard from "@/components/common/RoleGuard";
import MobileNavDrawer from "@/components/common/MobileNavDrawer";
import { ReactNode, useState } from "react";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { Pin, PinOff, Menu } from "lucide-react";
import Logo from "@/components/landing/Logo";

function LayoutContent({ children }: { children: ReactNode }) {
    const { isExpanded, isPinned, togglePin, setHovered } = useSidebar();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
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
                {/* force labels visible by setting data-expanded=true */}
                <div data-expanded="true" className="group h-full bg-white">
                    <CandidateSidebar />
                </div>
            </MobileNavDrawer>

            {/* ── Desktop sidebar ── */}
            <aside
                data-expanded={isExpanded}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={`group relative hidden h-screen shrink-0 border-r border-slate-800 transition-all duration-300 lg:flex lg:flex-col ${isExpanded ? "w-64" : "w-20"}`}
            >
                <button
                    type="button"
                    onClick={togglePin}
                    className="absolute right-2 top-[26px] z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 text-slate-300 shadow-sm backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
                    aria-label={isPinned ? "Unpin sidebar" : "Pin sidebar"}
                    title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
                >
                    {isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                </button>
                <CandidateSidebar />
            </aside>

            {/* ── Main content ── */}
            <main className="flex-1 overflow-y-auto min-w-0 p-6 pt-20 lg:h-screen lg:pt-6">
                {children}
            </main>
        </div>
    );
}

export default function CandidateLayout({ children }: { children: ReactNode }) {
    return (
        <RoleGuard role="JOB_SEEKER">
            <SidebarProvider>
                <LayoutContent>{children}</LayoutContent>
            </SidebarProvider>
        </RoleGuard>
    );
}
