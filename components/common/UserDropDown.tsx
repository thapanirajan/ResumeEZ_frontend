"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { handleLogout } from "@/lib/auth.lib";

export default function UserDropdown() {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading) {
        return <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />;
    }

    if (!user) return null;

    const dashboardPath = user.role === "RECRUITER" ? "/recruiter" : "/candidate";
    const profilePath = user.role === "RECRUITER" ? "/recruiter/profile" : "/candidate/profile";
    const isOnDashboardArea = pathname.startsWith(dashboardPath);
    const isOnLandingPage = pathname === "/";

    const emailPrefix = user.email.split("@")[0];
    const initials = emailPrefix.slice(0, 1).toUpperCase();

    return (
        <div ref={ref} className="relative cursor-pointer">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-3 rounded-full border border-transparent px-2 py-1.5 transition hover:border-slate-200 hover:bg-white"
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E3A8A] text-sm font-semibold text-white">
                    {initials}
                </div>

                <div className="hidden flex-col items-start lg:flex">
                    <span className="text-sm font-medium leading-tight text-gray-800">
                        {emailPrefix}
                    </span>
                    <span className="text-xs text-gray-500">
                        {user.role === "RECRUITER" ? "Recruiter" : "Candidate"}
                    </span>
                </div>

                <svg
                    className={`h-4 w-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-100 px-4 py-3">
                        <p className="truncate text-sm font-medium text-gray-900">
                            {user.email}
                        </p>
                        <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                            {user.role === "RECRUITER" ? "Recruiter" : "Candidate"}
                        </span>
                    </div>

                    <div className="p-2">
                        {!isOnDashboardArea && (
                            <Link
                                href={dashboardPath}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard Home
                            </Link>
                        )}

                        {!isOnLandingPage && (
                            <Link
                                href="/"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                            >
                                <Home className="h-4 w-4" />
                                Landing Page
                            </Link>
                        )}

                        <Link
                            href={profilePath}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            <User className="h-4 w-4" />
                            Profile
                        </Link>
                    </div>

                    <div className="border-t border-slate-100 p-2">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
