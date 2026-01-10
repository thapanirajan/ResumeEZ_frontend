"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { handleLogout } from "@/lib/auth.lib";

export default function UserDropdown() {
    const { user } = useAuth();
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

    if (!user) return null;

    const dashboardPath =
        user.role === "RECRUITER" ? "/recruiter" : "/candidate";

    const emailPrefix = user.email.split("@")[0];
    const initials = emailPrefix.slice(0, 1).toUpperCase();

    return (
        <div ref={ref} className="relative">
            {/* Trigger */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-3 px-2 py-1.5 rounded-full hover:bg-gray-100 transition"
            >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-sm font-semibold">
                    {initials}
                </div>

                {/* Name */}
                <div className="hidden lg:flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-800 leading-tight">
                        {emailPrefix}
                    </span>
                    <span className="text-xs text-gray-500">
                        {user.role === "RECRUITER" ? "Recruiter" : "Candidate"}
                    </span>
                </div>

                {/* Chevron */}
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""
                        }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-3 w-56 bg-[#f2f7fc] rounded-xl shadow-lg border border-gray-500 z-50 overflow-hidden">
                    {/* User info */}
                    <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {user.email}
                        </p>
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            {user.role === "RECRUITER" ? "Recruiter" : "Candidate"}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="py-1">
                        <Link
                            href={dashboardPath}
                            onClick={() => setOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            📊 Dashboard
                        </Link>

                        <Link
                            href="/"
                            onClick={() => setOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            👤 Profile
                        </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
