


import { TrendingUp, Briefcase, FileText, ScanSearch, BrainCircuit, Users, ClipboardList, BarChart2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
    return (
        <header className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                {/* Left Content */}
                <div className="z-10">
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6">
                        <span className="text-black">AI-Powered Hiring &amp;{" "}</span>
                        <span className="text-primary">Resume Intelligence</span>
                    </h1>

                    <p className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed">
                        Optimize your career or streamline your recruitment with our
                        advanced AI resume scoring, match-accuracy indicators, and skill gap
                        analysis.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/resume-builder" className="bg-primary text-white px-8 py-4 rounded-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                            Build Your Resume
                            <TrendingUp size={18} />
                        </Link>
                        <Link href="/login" className="bg-white border border-slate-200 px-8 py-4 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                            Post a Job
                            <Briefcase size={18} />
                        </Link>
                    </div>

                    <div className="mt-10 flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuBMllwfQ1npW9l83GKfeP-RLQYUidwVw4q0cOOa4vvXlddU5MwojQb7OHFdyzcHhuypp5di8fuQqjWhpMsikH7sBG8wYJz0Ybja4WLA1--g7ixsxwRLljwBbHatnx41a4WQSEZmP5BZCPAiG3odwEZQtRGzNWEw5PpQLmoB2fRU1KxRN_moVx9gXPy0_SDQpM8pMO-3nSFyA8-_El98JTkQ1TkygQMvx_ypWfOhoZN3wyK55ro1WGXabhpZYIVVOx3QR6C0rDYDqeF_",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuBnfir6jWzhR3YW7Sw5Mc9i3UbFIoCDBigQnnAFZgit5ljsHM4WKVUpATG60D9pXbJ5_Quq8hUG3pMv72Aoa7p2mf-DCQmXm-WJIgXeBrW3OVZ9WmkKYFoMU5UpYoBfJRoTbKwk37NAXu4Pf5Bb-TWcQQNeiSS8sQfQ5rhSmjVrS7yI0wQYw8SHC19ODXFnFQRV6EwUb_0s9AVHAZfvbhO6xaF4NA0HLLmddVtF0eJz2qpQMQXbbVWEb63TcsqZf1Fs13yZQ-_sWq7I",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuAw0op8YgpzyyTIoUyAisd83lV0Dx0Rjjc0KVZIolg_nLv3kcEeo717xhu1uqb77iIZ45LqUEJmLCcFB1zO5nA8T-2JqIOxNDiAEzoivNqgj0vnxMO0dLMwZvUuR88mxmwsuSWnaLtZLPB9QiCGUh7FCRdiOF4z9pO73sgb_oNfBCih8PLQFhSloe0H5EZgr5_1WxTJgHAGvtwcrcg_AbLhhXJuQMCHhQzMTiIsBrAnQz1k5uFRoprtAp4T2e0VwYm_CPPaH9XJsWA3",
                            ].map((src, i) => (
                                <Image
                                    key={i}
                                    src={src}
                                    alt="Professional profile"
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                />
                            ))}
                        </div>
                        <p className="text-sm text-slate-500 font-medium">
                            Join 50,000+ experts finding roles
                        </p>
                    </div>
                </div>

                {/* Right Visual — hidden on mobile, shown on lg */}
                <div className="relative group hidden lg:block">
                    <div className="relative w-full aspect-square max-w-[550px] mx-auto">
                        {/* Main Image */}
                        <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl z-0 border border-primary/10">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxYJfdQ_ckEwSnydCNowd67or9hzYHWAYfLUYlr1_Hqs0BNFApqF-WtU-PUQcR3TuD6QxmbU90fkVxGYd4vJ_y2PZKTZUKsjVn6QQu344A5XUUBaCuwQhop6_xYYjUsMQu0b0whDXBQMI7U5R7XMJs8dV4EcCROa2_9ypoQ6gLv7Lf6w4GZe5fh2BiZXLS6sM_cZ6HOs7xT8k9dhm6-7uRefr9n_GFr6ZCi3AR0WndT_n7anNGGRBWVjW6hMqYCOFDSdGxzQYIVi98"
                                alt="Diverse professionals collaborating in a modern workspace"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-tr from-primary/40 to-transparent mix-blend-multiply" />
                        </div>

                        {/* Candidate Features Card */}
                        <div className="absolute top-4 -left-20 w-[185px] p-4 rounded-xl z-20"
                            style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "0 4px 24px 0 rgba(30,59,138,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.6)" }}>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block mb-3">
                                For Candidates
                            </span>
                            <div className="space-y-2">
                                {[
                                    { Icon: FileText, label: "AI Resume Builder" },
                                    { Icon: ScanSearch, label: "ATS Optimization" },
                                    { Icon: BrainCircuit, label: "Skill Gap Analysis" },
                                ].map(({ Icon, label }) => (
                                    <div key={label} className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                                            <Icon size={13} className="text-primary" />
                                        </div>
                                        <span className="text-[11px] font-semibold text-slate-700 leading-tight">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recruiter Features Card */}
                        <div className="absolute bottom-4 -right-24  w-[185px] p-4 rounded-xl z-20"
                            style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "0 4px 24px 0 rgba(30,59,138,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.6)" }}>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block mb-3">
                                For Recruiters
                            </span>
                            <div className="space-y-2">
                                {[
                                    { Icon: Users, label: "Candidate Screening" },
                                    { Icon: ClipboardList, label: "Job-Resume Matching" },
                                    { Icon: BarChart2, label: "Ranked Shortlists" },
                                ].map(({ Icon, label }) => (
                                    <div key={label} className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                                            <Icon size={13} className="text-primary" />
                                        </div>
                                        <span className="text-[11px] font-semibold text-slate-700 leading-tight">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SVG Network Lines */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
                            <svg className="w-full h-full opacity-30" viewBox="0 0 400 400">
                                <circle
                                    cx="200"
                                    cy="200"
                                    fill="none"
                                    r="120"
                                    stroke="#1e3b8a"
                                    strokeDasharray="4 4"
                                    strokeWidth="0.5"
                                />
                                <circle cx="100" cy="150" fill="#1e3b8a" r="4" />
                                <circle cx="300" cy="250" fill="#1e3b8a" r="4" />
                                <circle cx="250" cy="100" fill="#1e3b8a" r="4" />
                                <line
                                    stroke="#1e3b8a"
                                    strokeWidth="1"
                                    x1="100"
                                    x2="250"
                                    y1="150"
                                    y2="100"
                                />
                                <line
                                    stroke="#1e3b8a"
                                    strokeWidth="1"
                                    x1="250"
                                    x2="300"
                                    y1="100"
                                    y2="250"
                                />
                            </svg>
                        </div>

                        <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-white border-2 border-primary rounded-full z-10 shadow-sm" />
                        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-primary rounded-full z-10 animate-pulse" />
                    </div>
                </div>
            </div>
        </header>
    );
}