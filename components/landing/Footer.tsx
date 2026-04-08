import Link from "next/link";
import Logo from "./Logo";
import { ArrowRight } from "lucide-react";

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
        <footer className="bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-6 py-14">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="col-span-2">
                        <div className="mb-4">
                            <Logo />
                        </div>
                        <p className="text-slate-500 max-w-xs text-sm leading-relaxed mb-6">
                            The world&apos;s most advanced AI-powered recruitment platform
                            designed to bring transparency and efficiency to the hiring process.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:gap-2.5 transition-all group"
                        >
                            Start for free
                            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-5">
                            Platform
                        </h4>
                        <ul className="space-y-3">
                            {platformLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.path}
                                        className="text-sm text-slate-600 font-medium hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-5">
                            Company
                        </h4>
                        <ul className="space-y-3">
                            {companyLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.path}
                                        className="text-sm text-slate-600 font-medium hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-slate-400 text-xs">
                        © 2026 ResumeEZ AI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-slate-400 font-medium">All systems operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
