"use client";

import CandidateSidebar from "@/components/candidate/CandidateSidebar";
import RoleGuard from "@/components/common/RoleGuard";
import { ReactNode } from "react";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

function LayoutContent({ children }: { children: ReactNode }) {
    const { isSidebarVisible, toggleSidebar } = useSidebar();

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                data-expanded={isSidebarVisible}
                className={`group relative hidden h-screen shrink-0 border-r border-slate-800 transition-all duration-300 lg:flex lg:flex-col ${isSidebarVisible ? "w-64" : "w-20"}`}
            >
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="cursor-pointer absolute right-2 top-[26px] z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 text-slate-300 shadow-sm backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
                    aria-label={isSidebarVisible ? "Collapse sidebar" : "Expand sidebar"}
                    title={isSidebarVisible ? "Collapse sidebar" : "Expand sidebar"}
                >
                    {isSidebarVisible ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </button>
                <CandidateSidebar />
            </aside>

            <main className="h-screen flex-1 overflow-y-auto min-w-0 p-6">
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
