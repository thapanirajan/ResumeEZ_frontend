"use client";

import Link from "next/link";
import { BarChart2, BookOpen, BrainCircuit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const features = [
    {
        Icon: BarChart2,
        title: "Match Percentage",
        desc: "Real-time comparison score based on keywords and intent.",
    },
    {
        Icon: BookOpen,
        title: "Learning Roadmap",
        desc: "Direct links to courses to bridge your specific missing skills.",
    },
];

export default function SkillGapSection() {
    const { href } = useAuthRedirect();
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Left */}
                    <div className="flex-1">
                        <Badge className="mb-5 gap-1.5">
                            <BrainCircuit size={11} />
                            Skill Intelligence
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-5 leading-tight">
                            Bridge the{" "}
                            <span className="text-primary">Skill Gap</span>{" "}
                            with Precision
                        </h2>
                        <p className="text-slate-500 text-base leading-relaxed mb-8">
                            Our proprietary AI analyzes the job description and your resume to
                            reveal exactly what&apos;s missing. No more guessing why you
                            aren&apos;t getting interviews.
                        </p>

                        <div className="space-y-4 mb-8">
                            {features.map(({ Icon, title, desc }) => (
                                <Card key={title} className="border-slate-200 hover:border-primary/20 hover:shadow-md transition-all duration-200">
                                    <CardContent className="p-5 flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <Icon size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 mb-1 text-sm">{title}</h4>
                                            <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Right — Match Analysis Card */}
                    <div className="flex-1 w-full max-w-lg">
                        <Card className="shadow-2xl border-slate-200 overflow-hidden">
                            {/* Card header */}
                            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
                                <span className="font-bold text-slate-800 text-sm">Match Analysis</span>
                                <Badge variant="default" className="text-[10px] font-bold uppercase tracking-wide">
                                    Senior UI Engineer
                                </Badge>
                            </div>

                            <CardContent className="p-8">
                                {/* Circular Progress */}
                                <div className="flex justify-center mb-8">
                                    <div className="relative w-40 h-40 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle cx="80" cy="80" fill="transparent" r="70" stroke="#f1f5f9" strokeWidth="8" />
                                            <circle
                                                cx="80" cy="80" fill="transparent" r="70"
                                                stroke="#1e3b8a"
                                                strokeDasharray="440"
                                                strokeDashoffset="66"
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute text-center">
                                            <span className="text-4xl font-black text-slate-800">85%</span>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                                Match Score
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Skill pills */}
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-[11px] font-black text-slate-400 mb-2.5 uppercase tracking-wider">
                                            Detected Skills
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {["React.js", "Tailwind CSS", "TypeScript"].map((skill) => (
                                                <Badge key={skill} variant="success">{skill}</Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-black text-slate-400 mb-2.5 uppercase tracking-wider">
                                            Missing Skills
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {["Next.js Framework", "GraphQL"].map((skill) => (
                                                <Badge key={skill} variant="destructive">{skill}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <Button className="w-full" size="lg" asChild>
                                        <Link href={href("/candidate/skill-gap", "/recruiter")}>
                                            Generate Learning Roadmap
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
