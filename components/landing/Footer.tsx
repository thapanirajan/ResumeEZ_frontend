import Link from "next/link";
import Logo from "./Logo";

const platformLinks = [
    { name: "Resume Builder", path: "/resume-builder" },
    { name: "Skill Analysis", path: "/skill-analysis" },
    { name: "Recruiter Tools", path: "/recruiter-tools" },
    { name: "Job Search", path: "/job-search" },
];

const companyLinks = [
    { name: "About Us", path: "/" },
    { name: "Pricing", path: "/" },
    { name: "Terms of Service", path: "/" },
    { name: "Privacy Policy", path: "/" },
];

export default function Footer() {
    return (
        <footer className="py-12 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">

                    {/* Brand */}
                    <div className="col-span-2">
                        <div className="mb-4">
                            <Logo />
                        </div>
                        <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                            The world&apos;s most advanced AI-powered recruitment platform
                            designed to bring transparency and efficiency to the hiring process.
                        </p>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-slate-400">
                            Platform
                        </h4>
                        <ul className="space-y-3 text-sm font-medium text-slate-600">
                            {platformLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.path}
                                        className="hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-slate-400">
                            Company
                        </h4>
                        <ul className="space-y-3 text-sm font-medium text-slate-600">
                            {companyLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.path}
                                        className="hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-xs">
                        © 2026 ResumeEZ AI. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}