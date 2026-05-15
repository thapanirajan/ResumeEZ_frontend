"use client";

import {
    TrendingUp, Briefcase, FileText, ScanSearch,
    BrainCircuit, Users, ClipboardList, BarChart2,
    Sparkles, ArrowRight, Star
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function HeroSection() {
    const { href } = useAuthRedirect();
    return (
        <section className="relative overflow-hidden bg-white">
            {/* Background grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e3b8a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Blue gradient blob top-right */}
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-28 lg:pt-28 lg:pb-36">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* ── Left Content ── */}
                    <div className="z-10">
                        {/* Eyebrow badge */}
                        <div className="mb-6">
                            <Badge className="gap-1.5 py-1.5 text-xs font-bold uppercase tracking-wider">
                                <Sparkles size={12} />
                                AI-Powered Career Platform
                            </Badge>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-black leading-[1.05] tracking-tight mb-6">
                            <span className="text-slate-900">Land Your </span>
                            <span
                                className="text-primary relative inline-block"
                                style={{
                                    WebkitTextStroke: "0px",
                                }}
                            >
                                Dream Job
                                {/* underline accent */}
                                <svg
                                    className="absolute -bottom-2 left-0 w-full"
                                    viewBox="0 0 300 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="none"
                                >
                                    <path
                                        d="M1 9C72 3.5 150 1.5 299 9"
                                        stroke="#1e3b8a"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        opacity="0.35"
                                    />
                                </svg>
                            </span>
                            <span className="text-slate-900"> with AI Resume Intelligence</span>
                        </h1>

                        <p className="text-lg text-slate-500 mb-10 max-w-xl leading-relaxed">
                            Optimize your career or streamline recruitment with advanced AI resume
                            scoring, match-accuracy indicators, and skill gap analysis.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-12">
                            <Button size="lg" asChild>
                                <Link href={href("/candidate/resume", "/recruiter")}>
                                    Build Your Resume
                                    <TrendingUp size={18} />
                                </Link>
                            </Button>
                            <Button size="lg" variant="secondary" asChild>
                                <Link href={href("/candidate/job", "/recruiter/job")}>
                                    Post a Job
                                    <Briefcase size={18} />
                                </Link>
                            </Button>
                        </div>

                        {/* Social proof */}
                        {/* <div className="flex items-center gap-5 pt-6 border-t border-slate-100">
                            <div className="flex -space-x-2.5">
                                {[
                                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBMllwfQ1npW9l83GKfeP-RLQYUidwVw4q0cOOa4vvXlddU5MwojQb7OHFdyzcHhuypp5di8fuQqjWhpMsikH7sBG8wYJz0Ybja4WLA1--g7ixsxwRLljwBbHatnx41a4WQSEZmP5BZCPAiG3odwEZQtRGzNWEw5PpQLmoB2fRU1KxRN_moVx9gXPy0_SDQpM8pMO-3nSFyA8-_El98JTkQ1TkygQMvx_ypWfOhoZN3wyK55ro1WGXabhpZYIVVOx3QR6C0rDYDqeF_",
                                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBnfir6jWzhR3YW7Sw5Mc9i3UbFIoCDBigQnnAFZgit5ljsHM4WKVUpATG60D9pXbJ5_Quq8hUG3pMv72Aoa7p2mf-DCQmXm-WJIgXeBrW3OVZ9WmkKYFoMU5UpYoBfJRoTbKwk37NAXu4Pf5Bb-TWcQQNeiSS8sQfQ5rhSmjVrS7yI0wQYw8SHC19ODXFnFQRV6EwUb_0s9AVHAZfvbhO6xaF4NA0HLLmddVtF0eJz2qpQMQXbbVWEb63TcsqZf1Fs13yZQ-_sWq7I",
                                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAw0op8YgpzyyTIoUyAisd83lV0Dx0Rjjc0KVZIolg_nLv3kcEeo717xhu1uqb77iIZ45LqUEJmLCcFB1zO5nA8T-2JqIOxNDiAEzoivNqgj0vnxMO0dLMwZvUuR88mxmwsuSWnaLtZLPB9QiCGUh7FCRdiOF4z9pO73sgb_oNfBCih8PLQFhSloe0H5EZgr5_1WxTJgHAGvtwcrcg_AbLhhXJuQMCHhQzMTiIsBrAnQz1k5uFRoprtAp4T2e0VwYm_CPPaH9XJsWA3",
                                ].map((src, i) => (
                                    <Image
                                        key={i}
                                        src={src}
                                        alt="Professional"
                                        width={36}
                                        height={36}
                                        className="w-9 h-9 rounded-full border-2 border-white object-cover ring-1 ring-primary/10"
                                    />
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-1 mb-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 font-medium">
                                    Trusted by <span className="text-slate-800 font-bold">50,000+</span> professionals
                                </p>
                            </div>
                        </div> */}
                    </div>

                    {/* ── Right Visual ── */}
                    <div className="relative hidden lg:block">
                        <div className="relative w-full max-w-[540px] mx-auto">
                            {/* Main image */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                                <Image
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxYJfdQ_ckEwSnydCNowd67or9hzYHWAYfLUYlr1_Hqs0BNFApqF-WtU-PUQcR3TuD6QxmbU90fkVxGYd4vJ_y2PZKTZUKsjVn6QQu344A5XUUBaCuwQhop6_xYYjUsMQu0b0whDXBQMI7U5R7XMJs8dV4EcCROa2_9ypoQ6gLv7Lf6w4GZe5fh2BiZXLS6sM_cZ6HOs7xT8k9dhm6-7uRefr9n_GFr6ZCi3AR0WndT_n7anNGGRBWVjW6hMqYCOFDSdGxzQYIVi98"
                                    alt="Professionals collaborating"
                                    width={540}
                                    height={480}
                                    className="object-cover w-full aspect-[9/8]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-transparent" />
                            </div>

                            {/* For Candidates card */}
                            <div
                                className="absolute -left-16 top-8 w-[190px] rounded-xl p-4 shadow-xl border border-white/60"
                                style={{
                                    background: "rgba(255,255,255,0.92)",
                                    backdropFilter: "blur(20px)",
                                }}
                            >
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                    For Candidates
                                </p>
                                <div className="space-y-2.5">
                                    {[
                                        { Icon: FileText, label: "AI Resume Builder" },
                                        { Icon: ScanSearch, label: "ATS Optimization" },
                                        { Icon: BrainCircuit, label: "Skill Gap Analysis" },
                                    ].map(({ Icon, label }) => (
                                        <div key={label} className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
                                                <Icon size={13} className="text-white" />
                                            </div>
                                            <span className="text-[11px] font-semibold text-slate-700">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* For Recruiters card */}
                            <div
                                className="absolute -right-16 bottom-8 w-[190px] rounded-xl p-4 shadow-xl border border-white/60"
                                style={{
                                    background: "rgba(255,255,255,0.92)",
                                    backdropFilter: "blur(20px)",
                                }}
                            >
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                    For Recruiters
                                </p>
                                <div className="space-y-2.5">
                                    {[
                                        { Icon: Users, label: "Candidate Screening" },
                                        { Icon: ClipboardList, label: "Job-Resume Matching" },
                                        { Icon: BarChart2, label: "Ranked Shortlists" },
                                    ].map(({ Icon, label }) => (
                                        <div key={label} className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
                                                <Icon size={13} className="text-white" />
                                            </div>
                                            <span className="text-[11px] font-semibold text-slate-700">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Match score pill */}
                            <div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-4 bg-primary text-white rounded-full px-3 py-1.5 text-xs font-black shadow-lg shadow-primary/30 flex items-center gap-1.5">
                                <TrendingUp size={12} />
                                98% Match
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats row */}
                {/* <div className="mt-20 pt-12 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-8">
                    {[
                        { value: "50K+", label: "Active Users" },
                        { value: "98.2%", label: "Match Accuracy" },
                        { value: "12 Days", label: "Avg. Time to Hire" },
                        { value: "200+", label: "Open Positions" },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-3xl font-black text-primary mb-1">{stat.value}</p>
                            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div> */}
            </div>
        </section>
    );
}
