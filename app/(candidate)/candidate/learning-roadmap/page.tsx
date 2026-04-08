"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    RoadmapSkillItem,
    RoadmapPhases,
    loadAnalysisResult,
} from "@/services/skill-gap.service";

// ── Types ──────────────────────────────────────────────────────────────────────

type NodeStatus = "not_started" | "in_progress" | "done";
type ProgressMap = Record<string, NodeStatus>;

const STORAGE_KEY = "roadmap_progress";

function cycleStatus(s: NodeStatus): NodeStatus {
    return s === "not_started" ? "in_progress" : s === "in_progress" ? "done" : "not_started";
}

// ── Visual config ──────────────────────────────────────────────────────────────

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

function catColor(cat: string) {
    return CATEGORY_COLORS[cat] ?? "bg-gray-100 text-gray-600";
}

interface PhaseConfig {
    key: keyof RoadmapPhases;
    label: string;
    description: string;
    headerBg: string;
    connectorColor: string;
    skillsBorder: string;
    skillsBg: string;
    icon: string;
}

const PHASES: PhaseConfig[] = [
    {
        key: "phase_1_core",
        label: "Phase 1 — Foundation",
        description: "Prerequisite skills to learn first",
        headerBg: "bg-amber-500",
        connectorColor: "bg-amber-300",
        skillsBorder: "border-amber-100",
        skillsBg: "bg-amber-50/50",
        icon: "🔑",
    },
    {
        key: "phase_2_primary",
        label: "Phase 2 — Core Gaps",
        description: "High-priority skills required by the job",
        headerBg: "bg-[#1e3a8a]",
        connectorColor: "bg-blue-300",
        skillsBorder: "border-blue-100",
        skillsBg: "bg-blue-50/50",
        icon: "🎯",
    },
    {
        key: "phase_3_advanced",
        label: "Phase 3 — Advanced",
        description: "Preferred or nice-to-have skills",
        headerBg: "bg-slate-600",
        connectorColor: "bg-slate-300",
        skillsBorder: "border-slate-200",
        skillsBg: "bg-slate-50",
        icon: "⭐",
    },
];

const STATUS_STYLES: Record<NodeStatus, {
    card: string;
    text: string;
    badge: string;
    badgeText: string;
}> = {
    not_started: {
        card: "bg-white border-slate-200 hover:border-slate-400 hover:shadow-md",
        text: "text-slate-800",
        badge: "bg-slate-100 text-slate-500",
        badgeText: "Not started",
    },
    in_progress: {
        card: "bg-amber-50 border-amber-400 hover:shadow-md",
        text: "text-amber-900",
        badge: "bg-amber-100 text-amber-700",
        badgeText: "⏳ In Progress",
    },
    done: {
        card: "bg-green-50 border-green-500",
        text: "text-green-900",
        badge: "bg-green-100 text-green-700",
        badgeText: "✓ Done",
    },
};

// ── SkillNode ──────────────────────────────────────────────────────────────────

function SkillNode({
    skill,
    status,
    onToggle,
}: {
    skill: RoadmapSkillItem;
    status: NodeStatus;
    onToggle: () => void;
}) {
    const s = STATUS_STYLES[status];
    return (
        <button
            onClick={onToggle}
            title="Click to cycle status"
            className={`group w-full rounded-xl border-2 p-3.5 text-left transition-all duration-150 cursor-pointer shadow-sm active:scale-[0.98] ${s.card}`}
        >
            <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`text-sm font-semibold leading-snug ${s.text}`}>
                    {skill.name}
                </span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap ${s.badge}`}>
                    {s.badgeText}
                </span>
            </div>

            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${catColor(skill.category)}`}>
                {skill.category}
            </span>

            {skill.subtopics.length > 0 && (
                <ul className="mt-2.5 space-y-1">
                    {skill.subtopics.slice(0, 4).map((t) => (
                        <li key={t} className={`flex items-center gap-1.5 text-[11px] ${s.text} opacity-70`}>
                            <span className="h-1 w-1 shrink-0 rounded-full bg-current opacity-50" />
                            {t}
                        </li>
                    ))}
                    {skill.subtopics.length > 4 && (
                        <li className={`text-[11px] ${s.text} opacity-40`}>
                            +{skill.subtopics.length - 4} more
                        </li>
                    )}
                </ul>
            )}
        </button>
    );
}

// ── Phase section ──────────────────────────────────────────────────────────────

function PhaseSection({
    config,
    skills,
    progress,
    onToggle,
    isFirst,
}: {
    config: PhaseConfig;
    skills: RoadmapSkillItem[];
    progress: ProgressMap;
    onToggle: (id: string) => void;
    isFirst: boolean;
}) {
    if (skills.length === 0) return null;

    const doneCount = skills.filter((s) => progress[s.canonical_id] === "done").length;
    const inProgCount = skills.filter((s) => progress[s.canonical_id] === "in_progress").length;
    const pct = Math.round((doneCount / skills.length) * 100);

    return (
        <div className="w-full">
            {/* ── Connector from previous phase (arrow down) ── */}
            {!isFirst && (
                <div className="flex flex-col items-center">
                    <div className="w-0.5 h-8 bg-slate-300" />
                    <svg viewBox="0 0 14 9" width="14" height="9" fill="currentColor" className="text-slate-300">
                        <path d="M7 9L0 0h14z" />
                    </svg>
                    <div className="w-0.5 h-4 bg-slate-300" />
                </div>
            )}

            {/* ── Phase header node ── */}
            <div className="flex justify-center">
                <div
                    className={`${config.headerBg} text-white rounded-2xl px-8 py-5 shadow-lg w-full max-w-md text-center`}
                >
                    <div className="flex items-center justify-center gap-2.5 mb-1">
                        <span className="text-2xl">{config.icon}</span>
                        <span className="text-base font-bold">{config.label}</span>
                    </div>
                    <p className="text-xs opacity-75 mb-3">{config.description}</p>

                    {/* Phase progress bar */}
                    <div className="h-1.5 rounded-full bg-white/25 overflow-hidden">
                        <div
                            className="h-1.5 rounded-full bg-white transition-all duration-500"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                    <p className="mt-1.5 text-[11px] opacity-60">
                        {doneCount} of {skills.length} done
                        {inProgCount > 0 && ` · ${inProgCount} in progress`}
                    </p>
                </div>
            </div>

            {/* ── Connector to skill grid ── */}
            <div className="flex justify-center">
                <div className={`w-0.5 h-6 ${config.connectorColor}`} />
            </div>

            {/* ── Skills grid ── */}
            <div className={`rounded-2xl border p-4 ${config.skillsBorder} ${config.skillsBg}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {skills.map((skill) => (
                        <SkillNode
                            key={skill.canonical_id}
                            skill={skill}
                            status={progress[skill.canonical_id] ?? "not_started"}
                            onToggle={() => onToggle(skill.canonical_id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Overall progress bar ───────────────────────────────────────────────────────

function OverallProgress({
    roadmap,
    progress,
    onReset,
}: {
    roadmap: RoadmapPhases;
    progress: ProgressMap;
    onReset: () => void;
}) {
    const all = [
        ...roadmap.phase_1_core,
        ...roadmap.phase_2_primary,
        ...roadmap.phase_3_advanced,
    ];
    const total = all.length;
    const done = all.filter((s) => progress[s.canonical_id] === "done").length;
    const inProg = all.filter((s) => progress[s.canonical_id] === "in_progress").length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-700">Overall Progress</span>
                <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-slate-900">{pct}%</span>
                    {(done > 0 || inProg > 0) && (
                        <button
                            onClick={onReset}
                            className="text-xs text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                    className="h-2.5 rounded-full bg-linear-to-r from-amber-400 via-blue-500 to-green-500 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    {done} done
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    {inProg} in progress
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-slate-200" />
                    {total - done - inProg} not started
                </span>
            </div>
        </div>
    );
}

// ── No roadmap state ───────────────────────────────────────────────────────────

function NoRoadmap() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 text-5xl">🗺️</div>
            <h2 className="text-xl font-semibold text-slate-800">No roadmap yet</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
                Run a skill gap analysis first — your personalised learning roadmap will appear here.
            </p>
            <Link href="/candidate/upload">
                <button className="mt-6 rounded-lg bg-[#1e3a8a] px-5 py-2.5 text-sm font-medium text-white cursor-pointer">
                    Go to Skill Gap Analyzer
                </button>
            </Link>
        </div>
    );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function LearningRoadmapPage() {
    const [roadmap, setRoadmap] = useState<RoadmapPhases | null>(null);
    const [progress, setProgress] = useState<ProgressMap>({});
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const result = loadAnalysisResult();
        if (result?.roadmap) {
            setRoadmap(result.roadmap);
        }
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setProgress(JSON.parse(saved));
        } catch { /* ignore */ }
        setIsHydrated(true);
    }, []);

    const handleToggle = (id: string) => {
        setProgress((prev) => {
            const next = cycleStatus(prev[id] ?? "not_started");
            const updated = { ...prev, [id]: next };
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
            return updated;
        });
    };

    const handleReset = () => {
        setProgress({});
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    };

    if (!isHydrated) {
        return (
            <div className="space-y-6 p-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 w-full animate-pulse rounded-2xl bg-slate-100" />
                ))}
            </div>
        );
    }

    if (!roadmap) return <NoRoadmap />;

    const visiblePhases = PHASES.filter((p) => roadmap[p.key].length > 0);

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
            <div className="mx-auto max-w-3xl space-y-5">
                {/* ── Header ── */}
                <header className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                            Learning Roadmap
                        </h1>
                        <p className="mt-0.5 text-sm text-slate-500">
                            Personalised 3-phase plan based on your skill gap analysis.
                        </p>
                    </div>
                    <Link href="/candidate/skill-gap">
                        <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer">
                            ← Back to Results
                        </button>
                    </Link>
                </header>

                {/* ── Interaction legend ── */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Click any skill to track:</span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-3.5 w-3.5 rounded border-2 border-slate-200 bg-white" />
                        Not started
                    </span>
                    <span className="text-slate-300">→</span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-3.5 w-3.5 rounded border-2 border-amber-400 bg-amber-50" />
                        In progress
                    </span>
                    <span className="text-slate-300">→</span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-3.5 w-3.5 rounded border-2 border-green-500 bg-green-50" />
                        Done
                    </span>
                </div>

                {/* ── Overall progress ── */}
                <OverallProgress
                    roadmap={roadmap}
                    progress={progress}
                    onReset={handleReset}
                />

                {/* ── Roadmap flow ── */}
                <div className="flex flex-col items-stretch">
                    {/* Start node */}
                    <div className="flex justify-center mb-0">
                        <div className="rounded-full border-2 border-slate-300 bg-white px-5 py-2 text-xs font-semibold text-slate-500 shadow-sm">
                            START
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-0.5 h-8 bg-slate-300" />
                    </div>

                    {visiblePhases.map((cfg, idx) => (
                        <PhaseSection
                            key={cfg.key}
                            config={cfg}
                            skills={roadmap[cfg.key]}
                            progress={progress}
                            onToggle={handleToggle}
                            isFirst={idx === 0}
                        />
                    ))}

                    {/* End node */}
                    <div className="flex justify-center mt-0">
                        <div className="w-0.5 h-8 bg-slate-300" />
                    </div>
                    <div className="flex justify-center">
                        <div className="rounded-full border-2 border-green-500 bg-green-50 px-5 py-2 text-xs font-bold text-green-700 shadow-sm">
                            🎉 JOB READY
                        </div>
                    </div>
                </div>

                {/* ── CTAs ── */}
                <div className="flex flex-wrap gap-3 pb-6 pt-2">
                    <Link href="/candidate/skill-gap">
                        <button className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer">
                            ← Back to Skill Gap Results
                        </button>
                    </Link>
                    <Link href="/candidate/upload">
                        <button className="rounded-lg bg-[#1e3a8a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1e3a8a]/90 cursor-pointer">
                            Analyze Another JD
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
