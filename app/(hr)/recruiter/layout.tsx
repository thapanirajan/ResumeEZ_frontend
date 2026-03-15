"use client";

import RoleGuard from "@/components/common/RoleGuard";
import RecruiterSidebar from "@/components/Recruiter/RecruiterSidebar";
import { ReactNode, useEffect, useState } from "react";
import { Pin, PinOff } from "lucide-react";

export default function HrLayout({ children }: { children: ReactNode }) {
    const [isPinned, setIsPinned] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

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
            <div className="flex min-h-screen bg-gray-50">
                <aside
                    data-expanded={isExpanded}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`group relative hidden h-screen shrink-0 border-r border-gray-200 bg-white transition-all duration-300 lg:flex lg:flex-col ${isExpanded ? "w-64" : "w-20"}`}
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

                <main className="h-screen flex-1 overflow-y-auto p-6 min-w-0">
                    {children}
                </main>
            </div>
        </RoleGuard>
    );
}
