import Link from "next/link";

type LogoProps = {
    href?: string;
    className?: string;
    sidebarMode?: boolean;
    light?: boolean;
};

export default function Logo({
    href = "/",
    className = "",
    sidebarMode = false,
    light = false,
}: LogoProps) {
    const textClass = sidebarMode
        ? "w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200 group-data-[expanded=true]:w-[8.5rem] group-data-[expanded=true]:opacity-100"
        : "text-2xl";

    return (
        <Link
            className={`flex items-center space-x-2 group cursor-pointer ${className}`}
            href={href}
        >
            {/* Icon */}
            <div className={`h-8 w-8 rounded-md flex items-center justify-center font-bold transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md ${light ? "bg-white text-[#1E3A8A]" : "bg-[#1E3A8A] text-white"}`}>
                R
            </div>

            {/* Logo Text */}
            <span className={`${textClass} font-bold ${light ? "text-white" : "text-[#1E3A8A]"}`}>
                Resume
                <span className={`ml-1 bg-clip-text text-transparent transition-all duration-300 ${light
                    ? "bg-linear-to-r from-blue-300 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-300"
                    : "bg-linear-to-r from-[#2563EB] to-[#1E40AF] group-hover:from-[#1E40AF] group-hover:to-[#2563EB]"
                }`}>
                    EZ
                </span>
            </span>
        </Link>
    );
}
