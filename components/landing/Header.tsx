
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";
import { toast } from "sonner";

const navItems = [
    { label: "Home", href: "/" },
    { label: "Resume Builder", href: "/resume-builder" },
    { label: "Jobs", href: "/job" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-primary/10 bg-white/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Logo />
                <button
                    onClick={() => {
                        toast.success("Toast applied")
                    }}>
                    Trigger toast
                </button>
                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map(({ label, href }) => (
                        <Link key={label} href={href} className="text-sm text-primary font-medium hover:text-primary/70 transition-colors">
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/login" className="text-sm text-primary font-semibold px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                        Sign In
                    </Link>
                    <Link href="/login" className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:bg-primary/90 transition-all">
                        Get Started
                    </Link>
                </div>

                {/* Hamburger */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={22} className="text-slate-700" /> : <Menu size={22} className="text-slate-700" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 flex flex-col gap-3">
                    {navItems.map(({ label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            className="text-sm font-medium text-slate-700 hover:text-primary py-2 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {label}
                        </Link>
                    ))}
                    <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                        <Link href="/login" className="w-full text-center text-sm text-primary font-semibold px-4 py-2.5 rounded-lg border border-primary/20 hover:bg-primary/5 transition-colors">
                            Sign In
                        </Link>
                        <Link href="/login" className="w-full text-center bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-md hover:bg-primary/90 transition-all">
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}