"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ScanSearch,
    Route,
    FileText,
    Settings,
} from "lucide-react";
import Logo from "../landing/Logo";

const menuItems = [
    { name: "Dashboard", href: "/candidate", icon: LayoutDashboard },
    { name: "Browse Jobs", href: "/candidate/job", icon: LayoutDashboard },
    { name: "Resume Builder", href: "/candidate/resume", icon: FileText },
    { name: "Skill Gap Analysis", href: "/candidate/upload", icon: ScanSearch },
    { name: "Learning Roadmap", href: "/candidate/learning-roadmap", icon: Route },
    { name: "Profile & Settings", href: "/candidate/profile", icon: Settings },
];

export default function CandidateSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-full flex-col">
            <div className="flex h-20 items-center border-b border-gray-200 px-3">
                <Logo href="/" sidebarMode className="w-full" />
            </div>

            <nav className="flex-1 overflow-y-auto py-6">
                <ul className="flex flex-col gap-2 px-3">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.href === "/"
                            ? pathname === "/"
                            : pathname === item.href ||
                            (item.href !== "/candidate" && pathname.startsWith(item.href));

                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center rounded-xl p-3 transition-colors ${isActive
                                            ? "bg-blue-100 text-blue-700"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                        }`}
                                    title={item.name}
                                    aria-label={item.name}
                                >
                                    <Icon className="h-5 w-5 shrink-0" />
                                    <span className="ml-3 w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-200 group-hover:w-40 group-hover:opacity-100">
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="border-t border-gray-200 px-3 py-4 text-[11px] text-slate-500">
                <span className="block text-center group-hover:hidden">2026</span>
                <span className="hidden text-center group-hover:block">
                    Copyright 2026 ResumeEZ
                </span>
            </div>
        </div>
    );
}
