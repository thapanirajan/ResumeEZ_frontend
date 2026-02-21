"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    SkillGapResponse,
    MatchedSkillItem,
    MissingSkillItem,
    ExtraSkillItem,
    loadAnalysisResult,
} from "@/services/skill-gap.service";

// ── Colour helpers ────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
    language:    "bg-blue-100 text-blue-700",
    framework:   "bg-indigo-100 text-indigo-700",
    tool:        "bg-orange-100 text-orange-700",
    cloud:       "bg-sky-100 text-sky-700",
    database:    "bg-emerald-100 text-emerald-700",
    ai_ml:       "bg-purple-100 text-purple-700",
    methodology: "bg-slate-100 text-slate-600",
    soft:        "bg-pink-100 text-pink-700",
    api:         "bg-yellow-100 text-yellow-700",
};

function categoryColor(cat: string) {
    return CATEGORY_COLORS[cat] ?? "bg-gray-100 text-gray-600";
}

function scoreTextColor(pct: number) {
    if (pct >= 80) return "text-emerald-600";
    if (pct >= 60) return "text-[#1e3a8a]";
    if (pct >= 40) return "text-amber-500";
    return "text-red-500";
}

function scoreBarColor(pct: number) {
    if (pct >= 80) return "bg-emerald-500";
    if (pct >= 60) return "bg-[#1e3a8a]";
    if (pct >= 40) return "bg-amber-500";
    return "bg-red-500";
}

function scoreLabel(pct: number) {
    if (pct >= 80) return "Strong match";
    if (pct >= 60) return "Good match";
    if (pct >= 40) return "Moderate match";
    return "Low match";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: string }) {
    return (
        <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryColor(category)}`}
        >
            {category}
        </span>
    );
}

function MatchedSkillCard({ skill }: { skill: MatchedSkillItem }) {
    return (
        <li className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-emerald-800">{skill.name}</span>
                {skill.match_type === "fuzzy" && (
                    <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                        ~fuzzy
                    </span>
                )}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <CategoryBadge category={skill.category} />
                {skill.years > 0 && (
                    <span className="text-[10px] text-emerald-600">
                        {skill.years}yr exp
                    </span>
                )}
            </div>
        </li>
    );
}

function MissingSkillCard({ skill }: { skill: MissingSkillItem }) {
    return (
        <li className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-red-800">{skill.name}</span>
                <span className="shrink-0 text-[10px] font-semibold text-red-500">
                    P {skill.priority_score.toFixed(1)}
                </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <CategoryBadge category={skill.category} />
                {skill.section === "required" && (
                    <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700">
                        required
                    </span>
                )}
                {skill.section === "preferred" && (
                    <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                        preferred
                    </span>
                )}
            </div>
        </li>
    );
}

function ExtraSkillCard({ skill }: { skill: ExtraSkillItem }) {
    return (
        <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            <span className="text-sm font-medium text-slate-700">{skill.name}</span>
            <div className="mt-1.5">
                <CategoryBadge category={skill.category} />
            </div>
        </li>
    );
}

function BreakdownBar({ label, value }: { label: string; value: number }) {
    return (
        <div>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                <span>{label}</span>
                <span className="font-medium text-slate-700">{value.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100">
                <div
                    className={`h-1.5 rounded-full ${scoreBarColor(value)}`}
                    style={{ width: `${Math.min(value, 100)}%` }}
                />
            </div>
        </div>
    );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function NoResults() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 text-5xl">📊</div>
            <h2 className="text-xl font-semibold text-slate-800">No analysis found</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
                Run a skill gap analysis first by selecting a resume and pasting a job description.
            </p>
            <Link href="/candidate/upload">
                <button className="mt-6 rounded-lg bg-[#1e3a8a] px-5 py-2.5 text-sm font-medium text-white">
                    Go to Skill Gap Analyzer
                </button>
            </Link>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SkillGapResultsClient() {
    const [result, setResult] = useState<SkillGapResponse | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setResult(loadAnalysisResult());
        setIsHydrated(true);
    }, []);

    if (!isHydrated) {
        // Skeleton while hydrating to prevent SSR/client mismatch
        return (
            <div className="space-y-4 p-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 w-full animate-pulse rounded-2xl bg-slate-100" />
                ))}
            </div>
        );
    }

    if (!result) return <NoResults />;

    const {
        match_percentage,
        total_jd_skills,
        hard_skill_match,
        soft_skill_match,
        matched_skills,
        missing_skills,
        extra_skills,
        gap_report,
        ontology_version,
    } = result;

    return (
        <div className="space-y-6 px-2 py-4 md:px-4">
            {/* ── Header ── */}
            <header className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
                        Skill Gap Analysis
                    </h1>
                    <p className="mt-1 text-xs text-slate-400">
                        Ontology v{ontology_version} · {total_jd_skills} skills detected in JD
                    </p>
                </div>
                <Link href="/candidate/upload">
                    <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        ← Analyze Another
                    </button>
                </Link>
            </header>

            {/* ── Score card ── */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 md:flex-row md:items-center">

                    {/* Big number */}
                    <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 px-8 py-6 md:w-44 md:shrink-0">
                        <span className={`text-5xl font-bold ${scoreTextColor(match_percentage)}`}>
                            {match_percentage.toFixed(1)}%
                        </span>
                        <span className="mt-1 text-xs font-medium text-slate-500">
                            {scoreLabel(match_percentage)}
                        </span>
                        {/* overall progress bar */}
                        <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                            <div
                                className={`h-2 rounded-full transition-all ${scoreBarColor(match_percentage)}`}
                                style={{ width: `${Math.min(match_percentage, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Stats + breakdown */}
                    <div className="flex-1 space-y-4">
                        {/* Counts */}
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="rounded-lg bg-slate-50 px-3 py-2">
                                <p className="text-xl font-bold text-slate-800">{total_jd_skills}</p>
                                <p className="text-xs text-slate-500">JD Skills</p>
                            </div>
                            <div className="rounded-lg bg-emerald-50 px-3 py-2">
                                <p className="text-xl font-bold text-emerald-700">{matched_skills.length}</p>
                                <p className="text-xs text-emerald-600">Matched</p>
                            </div>
                            <div className="rounded-lg bg-red-50 px-3 py-2">
                                <p className="text-xl font-bold text-red-600">{missing_skills.length}</p>
                                <p className="text-xs text-red-500">Missing</p>
                            </div>
                        </div>

                        {/* Category breakdowns */}
                        <div className="space-y-2">
                            {hard_skill_match !== null && (
                                <BreakdownBar label="Technical Skills" value={hard_skill_match} />
                            )}
                            {soft_skill_match !== null && (
                                <BreakdownBar label="Soft Skills" value={soft_skill_match} />
                            )}
                        </div>

                        {/* Gap report */}
                        <p className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
                            {gap_report}
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Skills grid ── */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Matched */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                            ✓
                        </span>
                        <h2 className="text-base font-semibold text-slate-900">
                            Matched Skills
                        </h2>
                        <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            {matched_skills.length}
                        </span>
                    </div>
                    {matched_skills.length === 0 ? (
                        <p className="text-sm text-slate-400">No matching skills found.</p>
                    ) : (
                        <ul className="space-y-2">
                            {matched_skills.map((s) => (
                                <MatchedSkillCard key={s.canonical_id} skill={s} />
                            ))}
                        </ul>
                    )}
                </section>

                {/* Missing */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                            ✗
                        </span>
                        <h2 className="text-base font-semibold text-slate-900">
                            Missing Skills
                        </h2>
                        <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                            {missing_skills.length}
                        </span>
                    </div>
                    {missing_skills.length === 0 ? (
                        <p className="text-sm text-slate-400">
                            No skill gaps — great match!
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {missing_skills.map((s) => (
                                <MissingSkillCard key={s.canonical_id} skill={s} />
                            ))}
                        </ul>
                    )}
                </section>

                {/* Extra */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                            +
                        </span>
                        <h2 className="text-base font-semibold text-slate-900">
                            Additional Skills
                        </h2>
                        <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                            {extra_skills.length}
                        </span>
                    </div>
                    <p className="mb-3 text-xs text-slate-400">
                        Skills in your resume not required by this JD.
                    </p>
                    {extra_skills.length === 0 ? (
                        <p className="text-sm text-slate-400">None detected.</p>
                    ) : (
                        <ul className="space-y-2">
                            {extra_skills.map((s) => (
                                <ExtraSkillCard key={s.canonical_id} skill={s} />
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            {/* ── CTAs ── */}
            <div className="flex flex-wrap gap-3 pb-4">
                <Link href="/candidate/learning-roadmap">
                    <button className="rounded-lg bg-[#1e3a8a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1e3a8a]/90">
                        View Learning Roadmap →
                    </button>
                </Link>
                <Link href="/candidate/upload">
                    <button className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                        Analyze Another JD
                    </button>
                </Link>
            </div>
        </div>
    );
}
