"use client";

import RoleGuard from "@/components/common/RoleGuard";
import RecruiterSidebar from "@/components/Recruiter/RecruiterSidebar";
import { ReactNode, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HrLayout({ children }: { children: ReactNode }) {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    return (
        <RoleGuard role="RECRUITER">
            <div className="flex min-h-screen bg-gray-50">
                {/* Sidebar - expands/collapses on arrow click */}
                <aside
                    data-expanded={isSidebarVisible}
                    className={`group relative hidden h-screen shrink-0 border-r border-gray-200 bg-white transition-all duration-300 lg:flex lg:flex-col ${isSidebarVisible ? "w-64" : "w-20"}`}
                >
                    <button
                        type="button"
                        onClick={() => setIsSidebarVisible((prev) => !prev)}
                        className="absolute right-2 top-[26px] z-10 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-800"
                        aria-label={isSidebarVisible ? "Collapse sidebar" : "Expand sidebar"}
                        title={isSidebarVisible ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {isSidebarVisible ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    </button>
                    <RecruiterSidebar />
                </aside>

                <main className="h-screen flex-1 overflow-y-auto p-6 min-w-0">
                    {children}
                </main>
            </div>
        </RoleGuard>
    );
}
