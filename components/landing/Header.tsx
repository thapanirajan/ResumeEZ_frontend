
// "use client"

// import { useEffect, useState } from "react"
// import Link from "next/link";
// import PrimaryButton from "../ui/PrimaryButton";
// import Logo from "./Logo";
// import { useAuth } from "@/hooks/useAuth";
// import UserDropdown from "../common/UserDropDown";

// // Primary: #0D9488 (Teal)

// // Hover: #0F766E

// // Light background: #ECFEFF


// const menuItems = [
//     { label: 'Features', href: '#features' },
//     { label: 'How It Works', href: '#how-it-works' },
//     { label: 'Testimonials', href: '#testimonials' },
//     { label: 'Pricing', href: '#pricing' },
// ];


// export default function Header() {
//     const [isScrolled, setIsScrolled] = useState(false);
//     const [isSheetOpen, setIsSheetOpen] = useState(false)
//     const { user, loading } = useAuth()

//     useEffect(() => {
//         const handleScroll = () => {
//             setIsScrolled(window.scrollY > 10)
//         };

//         window.addEventListener('scroll', handleScroll);
//         return () => {
//             window.removeEventListener('scroll', handleScroll);
//         }
//     }, [])

//     const closeSheet = () => setIsSheetOpen(false);

//     return (

//         <>
//             <header
//                 className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#f2f7fc] ${isScrolled ? 'bg-[#f2f7fc]/95 shadow-md backdrop-blur-sm' : 'bg-transparent'
//                     }`}>
//                 <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 md:px-6">
//                     <Logo />

//                     <nav className="hidden items-center gap-6 md:flex text-neutral-700 text-shadow-black/10 text-shadow-lg tracking-tight">
//                         {menuItems.map((item) => (
//                             <Link
//                                 key={item.label}
//                                 href={item.href}
//                                 className="font-medium text-slate-600 transition-colors hover:text-blue-600"
//                             >
//                                 {item.label}
//                             </Link>
//                         ))}
//                     </nav>

//                     <div className="hidden md:flex items-center gap-4">
//                         {!loading && !user && (
//                             <PrimaryButton href="/login">Login</PrimaryButton>
//                         )}

//                         {!loading && user && <UserDropdown />}
//                     </div>


//                     {/* Mobile Hamburger */}
//                     <button
//                         onClick={() => setIsSheetOpen(true)}
//                         className="md:hidden flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition"
//                     >
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="h-7 w-7"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                         >
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//                         </svg>
//                     </button>

//                 </div>


//             </header>


//             {/* Mobile Menu Sheet */}
//             <div
//                 className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 md:hidden ${isSheetOpen ? "translate-x-0" : "translate-x-full"
//                     }`}
//             >
//                 <div className="flex items-center justify-between p-4 border-b">
//                     <button onClick={closeSheet}>
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="h-6 w-6"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                         >
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                     </button>
//                 </div>

//                 <nav className="flex flex-col p-4 gap-4">
//                     {menuItems.map((item) => (
//                         <Link
//                             key={item.label}
//                             href={item.href}
//                             onClick={closeSheet}
//                             className="text-base font-medium text-gray-700 hover:text-blue-600"
//                         >
//                             {item.label}
//                         </Link>
//                     ))}

//                     <div className="flex items-center gap-4">
//                         {!loading && !user && (
//                             <PrimaryButton href="/login">Login</PrimaryButton>
//                         )}

//                         {!loading && user && <UserDropdown />}
//                     </div>
//                 </nav>
//             </div>

//         </>
//     )
// }

"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";

const navItems = [
    { label: "Features", href: "#features" },
    { label: "Resume Builder", href: "/resume-builder" },
    { label: "Jobs", href: "/job" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-primary/10 bg-white/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Logo />

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