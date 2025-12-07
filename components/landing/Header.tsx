
"use client"

import { useEffect, useState } from "react"
import { Logo } from "./Logo";
import Link from "next/link";


const menuItems = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [])

    const closeSheet = () => setIsSheetOpen(false);

    return (

        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#f2f7fc] ${isScrolled ? 'bg-[#f2f7fc]/95 shadow-md backdrop-blur-sm' : 'bg-transparent'
                    }`}>
                <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 md:px-6">
                    <Logo />

                    <nav className="hidden items-center gap-6 md:flex">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>


                    <div className="hidden items-center gap-4 md:flex">
                        <Link href="/login" className=" hidden md:flex text-sm text-black hover:bg-emerald-400 px-3.5 py-2 rounded cursor-pointer transition-all duration-300 ease-in-out">
                            Login
                        </Link>
                        <button className="hidden md:flex bg-blue-600 text-white text-sm font-bold px-4 py-2.5 rounded-[7px] hover:bg-blue-500 transition-colors duration-300 ease-in-out cursor-pointer">Get Started</button>
                    </div>


                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setIsSheetOpen(true)}
                        className="md:hidden flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                </div>


            </header>


            {/* Mobile Menu Sheet */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 md:hidden ${isSheetOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <button onClick={closeSheet}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex flex-col p-4 gap-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={closeSheet}
                            className="text-base font-medium text-gray-700 hover:text-blue-600"
                        >
                            {item.label}
                        </Link>
                    ))}

                    <button className="mt-4 text-sm border px-4 py-2 rounded hover:bg-gray-100">
                        Login
                    </button>
                    <button className="mt-2 bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-500">
                        Get Started
                    </button>
                </nav>
            </div>

        </>
    )
}