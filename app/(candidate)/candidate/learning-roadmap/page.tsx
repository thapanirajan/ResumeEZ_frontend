"use client";

import {
    useEffect,
    useState,
    useCallback,
    useRef,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import {
    Map,
    History,
    FileText,
    ChevronRight,
    AlertCircle,
    Loader2,
    CheckCircle2,
    ScanSearch,
} from "lucide-react";

import {
    RoadmapSkillItem,
    RoadmapPhases,
    NodeStatus,
    LearningRoadmapData,
    SkillGapReportListItem,
    loadAnalysisResult,
    skillGapApi,
} from "@/services/skill-gap.service";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ── Types ──────────────────────────────────────────────────────────────────────

type ProgressMap = Record<string, NodeStatus>;
const LEGACY_STORAGE_KEY = "roadmap_progress";

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
                <span className={`text-sm font-semibold leading-snug ${s.text}`}>{skill.name}</span>
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
                        <li className={`text-[11px] ${s.text} opacity-40`}>+{skill.subtopics.length - 4} more</li>
                    )}
                </ul>
            )}
        </button>
    );
}

// ── PhaseSection ───────────────────────────────────────────────────────────────

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
            {!isFirst && (
                <div className="flex flex-col items-center">
                    <div className="w-0.5 h-8 bg-slate-300" />
                    <svg viewBox="0 0 14 9" width="14" height="9" fill="currentColor" className="text-slate-300">
                        <path d="M7 9L0 0h14z" />
                    </svg>
                    <div className="w-0.5 h-4 bg-slate-300" />
                </div>
            )}
            <div className="flex justify-center">
                <div className={`${config.headerBg} text-white rounded-2xl px-8 py-5 shadow-lg w-full max-w-md text-center`}>
                    <div className="flex items-center justify-center gap-2.5 mb-1">
                        <span className="text-2xl">{config.icon}</span>
                        <span className="text-base font-bold">{config.label}</span>
                    </div>
                    <p className="text-xs opacity-75 mb-3">{config.description}</p>
                    <div className="h-1.5 rounded-full bg-white/25 overflow-hidden">
                        <div className="h-1.5 rounded-full bg-white transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-1.5 text-[11px] opacity-60">
                        {doneCount} of {skills.length} done
                        {inProgCount > 0 && ` · ${inProgCount} in progress`}
                    </p>
                </div>
            </div>
            <div className="flex justify-center">
                <div className={`w-0.5 h-6 ${config.connectorColor}`} />
            </div>
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

// ── OverallProgress ────────────────────────────────────────────────────────────

function OverallProgress({
    roadmap,
    progress,
    onReset,
    dbMode,
}: {
    roadmap: RoadmapPhases;
    progress: ProgressMap;
    onReset: () => void;
    dbMode: boolean;
}) {
    const all = [...roadmap.phase_1_core, ...roadmap.phase_2_primary, ...roadmap.phase_3_advanced];
    const total = all.length;
    const done = all.filter((s) => progress[s.canonical_id] === "done").length;
    const inProg = all.filter((s) => progress[s.canonical_id] === "in_progress").length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    return (
        <Card>
            <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-700">Overall Progress</span>
                        {dbMode && (
                            <Badge variant="success" className="text-[10px] px-2 py-0.5 gap-1">
                                <CheckCircle2 className="h-2.5 w-2.5" />
                                Synced
                            </Badge>
                        )}
                    </div>
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
                        <span className="h-2 w-2 rounded-full bg-green-500" />{done} done
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-400" />{inProg} in progress
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-slate-200" />{total - done - inProg} not started
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

// ── RoadmapHistoryTab ──────────────────────────────────────────────────────────

function RoadmapHistoryTab({ onOpen }: { onOpen: (roadmapId: string) => void }) {
    const [reports, setReports] = useState<SkillGapReportListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        skillGapApi
            .getHistory()
            .then((data) => setReports(data.filter((r) => r.roadmap_id !== null)))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Failed to load roadmap history.
            </div>
        );
    }

    if (reports.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                    <Map className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">No roadmaps yet</h3>
                <p className="mt-1.5 max-w-xs text-sm text-slate-500">
                    Run a skill gap analysis to generate your first personalised learning roadmap.
                </p>
                <Link href="/candidate/upload">
                    <Button size="sm" className="mt-5 gap-1.5">
                        <ScanSearch className="h-3.5 w-3.5" />
                        Go to Analyzer
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {reports.map((report) => (
                <Card key={report.id} className="group transition-shadow hover:shadow-md">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1e3a8a]/10 group-hover:bg-[#1e3a8a]/15 transition-colors">
                                <Map className="h-4 w-4 text-[#1e3a8a]" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-900">
                                            {report.resume_title}
                                        </p>
                                        <p
                                            className="mt-0.5 text-xs text-slate-400"
                                            title={format(new Date(report.created_at), "PPpp")}
                                        >
                                            {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-sm font-bold text-slate-700">
                                            {report.match_percentage.toFixed(1)}% match
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                size="sm"
                                variant="secondary"
                                className="shrink-0 h-8 gap-1.5 text-xs"
                                onClick={() => onOpen(report.roadmap_id!)}
                            >
                                <ChevronRight className="h-3 w-3" />
                                Open
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// ── No roadmap empty state ─────────────────────────────────────────────────────

function NoRoadmap({ onGoToHistory }: { onGoToHistory: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <Map className="h-7 w-7 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">No roadmap loaded</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
                Run a skill gap analysis or open a previous roadmap from history.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link href="/candidate/upload">
                    <Button className="gap-1.5">
                        <ScanSearch className="h-4 w-4" />
                        New Analysis
                    </Button>
                </Link>
                <Button variant="secondary" className="gap-1.5" onClick={onGoToHistory}>
                    <History className="h-4 w-4" />
                    View History
                </Button>
            </div>
        </div>
    );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function LearningRoadmapPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const roadmapIdParam = searchParams.get("roadmap_id");

    const [activeTab, setActiveTab] = useState<"roadmap" | "history">("roadmap");
    const [roadmap, setRoadmap] = useState<RoadmapPhases | null>(null);
    const [roadmapId, setRoadmapId] = useState<string | null>(null);
    const [progress, setProgress] = useState<ProgressMap>({});
    const [isHydrated, setIsHydrated] = useState(false);
    const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const [syncError, setSyncError] = useState(false);

    // True when progress should sync to DB (roadmap was loaded from API)
    const [dbMode, setDbMode] = useState(roadmapIdParam !== null);
    const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Initial load on mount (URL param only — history opens are handled separately)
    useEffect(() => {
        async function load() {
            if (roadmapIdParam) {
                try {
                    const data: LearningRoadmapData = await skillGapApi.getRoadmap(roadmapIdParam);
                    setRoadmapId(data.id);
                    setRoadmap({
                        phase_1_core: data.phase_1_core,
                        phase_2_primary: data.phase_2_primary,
                        phase_3_advanced: data.phase_3_advanced,
                    });
                    setProgress(data.skill_progress);
                    setDbMode(true);
                } catch {
                    setLoadError(true);
                }
            } else {
                const result = loadAnalysisResult();
                if (result?.roadmap) setRoadmap(result.roadmap);
                try {
                    const saved = localStorage.getItem(LEGACY_STORAGE_KEY);
                    if (saved) setProgress(JSON.parse(saved));
                } catch { /* ignore */ }
                setDbMode(false);
            }
            setIsHydrated(true);
        }
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once on mount — history opens update state directly

    // Debounced DB progress sync
    const persistProgress = useCallback(
        (updated: ProgressMap) => {
            if (!roadmapId) return;
            if (syncTimer.current) clearTimeout(syncTimer.current);
            syncTimer.current = setTimeout(async () => {
                try {
                    await skillGapApi.updateRoadmapProgress(roadmapId, updated);
                    setSyncError(false);
                } catch {
                    setSyncError(true);
                }
            }, 800);
        },
        [roadmapId]
    );

    const handleToggle = (id: string) => {
        setProgress((prev) => {
            const next = cycleStatus(prev[id] ?? "not_started");
            const updated = { ...prev, [id]: next };
            if (dbMode) persistProgress(updated);
            else {
                try { localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
            }
            return updated;
        });
    };

    const handleReset = () => {
        setProgress({});
        if (dbMode && roadmapId) {
            skillGapApi.updateRoadmapProgress(roadmapId, {}).catch(() => setSyncError(true));
        } else {
            try { localStorage.removeItem(LEGACY_STORAGE_KEY); } catch { /* ignore */ }
        }
    };

    // Open a roadmap from history — load data directly, switch tab, update URL
    const handleOpenFromHistory = useCallback(async (rmId: string) => {
        setActiveTab("roadmap");
        setIsLoadingRoadmap(true);
        setLoadError(false);
        setRoadmap(null);
        setProgress({});
        setSyncError(false);
        try {
            const data = await skillGapApi.getRoadmap(rmId);
            setRoadmapId(data.id);
            setRoadmap({
                phase_1_core: data.phase_1_core,
                phase_2_primary: data.phase_2_primary,
                phase_3_advanced: data.phase_3_advanced,
            });
            setProgress(data.skill_progress);
            setDbMode(true);
            router.replace(`/candidate/learning-roadmap?roadmap_id=${rmId}`, { scroll: false } as never);
        } catch {
            setLoadError(true);
        } finally {
            setIsLoadingRoadmap(false);
        }
    }, [router]);

    // ── Loading skeleton
    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
                <div className="mx-auto max-w-3xl space-y-4">
                    <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200" />
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-100" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
            <div className="mx-auto max-w-6xl space-y-5">

                {/* ── Page header ─────────────────────────────────────── */}
                <header className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1e3a8a]/10">
                                <Map className="h-5 w-5 text-[#1e3a8a]" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                                Learning Roadmap
                            </h1>
                        </div>
                        <p className="text-sm text-slate-500">
                            Personalised 3-phase plan based on your skill gap analysis.
                        </p>
                    </div>
                    <Link href="/candidate/upload">
                        <Button variant="secondary" size="sm">
                            ← Back to Analyzer
                        </Button>
                    </Link>
                </header>

                {/* ── Load error ───────────────────────────────────────── */}
                {loadError && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        Failed to load the roadmap. It may have been deleted or you may not have access.
                    </div>
                )}

                {/* ── Sync error banner ────────────────────────────────── */}
                {syncError && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        Progress could not be saved to the server. Changes are shown locally.
                    </div>
                )}

                {/* ── Tabs ─────────────────────────────────────────────── */}
                <Tabs
                    value={activeTab}
                    onValueChange={(v) => setActiveTab(v as "roadmap" | "history")}
                >
                    <TabsList>
                        <TabsTrigger value="roadmap" className="cursor-pointer">
                            <Map className="h-3.5 w-3.5" />
                            Active Roadmap
                        </TabsTrigger>
                        <TabsTrigger value="history" className="cursor-pointer">
                            <History className="h-3.5 w-3.5" />
                            Roadmap History
                        </TabsTrigger>
                    </TabsList>

                    {/* ── Active Roadmap tab ────────────────────────────── */}
                    <TabsContent value="roadmap">
                        {isLoadingRoadmap ? (
                            <div className="space-y-4 py-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-100" />
                                ))}
                            </div>
                        ) : !roadmap || loadError ? (
                            <NoRoadmap onGoToHistory={() => setActiveTab("history")} />
                        ) : (
                            <div className="space-y-5">

                                {/* Interaction legend */}
                                <Card>
                                    <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-xs text-slate-500">
                                        <span className="font-semibold text-slate-700">Click any skill to track:</span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="h-3.5 w-3.5 rounded border-2 border-slate-200 bg-white" />Not started
                                        </span>
                                        <span className="text-slate-300">→</span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="h-3.5 w-3.5 rounded border-2 border-amber-400 bg-amber-50" />In progress
                                        </span>
                                        <span className="text-slate-300">→</span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="h-3.5 w-3.5 rounded border-2 border-green-500 bg-green-50" />Done
                                        </span>
                                    </CardContent>
                                </Card>

                                {/* Overall progress */}
                                <OverallProgress
                                    roadmap={roadmap}
                                    progress={progress}
                                    onReset={handleReset}
                                    dbMode={dbMode}
                                />

                                {/* Roadmap flow */}
                                <div className="flex flex-col items-stretch">
                                    <div className="flex justify-center">
                                        <div className="rounded-full border-2 border-slate-300 bg-white px-5 py-2 text-xs font-semibold text-slate-500 shadow-sm">
                                            START
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="w-0.5 h-8 bg-slate-300" />
                                    </div>

                                    {PHASES.filter((p) => roadmap[p.key].length > 0).map((cfg, idx) => (
                                        <PhaseSection
                                            key={cfg.key}
                                            config={cfg}
                                            skills={roadmap[cfg.key]}
                                            progress={progress}
                                            onToggle={handleToggle}
                                            isFirst={idx === 0}
                                        />
                                    ))}

                                    <div className="flex justify-center mt-0">
                                        <div className="w-0.5 h-8 bg-slate-300" />
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="rounded-full border-2 border-green-500 bg-green-50 px-5 py-2 text-xs font-bold text-green-700 shadow-sm">
                                            🎉 JOB READY
                                        </div>
                                    </div>
                                </div>

                                {/* CTAs */}
                                <div className="flex flex-wrap gap-3 pb-4">
                                    <Link href="/candidate/upload">
                                        <Button variant="secondary" className="gap-1.5">
                                            <ScanSearch className="h-4 w-4" />
                                            Analyze Another JD
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    {/* ── Roadmap History tab ───────────────────────────── */}
                    <TabsContent value="history">
                        <div className="mb-4">
                            <h2 className="text-base font-semibold text-slate-900">Past Roadmaps</h2>
                            <p className="mt-0.5 text-sm text-slate-500">
                                All your previously generated learning roadmaps. Click Open to load one.
                            </p>
                        </div>
                        <RoadmapHistoryTab onOpen={handleOpenFromHistory} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
