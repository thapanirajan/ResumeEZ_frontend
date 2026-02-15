import Link from "next/link";

type LogoProps = {
    href?: string;
    className?: string;
    sidebarMode?: boolean;
};

export default function Logo({
    href = "/",
    className = "",
    sidebarMode = false,
}: LogoProps) {
    const textClass = sidebarMode
        ? "w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200 group-hover:w-[8.5rem] group-hover:opacity-100"
        : "text-2xl";

    return (
        <Link
            className={`flex items-center space-x-2 group cursor-pointer ${className}`}
            href={href}
        >
            {/* Icon */}
            <div className="h-8 w-8 bg-[#1E3A8A] rounded-md flex items-center justify-center text-white font-bold transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                R
            </div>

            {/* Logo Text */}
            <span className={`${textClass} font-bold text-[#1E3A8A]`}>
                Resume
                <span className="ml-1 bg-clip-text text-transparent bg-linear-to-r from-[#2563EB] to-[#1E40AF] 
                group-hover:from-[#1E40AF] group-hover:to-[#2563EB] transition-all duration-300">
                    EZ
                </span>
            </span>
        </Link>

    );
}
