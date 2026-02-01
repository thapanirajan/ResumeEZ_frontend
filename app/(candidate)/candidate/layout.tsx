import CandidateSidebar from "@/components/candidate/CandidateSidebar";
import RoleGuard from "@/components/common/RoleGuard";
import { ReactNode } from "react";

export default function HrLayout({ children }: { children: ReactNode }) {
    return (
        <RoleGuard role="JOB_SEEKER">
            <div className="flex min-h-screen bg-gray-50">
                {/* Sidebar - fixed on left */}
                <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 fixed h-screen">
                    <CandidateSidebar />
                </aside>

                {/* Main Content - add margin-left same as sidebar width */}
                <main className="flex-1 p-6 ml-0 lg:ml-64 overflow-y-auto h-screen">
                    {children}
                </main>
            </div>
        </RoleGuard>
    );
}
