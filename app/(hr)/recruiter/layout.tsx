import RoleGuard from "@/components/common/RoleGuard";
import RecruiterSidebar from "@/components/Recruiter/RecruiterSidebar";
import { ReactNode } from "react";

export default function HrLayout({ children }: { children: ReactNode }) {
    return (
        <RoleGuard role="RECRUITER">
            <div className="flex min-h-screen bg-gray-50">
                {/* Sidebar - expands on hover but stays in layout flow (no overlay) */}
                <aside className="group hidden h-screen w-20 shrink-0 border-r border-gray-200 bg-white transition-all duration-300 hover:w-64 lg:flex lg:flex-col">
                    <RecruiterSidebar />
                </aside>

                <main className="h-screen flex-1 overflow-y-auto p-6 min-w-0">
                    {children}
                </main>
            </div>
        </RoleGuard>
    );
}
