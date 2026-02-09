"use client";

import CandidateSidebar from "@/components/candidate/CandidateSidebar";
import RoleGuard from "@/components/common/RoleGuard";
import { ReactNode } from "react";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

function LayoutContent({ children }: { children: ReactNode }) {
    const { isSidebarVisible } = useSidebar();

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar - fixed on left */}
            {isSidebarVisible && (
                <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 fixed h-screen z-20">
                    <CandidateSidebar />
                </aside>
            )}

            {/* Main Content - add margin-left same as sidebar width */}
            <main className={`flex-1 ${isSidebarVisible ? 'p-6 ml-0 lg:ml-64' : 'p-0'} overflow-y-auto h-screen`}>
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
