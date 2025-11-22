import Link from 'next/link';

export function Logo() {
    return (
        <Link href="/" className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
            className="h-6 w-6 ">
                {/* Document */}
                <rect x="5" y="3" width="14" height="18" rx="2" />
                {/* Text lines */}
                <line x1="7" y1="7" x2="17" y2="7" />
                <line x1="7" y1="11" x2="17" y2="11" />
                <line x1="7" y1="15" x2="13" y2="15" />
                {/* Checkmark */}
                <polyline points="9 18 11 20 15 16" />
            </svg>

            <span className="text-xl font-headline font-bold text-foreground">ResumeEZ</span>
        </Link>
    );
}
