import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, Sparkles, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Candidate = {
    name: string;
    role: string;
    match: number;
    avatar: string;
};

const candidates: Candidate[] = [
    {
        name: "Marcus Chen",
        role: "Senior React Developer",
        match: 95,
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRkuRcWBvlxVDvdF9BYfcxUYLYaLg1okfxCwP0SJ6TVyuTN9y6JpZfhlgiwONg6UEdecezrN0FKyY0_ZDq3ghe2GOdqMfPu-hhn7Ivd84nKW3SLxolG5rHniPgp18QAnc0D5sA-Sw9nmM0ciY_zfWMnfZJniKwUpp6M4iHRgEvBx7tJeKwSR0-Mm8JI1uMJFuxV9_KlAOoGcuJRviGUD0epTHvq6w7C-HFGo2aAdP7wQabPcxniHWaAiShwBto3kXCGz8z52KWPt9E",
    },
    {
        name: "Sarah Jenkins",
        role: "Product Designer",
        match: 88,
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmYHS_PgYswCJc_6JG5JrU1_S4x3ddWC3dvw8KTy-_aZ3Z1nK3D52aHq4HJuIFSA3GtZ1va8Vp9sg3CfUltEPJkcJ-r-tsmK-dn5nCHwLVdKj3B_0UcKnVZtw5xLD5SlGNOwNpaNlvqrsGIX9MMiUKnrxwHIMyS4x_oFR5TbwosAY5Ko7wIMV3nSF4QrkTnuGsssfn8OEU2Q4kKDyl4EvV2q5DFZHgVTo4FDwRA6UY88EvSqY-AApLVDy02ooKePQjt5iGdkmG_YbH",
    },
    {
        name: "Robert Pike",
        role: "Backend Architect",
        match: 82,
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOXGBKlVldaRm7iAeQFLrFr0F0CKIpTuPFiyoh47vi1cbzDZPJ0dSdMJ_wx-jREMqvxRyxf0uWVOkOQE7JURGoUyFPIOZ52Pgf8C2WaDC64qpxJZwjqnZzqLw7oTWsnxWzRqeVE9SnFMnD404qVHrfucoT1P0sfgBmx3m0wXXY1b16TTtrozXl-IwPrlWOEuUKuKTioSIJaKo9eLFcWUj-7VAoxb3lY7PVsm5fXWLGJ5BIW76Ne89ZdYJuvd8EWheG95Ob4kLrajkH",
    },
];

export default function HiringSection() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header row */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
                    <div>
                        <Badge className="mb-4 gap-1.5">
                            <Users size={11} />
                            Recruiter Dashboard
                        </Badge>
                        <h2 className="text-3xl font-black text-slate-900 mb-2">Hiring at a Glance</h2>
                        <p className="text-slate-500 text-sm">
                            Manage your pipeline with AI-driven efficiency markers.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {[
                            { label: "Time to Hire", value: "12 Days", color: "text-primary" },
                            { label: "Match Accuracy", value: "98.2%", color: "text-emerald-600" },
                        ].map((stat) => (
                            <Card key={stat.label} className="border-slate-200 text-center min-w-[120px]">
                                <CardContent className="p-4">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                                        {stat.label}
                                    </p>
                                    <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Candidate table */}
                    <Card className="lg:col-span-2 border-slate-200 overflow-hidden shadow-lg">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <span className="font-bold text-slate-800 text-sm">Active Candidates</span>
                            <div className="flex gap-2">
                                {[Search, SlidersHorizontal].map((Icon, i) => (
                                    <div key={i} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm cursor-pointer hover:border-primary/30 transition-colors">
                                        <Icon size={14} className="text-slate-500" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {candidates.map((candidate) => (
                                <div
                                    key={candidate.name}
                                    className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={candidate.avatar}
                                            alt={`${candidate.name}`}
                                            width={40}
                                            height={40}
                                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100"
                                        />
                                        <div>
                                            <p className="font-bold text-sm text-slate-800 group-hover:text-primary transition-colors">
                                                {candidate.name}
                                            </p>
                                            <p className="text-xs text-slate-400">{candidate.role}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5">
                                        <div className="text-right">
                                            <p className="text-xs font-black text-primary">{candidate.match}% Match</p>
                                            <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full"
                                                    style={{ width: `${candidate.match}%` }}
                                                />
                                            </div>
                                        </div>
                                        <Button size="sm" variant="ghost" className="text-xs text-primary hover:bg-primary/10">
                                            View Profile
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Job Posting Intelligence */}
                    <div className="bg-primary rounded-xl p-8 flex flex-col justify-between shadow-xl shadow-primary/20">
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                                <Sparkles size={22} className="text-white" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-3">Job Posting Intelligence</h3>
                            <p className="text-blue-200 text-sm leading-relaxed mb-6">
                                Our AI assists you in writing job descriptions that attract 40% more qualified candidates.
                            </p>
                            <div className="space-y-3">
                                {[
                                    { Icon: Sparkles, text: "Auto-generate requirements" },
                                    { Icon: TrendingUp, text: "Market salary analysis" },
                                ].map(({ Icon, text }) => (
                                    <div key={text} className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3">
                                        <Icon size={16} className="text-blue-200 shrink-0" />
                                        <span className="text-sm text-white font-medium">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button variant="white" className="mt-8 w-full" asChild>
                            <Link href="/login">Start Hiring Now</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
