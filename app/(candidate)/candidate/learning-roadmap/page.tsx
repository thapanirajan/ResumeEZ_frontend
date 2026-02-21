"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    RoadmapSkillItem,
    RoadmapPhases,
    loadAnalysisResult,
} from "@/services/skill-gap.service";

// ── Colour helpers ─────────────────────────────────────────────────────────────

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

// ── Phase config ───────────────────────────────────────────────────────────────

interface PhaseConfig {
    key: keyof RoadmapPhases;
    label: string;
    description: string;
    accent: string;          // border + icon bg
    badgeCls: string;        // pill colour
    headerText: string;      // heading text colour
    icon: string;
}

const PHASES: PhaseConfig[] = [
    {
        key: "phase_1_core",
        label: "Phase 1 — Foundation",
        description: "Prerequisite skills you need before tackling the core gaps.",
        accent: "border-amber-300",
        badgeCls: "bg-amber-100 text-amber-800",
        headerText: "text-amber-900",
        icon: "🔑",
    },
    {
        key: "phase_2_primary",
        label: "Phase 2 — Core Gaps",
        description: "High-priority skills directly required by the job description.",
        accent: "border-[#1e3a8a]",
        badgeCls: "bg-blue-100 text-blue-800",
        headerText: "text-[#1e3a8a]",
        icon: "🎯",
    },
    {
        key: "phase_3_advanced",
        label: "Phase 3 — Advanced & Optional",
        description: "Preferred or nice-to-have skills that give you an edge.",
        accent: "border-slate-300",
        badgeCls: "bg-slate-100 text-slate-700",
        headerText: "text-slate-700",
        icon: "⭐",
    },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: string }) {
    return (
        <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryColor(category)}`}
        >
            {category}
        </span>
    );
}

function SkillCard({ skill }: { skill: RoadmapSkillItem }) {
    return (
        <li className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold text-slate-800">{skill.name}</span>
                {skill.priority_score !== undefined && skill.priority_score > 0 && (
                    <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                        P {skill.priority_score.toFixed(1)}
                    </span>
                )}
            </div>
            <div className="mt-1.5">
                <CategoryBadge category={skill.category} />
            </div>
            {skill.subtopics.length > 0 && (
                <div className="mt-3">
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Learning Topics
                    </p>
                    <ul className="space-y-1">
                        {skill.subtopics.map((topic) => (
                            <li
                                key={topic}
                                className="flex items-center gap-1.5 text-xs text-slate-600"
                            >
                                <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300" />
                                {topic}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </li>
    );
}

function PhaseSection({
    config,
    skills,
}: {
    config: PhaseConfig;
    skills: RoadmapSkillItem[];
}) {
    if (skills.length === 0) return null;

    return (
        <section
            className={`rounded-2xl border-l-4 bg-white p-6 shadow-sm ${config.accent}`}
        >
            <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl">{config.icon}</span>
                <div>
                    <h2 className={`text-base font-bold ${config.headerText}`}>
                        {config.label}
                    </h2>
                    <p className="text-xs text-slate-500">{config.description}</p>
                </div>
                <span
                    className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.badgeCls}`}
                >
                    {skills.length} skill{skills.length !== 1 ? "s" : ""}
                </span>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {skills.map((s) => (
                    <SkillCard key={s.canonical_id} skill={s} />
                ))}
            </ul>
        </section>
    );
}

// ── Empty state ────────────────────────────────────────────────────────────────

function NoRoadmap() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 text-5xl">🗺️</div>
            <h2 className="text-xl font-semibold text-slate-800">No roadmap yet</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
                Run a skill gap analysis first — your personalised learning roadmap will
                appear here.
            </p>
            <Link href="/candidate/upload">
                <button className="mt-6 rounded-lg bg-[#1e3a8a] px-5 py-2.5 text-sm font-medium text-white">
                    Go to Skill Gap Analyzer
                </button>
            </Link>
        </div>
    );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function LearningRoadmapPage() {
    const [roadmap, setRoadmap] = useState<RoadmapPhases | null>(null);
    const [totalSkills, setTotalSkills] = useState(0);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const result = loadAnalysisResult();
        if (result?.roadmap) {
            setRoadmap(result.roadmap);
            const count =
                result.roadmap.phase_1_core.length +
                result.roadmap.phase_2_primary.length +
                result.roadmap.phase_3_advanced.length;
            setTotalSkills(count);
        }
        setIsHydrated(true);
    }, []);

    if (!isHydrated) {
        return (
            <div className="space-y-4 p-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 w-full animate-pulse rounded-2xl bg-slate-100" />
                ))}
            </div>
        );
    }

    if (!roadmap) return <NoRoadmap />;

    return (
        <div className="space-y-6 px-2 py-4 md:px-4">
            {/* ── Header ── */}
            <header className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
                        Learning Roadmap
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Personalised 3-phase plan based on your skill gap analysis.
                    </p>
                </div>
                <Link href="/candidate/skill-gap">
                    <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        ← Back to Results
                    </button>
                </Link>
            </header>

            {/* ── Summary bar ── */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-slate-800">{totalSkills}</p>
                        <p className="text-xs text-slate-500">Skills to Learn</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-amber-600">
                            {roadmap.phase_1_core.length}
                        </p>
                        <p className="text-xs text-slate-500">Foundation</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[#1e3a8a]">
                            {roadmap.phase_2_primary.length}
                        </p>
                        <p className="text-xs text-slate-500">Core Gaps</p>
                    </div>
                </div>
            </section>

            {/* ── Phases ── */}
            <div className="space-y-6">
                {PHASES.map((cfg) => (
                    <PhaseSection
                        key={cfg.key}
                        config={cfg}
                        skills={roadmap[cfg.key]}
                    />
                ))}
            </div>

            {/* ── CTAs ── */}
            <div className="flex flex-wrap gap-3 pb-4">
                <Link href="/candidate/skill-gap">
                    <button className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                        ← Back to Skill Gap Results
                    </button>
                </Link>
                <Link href="/candidate/upload">
                    <button className="rounded-lg bg-[#1e3a8a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1e3a8a]/90">
                        Analyze Another JD
                    </button>
                </Link>
            </div>
        </div>
    );
}
