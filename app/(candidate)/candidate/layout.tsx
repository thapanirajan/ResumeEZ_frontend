"use client";

import CandidateSidebar from "@/components/candidate/CandidateSidebar";
import RoleGuard from "@/components/common/RoleGuard";
import { ReactNode } from "react";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

function LayoutContent({ children }: { children: ReactNode }) {
    const { isSidebarVisible } = useSidebar();

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar - expands on hover but stays in layout flow (no overlay) */}
            {isSidebarVisible && (
                <aside className="group hidden h-screen w-20 shrink-0 border-r border-gray-200 bg-white transition-all duration-300 hover:w-64 lg:flex lg:flex-col">
                    <CandidateSidebar />
                </aside>
            )}

            <main className={`h-screen flex-1 overflow-y-auto min-w-0 ${isSidebarVisible ? "p-6" : "p-0"}`}>
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
