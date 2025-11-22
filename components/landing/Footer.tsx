import Link from 'next/link';
import { Logo } from './Logo';

const footerColumns = [
    {
        heading: 'Product',
        links: [
            { label: 'Features', href: '#features' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'Demo', href: '#' },
            { label: 'FAQ', href: '#' },
        ],
    },
    {
        heading: 'Users',
        links: [
            { label: 'Candidates', href: '#' },
            { label: 'HR Teams', href: '#' },
            { label: 'Support', href: '#' },
        ],
    },
    {
        heading: 'Company',
        links: [
            { label: 'About', href: '#' },
            { label: 'Contact', href: '#' },
            { label: 'Careers', href: '#' },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="bg-white">
            <div className="max-w-7xl mx-auto px-4 py-12 md:px-6 md:py-16">
                <div className="grid gap-12 lg:grid-cols-4">
                    <div className="lg:col-span-1">
                        <Logo />
                        <p className="mt-4 text-sm text-muted-foreground">
                            AI-powered resume optimization and candidate screening.
                        </p>
                    </div>
                    <div className="grid gap-8 sm:grid-cols-3 lg:col-span-3">
                        {footerColumns.map((column) => (
                            <div key={column.heading}>
                                <h3 className="font-headline text-sm font-semibold tracking-wider uppercase text-foreground">
                                    {column.heading}
                                </h3>
                                <ul className="mt-4 space-y-3">
                                    {column.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                {/* <div className="text-center text-sm text-muted-foreground border-t">
                    <p>© {new Date().getFullYear()} ResumeEZ. All Rights Reserved.</p>
                </div> */}
            </div>
        </footer>
    );
}
