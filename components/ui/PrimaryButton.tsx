import Link from "next/link";
import { ReactNode } from "react";

interface PrimaryButtonProps {
    href: string;
    children: ReactNode;
    className?: string;
}


export default function PrimaryButton({
    href,
    children,
    className = "",
}: PrimaryButtonProps) {
    return (
        <Link
            href={href}
            className={`
            relative group overflow-hidden hidden md:flex text-sm
            bg-[#1E3A8A] text-white
            font-bold px-6 py-2.5 rounded
            cursor-pointer
            transition-all duration-300 ease-in-out
            hover:bg-[#1C3480]
            ${className}
            `}
        >
            {/* Shine effect */}
            <span
                className="
                absolute top-0 -left-full w-full h-full
                bg-linear-to-r from-transparent via-white/40 to-transparent
                transform skew-x-[-20deg]
                transition-all duration-500
                pointer-events-none
                group-hover:left-full
                "
            />

            {/* Button content */}
            <span className="relative z-10">{children}</span>
        </Link>
    );
}
