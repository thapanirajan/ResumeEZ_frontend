import Logo from "./Logo";

const platformLinks = ["Resume Builder", "Skill Analysis", "Recruiter Tools", "Job Search"];
const companyLinks = ["About Us", "Pricing", "Terms of Service", "Privacy Policy"];

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
                                <li key={link}>
                                    <a href="#" className="hover:text-primary transition-colors">
                                        {link}
                                    </a>
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
                                <li key={link}>
                                    <a href="#" className="hover:text-primary transition-colors">
                                        {link}
                                    </a>
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
