import Link from "next/link";


export default function Logo() {
    return (
        <Link className="flex items-center space-x-2 group cursor-pointer"
            href="/">
            {/* Icon */}
            <div className="h-8 w-8 bg-[#1E3A8A] rounded-md flex items-center justify-center text-white font-bold transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                R
            </div>

            {/* Logo Text */}
            <span className="text-2xl font-bold text-[#1E3A8A]">
                Resume
                <span className="ml-1 bg-clip-text text-transparent bg-linear-to-r from-[#2563EB] to-[#1E40AF] 
                group-hover:from-[#1E40AF] group-hover:to-[#2563EB] transition-all duration-300">
                    EZ
                </span>
            </span>
        </Link>

    );
}
