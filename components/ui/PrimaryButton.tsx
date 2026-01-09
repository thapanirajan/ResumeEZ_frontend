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
            hidden md:flex text-sm
            bg-[#1E3A8A] text-white
            hover:bg-[#1C3480] hover:text-white
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
