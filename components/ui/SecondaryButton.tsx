import Link from "next/link";
import { ReactNode } from "react";

interface SecondaryButtonProps {
    href: string;
    children: ReactNode;
    className?: string;
}

export default function SecondaryButton({
    href,
    children,
    className = "",
}: SecondaryButtonProps) {
    return (
        <Link
            href={href}
            className={`
            hidden md:flex text-sm
            bg-white text-[#1F2937]
            border border-[#1F2937]
            hover:bg-[#1F2937] hover:text-white
            font-bold px-6 py-2.5 rounded
            cursor-pointer
            transition-all duration-300 ease-in-out
            ${className}
        `}
        >
            {children}
        </Link>
    );
}
