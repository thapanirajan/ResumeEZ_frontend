"use client";

const skills = ["Python", "PyTorch", "Generative AI", "MLOps", "AWS"];

export default function SidebarFilters() {
    return (
        <aside className="w-72 shrink-0 space-y-8">
            {/* Experience Level */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">
                    Experience Level
                </h3>
                <div className="space-y-3">
                    {[
                        { label: "Entry Level", count: 124, checked: false },
                        { label: "Mid-Senior", count: 452, checked: true },
                        { label: "Director / Lead", count: 89, checked: false },
                    ].map((item) => (
                        <label
                            key={item.label}
                            className="flex items-center justify-between group cursor-pointer"
                        >
                            <span className="flex items-center gap-3">
                                <input
                                    defaultChecked={item.checked}
                                    className="rounded border-slate-300 text-primary focus:ring-primary h-5 w-5"
                                    type="checkbox"
                                />
                                <span className="text-sm font-medium">{item.label}</span>
                            </span>
                            <span className="text-xs font-bold text-slate-400 group-hover:text-primary transition-colors">
                                {item.count}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Salary Range */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                        Salary Range
                    </h3>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                        $120k+
                    </span>
                </div>
                <div className="px-2">
                    <div className="h-1.5 bg-slate-200 rounded-full relative">
                        <div className="absolute left-1/4 right-0 h-full bg-primary rounded-full" />
                        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full cursor-pointer shadow-sm" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full cursor-pointer shadow-sm" />
                    </div>
                    <div className="flex justify-between mt-4">
                        <span className="text-xs font-medium text-slate-500">$50k</span>
                        <span className="text-xs font-medium text-slate-500">$250k+</span>
                    </div>
                </div>
            </div>

            {/* Key Skills */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">
                    Key Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg transition-all">
                        Python
                    </button>
                    {skills.slice(1).map((skill) => (
                        <button
                            key={skill}
                            className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-bold rounded-lg hover:border-primary/50 transition-all"
                        >
                            {skill}
                        </button>
                    ))}
                    <button className="px-3 py-1.5 text-primary text-xs font-bold hover:underline">
                        + Add Skill
                    </button>
                </div>
            </div>

            {/* AI Match Insight */}
            <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                    <span className="material-icons-round text-sm">auto_awesome</span>
                    AI Match Insight
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Based on your profile, you have a 92% match for Senior AI Engineer
                    roles.
                </p>
                <button className="w-full py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors">
                    View Recommendations
                </button>
            </div>
        </aside>
    );
}