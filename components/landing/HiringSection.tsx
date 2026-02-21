import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, Sparkles, TrendingUp } from "lucide-react";

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
        avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBRkuRcWBvlxVDvdF9BYfcxUYLYaLg1okfxCwP0SJ6TVyuTN9y6JpZfhlgiwONg6UEdecezrN0FKyY0_ZDq3ghe2GOdqMfPu-hhn7Ivd84nKW3SLxolG5rHniPgp18QAnc0D5sA-Sw9nmM0ciY_zfWMnfZJniKwUpp6M4iHRgEvBx7tJeKwSR0-Mm8JI1uMJFuxV9_KlAOoGcuJRviGUD0epTHvq6w7C-HFGo2aAdP7wQabPcxniHWaAiShwBto3kXCGz8z52KWPt9E",
    },
    {
        name: "Sarah Jenkins",
        role: "Product Designer",
        match: 88,
        avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCmYHS_PgYswCJc_6JG5JrU1_S4x3ddWC3dvw8KTy-_aZ3Z1nK3D52aHq4HJuIFSA3GtZ1va8Vp9sg3CfUltEPJkcJ-r-tsmK-dn5nCHwLVdKj3B_0UcKnVZtw5xLD5SlGNOwNpaNlvqrsGIX9MMiUKnrxwHIMyS4x_oFR5TbwosAY5Ko7wIMV3nSF4QrkTnuGsssfn8OEU2Q4kKDyl4EvV2q5DFZHgVTo4FDwRA6UY88EvSqY-AApLVDy02ooKePQjt5iGdkmG_YbH",
    },
    {
        name: "Robert Pike",
        role: "Backend Architect",
        match: 82,
        avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCOXGBKlVldaRm7iAeQFLrFr0F0CKIpTuPFiyoh47vi1cbzDZPJ0dSdMJ_wx-jREMqvxRyxf0uWVOkOQE7JURGoUyFPIOZ52Pgf8C2WaDC64qpxJZwjqnZzqLw7oTWsnxWzRqeVE9SnFMnD404qVHrfucoT1P0sfgBmx3m0wXXY1b16TTtrozXl-IwPrlWOEuUKuKTioSIJaKo9eLFcWUj-7VAoxb3lY7PVsm5fXWLGJ5BIW76Ne89ZdYJuvd8EWheG95Ob4kLrajkH",
    },
];

export default function HiringSection() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 mb-4">Hiring at a Glance</h2>
                        <p className="text-slate-500">
                            Recruiters manage their pipeline with AI-driven efficiency markers.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        {[
                            { label: "Time to Hire", value: "12 Days", color: "text-primary" },
                            { label: "Match Accuracy", value: "98.2%", color: "text-green-500" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center min-w-[120px]"
                            >
                                <p className="text-[10px] text-slate-400 font-bold uppercase">
                                    {stat.label}
                                </p>
                                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Candidate Table */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-xl overflow-hidden border border-slate-100">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <span className="font-bold text-slate-800">Active Candidates</span>
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Search size={14} className="text-slate-500" />
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <SlidersHorizontal size={14} className="text-slate-500" />
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {candidates.map((candidate) => (
                                <div
                                    key={candidate.name}
                                    className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <Image
                                            src={candidate.avatar}
                                            alt={`${candidate.name} profile`}
                                            width={40}
                                            height={40}
                                            className="w-10 h-10 rounded-lg object-cover"
                                        />
                                        <div>
                                            <p className="font-bold text-sm text-slate-800">{candidate.name}</p>
                                            <p className="text-xs text-slate-400">{candidate.role}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-primary">
                                                {candidate.match}% Match
                                            </p>
                                            <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1">
                                                <div
                                                    className="h-full bg-primary rounded-full"
                                                    style={{ width: `${candidate.match}%` }}
                                                />
                                            </div>
                                        </div>
                                        <button className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded cursor-pointer hover:bg-primary/20 transition-colors">
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Job Posting Intelligence */}
                    <div className="bg-primary text-white p-8 rounded-xl shadow-xl flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Job Posting Intelligence</h3>
                            <p className="text-blue-200 text-sm leading-relaxed mb-6">
                                Our AI assists you in writing job descriptions that attract 40%
                                more qualified candidates.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { Icon: Sparkles, text: "Auto-generate requirements" },
                                    { Icon: TrendingUp, text: "Market salary analysis" },
                                ].map(({ Icon, text }) => (
                                    <div key={text} className="flex items-center gap-3">
                                        <Icon size={18} className="text-blue-300 shrink-0" />
                                        <span className="text-sm">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Link href="/login" className="mt-8 block bg-white text-primary font-black py-4 rounded-lg w-full hover:bg-blue-50 transition-colors text-center">
                            Start Hiring Now
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
