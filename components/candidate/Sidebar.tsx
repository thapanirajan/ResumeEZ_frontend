"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/landing/Logo";

const menuItems = [
    { name: "Dashboard", href: "/candidate" },
    { name: "Upload Resume & JD", href: "/candidate/upload" },
    { name: "Skill Gap Analysis", href: "/candidate/skill-gap" },
    { name: "Learning Roadmap", href: "/candidate/learning-roadmap" },
    { name: "Resume Builder", href: "/candidate/resume-builder" },
    { name: "Resume Feedback", href: "#" },
    { name: "Resume History", href: "#" },
    { name: "Notifications", href: "#" },
];

export default function Sidebar() {
    const pathname = usePathname(); 

    return (
        <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="flex items-center justify-center h-20 border-b border-gray-200">
                <Logo />
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-6">
                <ul className="flex flex-col space-y-1 px-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`
                    block px-4 py-2 rounded-lg
                    text-gray-700 font-medium
                    hover:bg-blue-50 hover:text-blue-700
                    transition-colors duration-200
                    ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : ""}
                  `}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Optional Footer */}
            <div className="px-4 py-4 border-t border-gray-200 text-sm text-gray-500">
                © 2026 ResumeEZ
            </div>
        </aside>
    );
}
