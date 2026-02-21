import { BarChart2, BookOpen } from "lucide-react";

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
    return (
        <section className="py-24 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Left */}
                    <div className="flex-1">
                        <h2 className="text-4xl font-black text-black mb-6 leading-tight">
                            Bridge the <span className="text-primary">Skill Gap</span> with
                            Precision
                        </h2>
                        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                            Our proprietary AI analyzes the job description and your resume to
                            reveal exactly what&apos;s missing. No more guessing why you
                            aren&apos;t getting interviews.
                        </p>

                        <div className="space-y-6">
                            {features.map(({ Icon, title, desc }) => (
                                <div
                                    key={title}
                                    className="flex gap-4 p-5 bg-white rounded-lg shadow-sm border border-slate-100"
                                >
                                    <div className="shrink-0 text-primary">
                                        <Icon size={22} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-1">{title}</h4>
                                        <p className="text-sm text-slate-500">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Match Analysis Card */}
                    <div className="flex-1 w-full max-w-lg">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
                            <div className="flex items-center justify-between mb-8">
                                <span className="font-bold text-slate-800">Match Analysis</span>
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">
                                    Senior UI Engineer
                                </span>
                            </div>

                            {/* Circular Progress */}
                            <div className="flex justify-center mb-8">
                                <div className="relative w-40 h-40 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="80"
                                            cy="80"
                                            fill="transparent"
                                            r="70"
                                            stroke="#f1f5f9"
                                            strokeWidth="8"
                                        />
                                        <circle
                                            className="text-primary"
                                            cx="80"
                                            cy="80"
                                            fill="transparent"
                                            r="70"
                                            stroke="currentColor"
                                            strokeDasharray="440"
                                            strokeDashoffset="66"
                                            strokeWidth="8"
                                        />
                                    </svg>
                                    <div className="absolute text-center">
                                        <span className="text-3xl font-black text-slate-800">85%</span>
                                        <p className="text-[10px] text-slate-400 font-bold">
                                            MATCH SCORE
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase">
                                        Detected Skills
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {["React.js", "Tailwind CSS", "TypeScript"].map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase">
                                        Missing Skills
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {["Next.js Framework", "GraphQL"].map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <button className="w-full py-3 bg-primary text-white rounded-lg font-bold text-sm cursor-pointer hover:bg-primary/90 transition-colors">
                                    Generate Learning Roadmap
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
