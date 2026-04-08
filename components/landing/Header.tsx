"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";
import { useAuth } from "@/hooks/useAuth";
import UserDropdown from "@/components/common/UserDropDown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, loading } = useAuth();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-lg shadow-sm shadow-slate-900/5">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Logo />

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-2">
                    {loading ? (
                        <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
                    ) : user ? (
                        <UserDropdown />
                    ) : (
                        <>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/login">Sign In</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/login">Get Started →</Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    className={cn(
                        "md:hidden p-2 rounded-lg transition-colors",
                        isOpen ? "bg-primary/10 text-primary" : "hover:bg-slate-100 text-slate-700"
                    )}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-lg px-6 py-4 flex flex-col gap-3 shadow-lg">
                    {user ? (
                        <div onClick={() => setIsOpen(false)}>
                            <UserDropdown />
                        </div>
                    ) : (
                        <>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                            </Button>
                            <Button className="w-full" asChild>
                                <Link href="/login" onClick={() => setIsOpen(false)}>Get Started</Link>
                            </Button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
