const savedSearches = [
    {
        title: "Product Designer",
        subtitle: "NY • Hybrid • $150k+",
        badge: "2 New",
        badgeColor: "bg-red-100 text-red-600",
    },
    {
        title: "React Architect",
        subtitle: "Remote • $200k+",
        badge: "0 New",
        badgeColor: "bg-slate-200 text-slate-500",
    },
];

const trendingSkills = [
    { name: "LLM Tuning", percent: 85 },
    { name: "LangChain", percent: 70 },
    { name: "Vector DBs", percent: 60 },
];

export default function RightSidebar() {
    return (
        <aside className="w-80 shrink-0 hidden xl:block space-y-6">
            {/* Saved Searches */}
            <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="text-sm font-bold mb-4">Saved Searches</h3>
                <div className="space-y-4">
                    {savedSearches.map((s) => (
                        <div
                            key={s.title}
                            className="flex items-center justify-between p-3 bg-background-light rounded-lg cursor-pointer hover:border-primary/30 border border-transparent transition-all"
                        >
                            <div>
                                <p className="text-xs font-bold">{s.title}</p>
                                <p className="text-[10px] text-slate-500">{s.subtitle}</p>
                            </div>
                            <span
                                className={`text-[10px] ${s.badgeColor} px-1.5 py-0.5 rounded-full font-bold`}
                            >
                                {s.badge}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upgrade to Pro */}
            <div className="bg-primary text-white rounded-lg p-6 relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">
                        Upgrade to Pro
                    </p>
                    <h3 className="text-lg font-extrabold mb-4 leading-snug">
                        Get AI career coaching and salary benchmarking.
                    </h3>
                    <button className="w-full py-2 bg-white text-primary font-bold rounded-lg text-sm hover:bg-slate-100 transition-colors">
                        Learn More
                    </button>
                </div>
                {/* Decorative blurs */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -left-10 -top-10 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl" />
            </div>

            {/* Trending Skills */}
            <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="text-sm font-bold mb-4">Trending Skills in AI</h3>
                <div className="space-y-3">
                    {trendingSkills.map((skill) => (
                        <div key={skill.name} className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500">
                                {skill.name}
                            </span>
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full">
                                <div
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${skill.percent}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}