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
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    ScanSearch,
    Circle,
    Clock,
    Cloud,
    Layers,
    Zap,
    BookOpen,
    Video,
    FileText,
    FlaskConical,
    Code2,
    Sparkles,
    Trophy,
    ExternalLink,
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
import { getProfile, type UserProfileData } from "@/lib/auth.lib";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ── Types ──────────────────────────────────────────────────────────────────────

type ProgressMap = Record<string, NodeStatus>;
const LEGACY_STORAGE_KEY = "roadmap_progress";

type GroqResource = {
    title: string;
    type: string;
    duration: string;
    platform: string;
    url: string;
};

function resourceUrl(r: GroqResource): string {
    if (r.url?.startsWith("http")) return r.url;

    // Platform-aware search fallback
    const q = encodeURIComponent(r.title);
    const p = (r.platform ?? "").toLowerCase();

    if (p.includes("udemy"))       return `https://www.udemy.com/courses/search/?q=${q}`;
    if (p.includes("coursera"))    return `https://www.coursera.org/search?query=${q}`;
    if (p.includes("youtube"))     return `https://www.youtube.com/results?search_query=${q}`;
    if (p.includes("pluralsight")) return `https://www.pluralsight.com/search?q=${q}`;
    if (p.includes("linkedin"))    return `https://www.linkedin.com/learning/search?keywords=${q}`;
    if (p.includes("o'reilly") || p.includes("oreilly")) return `https://www.oreilly.com/search/?q=${q}`;
    if (p.includes("freecodecamp")) return `https://www.freecodecamp.org/news/search/?query=${q}`;
    if (p.includes("official") || p.includes("doc"))
        return `https://www.google.com/search?q=${q}+official+documentation`;

    return `https://www.google.com/search?q=${q}`;
}

type WeekRange = { start: number; end: number };
type WeekRanges = {
    phase_1_core: WeekRange;
    phase_2_primary: WeekRange;
    phase_3_advanced: WeekRange;
    total: number;
};

function cycleStatus(s: NodeStatus): NodeStatus {
    return s === "not_started" ? "in_progress" : s === "in_progress" ? "done" : "not_started";
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function computeWeekRanges(phases: RoadmapPhases): WeekRanges {
    const p1 = Math.max(1, phases.phase_1_core.length);
    const p2 = Math.max(1, phases.phase_2_primary.length);
    const p3 = Math.max(1, phases.phase_3_advanced.length);
    return {
        phase_1_core:    { start: 1,           end: p1 },
        phase_2_primary: { start: p1 + 1,      end: p1 + p2 },
        phase_3_advanced:{ start: p1 + p2 + 1, end: p1 + p2 + p3 },
        total: p1 + p2 + p3,
    };
}

function getPhaseStatus(
    skills: RoadmapSkillItem[],
    progress: ProgressMap
): "complete" | "in_progress" | "not_started" {
    if (skills.length === 0) return "not_started";
    const done  = skills.filter(s => progress[s.canonical_id] === "done").length;
    const inPrg = skills.filter(s => progress[s.canonical_id] === "in_progress").length;
    if (done === skills.length) return "complete";
    if (done > 0 || inPrg > 0) return "in_progress";
    return "not_started";
}

function getInitials(name?: string | null, email?: string): string {
    const src = name?.trim() || email || "U";
    const parts = src.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0]! + parts[parts.length - 1][0]!).toUpperCase();
    return src.slice(0, 2).toUpperCase();
}

// ── CircularProgress ───────────────────────────────────────────────────────────

function CircularProgress({ pct, weeks }: { pct: number; weeks: number }) {
    const R    = 38;
    const sw   = 7;
    const nr   = R - sw / 2;
    const circ = 2 * Math.PI * nr;
    const dash = circ - (pct / 100) * circ;

    return (
        <div className="flex flex-col items-center gap-1.5">
            <div className="relative flex h-[90px] w-[90px] items-center justify-center">
                <svg height={R * 2} width={R * 2} className="absolute -rotate-90">
                    <circle cx={R} cy={R} r={nr} fill="none" stroke="#e2e8f0" strokeWidth={sw} />
                    <circle
                        cx={R} cy={R} r={nr}
                        fill="none"
                        stroke="#f97316"
                        strokeWidth={sw}
                        strokeLinecap="round"
                        strokeDasharray={`${circ} ${circ}`}
                        strokeDashoffset={dash}
                        className="transition-all duration-700"
                    />
                </svg>
                <span className="relative z-10 text-lg font-black text-slate-800 tabular-nums">{pct}%</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-700 text-center leading-tight">Overall Progress</p>
            <p className="text-[10px] text-slate-400 text-center">Duration: {weeks} Weeks</p>
        </div>
    );
}

// ── AvatarInitials ─────────────────────────────────────────────────────────────

function AvatarInitials({ name, email }: { name?: string | null; email?: string }) {
    return (
        <div className="h-[70px] w-[70px] shrink-0 rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {getInitials(name, email)}
        </div>
    );
}

// ── PhaseBadge ─────────────────────────────────────────────────────────────────

function PhaseBadge({ status }: { status: "complete" | "in_progress" | "not_started" }) {
    if (status === "complete") return (
        <Badge variant="success" className="gap-1 text-[10px] px-2 py-0.5">
            <CheckCircle2 className="h-2.5 w-2.5" />Complete
        </Badge>
    );
    if (status === "in_progress") return (
        <Badge variant="warning" className="gap-1 text-[10px] px-2 py-0.5">
            <Clock className="h-2.5 w-2.5" />In Progress
        </Badge>
    );
    return <Badge variant="secondary" className="text-[10px] px-2 py-0.5">Not Started</Badge>;
}

// ── ResourceIcon ───────────────────────────────────────────────────────────────

function ResourceIcon({ type }: { type: string }) {
    const t = type.toLowerCase();
    if (t.includes("video"))  return <Video       className="h-3.5 w-3.5" />;
    if (t.includes("book") || t.includes("ebook")) return <BookOpen className="h-3.5 w-3.5" />;
    if (t.includes("lab"))    return <FlaskConical className="h-3.5 w-3.5" />;
    if (t.includes("tutorial") || t.includes("code")) return <Code2  className="h-3.5 w-3.5" />;
    return <FileText className="h-3.5 w-3.5" />;
}

// ── SkillPill ──────────────────────────────────────────────────────────────────

function SkillPill({
    skill,
    status,
    onToggle,
}: {
    skill: RoadmapSkillItem;
    status: NodeStatus;
    onToggle: () => void;
}) {
    const cardCls: Record<NodeStatus, string> = {
        not_started: "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50",
        in_progress: "bg-amber-50 border-amber-300 text-amber-800 hover:border-amber-400",
        done:        "bg-green-50 border-green-300 text-green-800",
    };
    const dotCls: Record<NodeStatus, string> = {
        not_started: "bg-slate-300",
        in_progress: "bg-amber-400",
        done:        "bg-green-500",
    };

    return (
        <button
            onClick={onToggle}
            title="Click to cycle: Not started → In progress → Done"
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium cursor-pointer transition-all hover:shadow-sm active:scale-[0.97] ${cardCls[status]}`}
        >
            <span className={`h-2 w-2 shrink-0 rounded-full ${dotCls[status]}`} />
            {skill.name}
            {status === "done" && <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-0.5" />}
        </button>
    );
}

// ── Phase configs ──────────────────────────────────────────────────────────────

const PHASE_CONFIGS = [
    {
        key:          "phase_1_core"     as keyof RoadmapPhases,
        label:        "PHASE 1",
        sublabel:     "Foundation",
        description:  "Prerequisite skills to build on",
        labelColor:   "text-[#5b4fcf]",
        activeIconBg: "bg-[#5b4fcf]",
        Icon:         Cloud,
    },
    {
        key:          "phase_2_primary"  as keyof RoadmapPhases,
        label:        "PHASE 2",
        sublabel:     "Core Gaps",
        description:  "High-priority skills required by the job",
        labelColor:   "text-sky-600",
        activeIconBg: "bg-sky-600",
        Icon:         Layers,
    },
    {
        key:          "phase_3_advanced" as keyof RoadmapPhases,
        label:        "PHASE 3",
        sublabel:     "Advanced",
        description:  "Preferred or nice-to-have skills",
        labelColor:   "text-slate-500",
        activeIconBg: "bg-slate-600",
        Icon:         Zap,
    },
] as const;

// ── PhaseCard ──────────────────────────────────────────────────────────────────

function PhaseCard({
    config,
    skills,
    weeks,
    progress,
    onToggle,
    isLast,
}: {
    config: typeof PHASE_CONFIGS[number];
    skills: RoadmapSkillItem[];
    weeks: WeekRange;
    progress: ProgressMap;
    onToggle: (id: string) => void;
    isLast: boolean;
}) {
    const done   = skills.filter(s => progress[s.canonical_id] === "done").length;
    const status = getPhaseStatus(skills, progress);
    const isActive = status !== "not_started";

    // Unique key topics from all skill subtopics
    const keyTopics = Array.from(new Set(skills.flatMap(s => s.subtopics))).slice(0, 4);

    return (
        <div className="relative flex gap-5 pb-8">
            {/* Vertical timeline line connecting to next phase */}
            {!isLast && (
                <div className="absolute left-[25px] top-[52px] bottom-0 w-0.5 bg-slate-200" />
            )}

            {/* Phase icon circle */}
            <div
                className={`relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl shadow-sm transition-colors ${
                    isActive ? config.activeIconBg : "bg-slate-100 border-2 border-slate-200"
                }`}
            >
                <config.Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400"}`} />
            </div>

            {/* Phase content card */}
            <Card className="flex-1 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <CardContent className="p-5">

                    {/* Card header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                            <p className={`text-[11px] font-bold uppercase tracking-widest ${config.labelColor}`}>
                                {config.label} · WEEKS {weeks.start}–{weeks.end}
                            </p>
                            <h3 className="text-[18px] font-bold text-slate-900 mt-0.5 leading-tight">
                                {config.sublabel}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">{config.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <PhaseBadge status={status} />
                            <span className="text-[11px] text-slate-400 tabular-nums">
                                {done}/{skills.length} Modules
                            </span>
                        </div>
                    </div>

                    {/* Skill pills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {skills.map(skill => (
                            <SkillPill
                                key={skill.canonical_id}
                                skill={skill}
                                status={progress[skill.canonical_id] ?? "not_started"}
                                onToggle={() => onToggle(skill.canonical_id)}
                            />
                        ))}
                    </div>

                    {/* Key Topics */}
                    {keyTopics.length > 0 && (
                        <div className="border-t border-slate-100 pt-3.5">
                            <p className="text-xs font-semibold text-slate-700 mb-2.5">Key Topics:</p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                                {keyTopics.map(t => (
                                    <li key={t} className="flex items-center gap-2 text-sm text-slate-600">
                                        <Circle className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// ── RoadmapHistoryTab ──────────────────────────────────────────────────────────

function matchBadgeVariant(pct: number): "success" | "warning" | "destructive" {
    if (pct >= 75) return "success";
    if (pct >= 50) return "warning";
    return "destructive";
}

function RoadmapHistoryTab({ onOpen }: { onOpen: (roadmapId: string) => void }) {
    const [reports, setReports]   = useState<SkillGapReportListItem[]>([]);
    const [loading, setLoading]   = useState(true);
    const [error,   setError]     = useState(false);
    const fetchedRef              = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        skillGapApi
            .getHistory()
            .then(data => setReports(data.filter(r => r.roadmap_id !== null)))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />)}
        </div>
    );

    if (error) return (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Failed to load roadmap history.
        </div>
    );

    if (reports.length === 0) return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <Map className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">No roadmaps yet</h3>
            <p className="mt-1.5 max-w-xs text-sm text-slate-500">
                Run a skill gap analysis to generate your first personalised learning roadmap.
            </p>
            <Link href="/candidate/upload">
                <Button size="sm" className="mt-5 gap-1.5">
                    <ScanSearch className="h-3.5 w-3.5" />Go to Analyzer
                </Button>
            </Link>
        </div>
    );

    return (
        <div className="space-y-3">
            {reports.map(report => (
                <Card key={report.id} className="group hover:shadow-md transition-shadow">
                    <CardContent className="px-5 py-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1e3a8a]/8 border border-[#1e3a8a]/10 group-hover:bg-[#1e3a8a]/12 transition-colors">
                                <Map className="h-4 w-4 text-[#1e3a8a]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">{report.resume_title}</p>
                                <p
                                    className="mt-0.5 text-xs text-slate-400"
                                    title={format(new Date(report.created_at), "PPpp")}
                                >
                                    {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                                </p>
                            </div>
                            <Badge variant={matchBadgeVariant(report.match_percentage)} className="shrink-0 tabular-nums text-[11px]">
                                {report.match_percentage.toFixed(1)}% match
                            </Badge>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="shrink-0 h-8 gap-1 text-xs"
                                onClick={() => onOpen(report.roadmap_id!)}
                            >
                                Open <ChevronRight className="h-3 w-3" />
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
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-slate-100 border border-slate-200 shadow-md">
                <Map className="h-9 w-9 text-[#1e3a8a]/50" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">No roadmap loaded</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
                Run a skill gap analysis or open a previous roadmap from history.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link href="/candidate/upload">
                    <Button className="gap-1.5"><ScanSearch className="h-4 w-4" />New Analysis</Button>
                </Link>
                <Button variant="secondary" className="gap-1.5" onClick={onGoToHistory}>
                    <History className="h-4 w-4" />View History
                </Button>
            </div>
        </div>
    );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function LearningRoadmapPage() {
    const searchParams   = useSearchParams();
    const router         = useRouter();
    const roadmapIdParam = searchParams.get("roadmap_id");

    const [activeTab,       setActiveTab]       = useState<"roadmap" | "history">("roadmap");
    const [roadmap,         setRoadmap]         = useState<RoadmapPhases | null>(null);
    const [roadmapId,       setRoadmapId]       = useState<string | null>(null);
    const [progress,        setProgress]        = useState<ProgressMap>({});
    const [isHydrated,      setIsHydrated]      = useState(false);
    const [isLoadingRoadmap,setIsLoadingRoadmap]= useState(false);
    const [loadError,       setLoadError]       = useState(false);
    const [syncError,       setSyncError]       = useState(false);
    const [dbMode,          setDbMode]          = useState(roadmapIdParam !== null);
    const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Profile + Groq state
    const [profile,          setProfile]         = useState<UserProfileData | null>(null);
    const [resources,        setResources]        = useState<GroqResource[]>([]);
    const [objective,        setObjective]        = useState<string>("");
    const [loadingResources, setLoadingResources] = useState(false);

    // Fetch user profile once
    useEffect(() => {
        getProfile().then(setProfile).catch(() => {});
    }, []);

    // Load roadmap on mount
    useEffect(() => {
        async function load() {
            if (roadmapIdParam) {
                try {
                    const data: LearningRoadmapData = await skillGapApi.getRoadmap(roadmapIdParam);
                    setRoadmapId(data.id);
                    setRoadmap({
                        phase_1_core:     data.phase_1_core,
                        phase_2_primary:  data.phase_2_primary,
                        phase_3_advanced: data.phase_3_advanced,
                    });
                    setProgress(data.skill_progress);
                    setDbMode(true);
                } catch {
                    setLoadError(true);
                }
            } else {
                const result = loadAnalysisResult();
                const hasPhases = (p: RoadmapPhases) =>
                    p.phase_1_core.length + p.phase_2_primary.length + p.phase_3_advanced.length > 0;
                if (result?.roadmap && hasPhases(result.roadmap)) {
                    setRoadmap(result.roadmap);
                    try {
                        const saved = localStorage.getItem(LEGACY_STORAGE_KEY);
                        if (saved) setProgress(JSON.parse(saved));
                    } catch { /* ignore */ }
                    setDbMode(false);
                } else {
                    // Auto-load the latest roadmap from history
                    try {
                        const history = await skillGapApi.getHistory();
                        const latest = history.filter(r => r.roadmap_id !== null)[0];
                        if (latest?.roadmap_id) {
                            const data: LearningRoadmapData = await skillGapApi.getRoadmap(latest.roadmap_id);
                            setRoadmapId(data.id);
                            setRoadmap({
                                phase_1_core:     data.phase_1_core,
                                phase_2_primary:  data.phase_2_primary,
                                phase_3_advanced: data.phase_3_advanced,
                            });
                            setProgress(data.skill_progress);
                            setDbMode(true);
                            router.replace(`/candidate/learning-roadmap?roadmap_id=${latest.roadmap_id}`, { scroll: false } as never);
                        } else {
                            setDbMode(false);
                        }
                    } catch {
                        setDbMode(false);
                    }
                }
            }
            setIsHydrated(true);
        }
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch Groq resources whenever the roadmap data changes
    useEffect(() => {
        if (!roadmap) return;
        const topSkills = [
            ...roadmap.phase_1_core,
            ...roadmap.phase_2_primary,
            ...roadmap.phase_3_advanced,
        ].slice(0, 8).map(s => s.name);

        setLoadingResources(true);
        fetch("/api/groq/resources", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ skills: topSkills }),
        })
            .then(r => r.json())
            .then((data: { resources?: GroqResource[]; objective?: string }) => {
                setResources(data.resources ?? []);
                setObjective(data.objective ?? "");
            })
            .catch(() => {})
            .finally(() => setLoadingResources(false));
    }, [roadmap]);

    // Debounced DB sync
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
        setProgress(prev => {
            const next    = cycleStatus(prev[id] ?? "not_started");
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
                phase_1_core:     data.phase_1_core,
                phase_2_primary:  data.phase_2_primary,
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

    // ── Derived values ─────────────────────────────────────────────────────────
    const allSkills  = roadmap
        ? [...roadmap.phase_1_core, ...roadmap.phase_2_primary, ...roadmap.phase_3_advanced]
        : [];
    const totalDone  = allSkills.filter(s => progress[s.canonical_id] === "done").length;
    const overallPct = allSkills.length > 0 ? Math.round((totalDone / allSkills.length) * 100) : 0;
    const weekRanges = roadmap ? computeWeekRanges(roadmap) : null;
    const displayName = profile?.candidate_profile?.full_name ?? profile?.email ?? "Your Profile";
    const displayRole = profile?.candidate_profile?.current_role ?? "Candidate";

    // ── Loading skeleton ───────────────────────────────────────────────────────
    if (!isHydrated) return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-6">
            <div className="mx-auto max-w-5xl space-y-4">
                <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
                <div className="h-36 animate-pulse rounded-2xl bg-slate-100" />
                {[1, 2, 3].map(i => <div key={i} className="h-48 animate-pulse rounded-xl bg-slate-100" />)}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-6">
            <div className="mx-auto max-w-6xl">

                {/* ── Breadcrumb ──────────────────────────────────────────── */}
                <nav className="mb-5 flex items-center gap-1.5 text-sm text-slate-500">
                    <Link href="/candidate" className="hover:text-slate-700 transition-colors">
                        Dashboard
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                    <span className="font-medium text-slate-900">Learning Roadmap</span>
                </nav>

                {/* ── Error banners ────────────────────────────────────────── */}
                {loadError && (
                    <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        Failed to load the roadmap. It may have been deleted or you may not have access.
                    </div>
                )}
                {syncError && (
                    <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        Progress could not be saved to the server. Changes are shown locally.
                    </div>
                )}

                {/* ── Two-column layout ─────────────────────────────────────── */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* ── Main column ─────────────────────────────────────────── */}
                    <div className="flex-1 min-w-0 space-y-5">

                        {/* Profile hero — shown only when roadmap tab is active and data is loaded */}
                        {roadmap && activeTab === "roadmap" && (
                            <Card className="overflow-hidden shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-5">
                                        <AvatarInitials
                                            name={profile?.candidate_profile?.full_name}
                                            email={profile?.email}
                                        />

                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-xl font-bold text-slate-900 truncate">
                                                {displayName}
                                            </h2>
                                            <p className="text-sm font-semibold text-orange-500 mt-0.5">
                                                {displayRole}
                                            </p>

                                            {/* Objective */}
                                            <div className="mt-3">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                                                    Roadmap Objective
                                                </p>
                                                {loadingResources ? (
                                                    <div className="space-y-1.5">
                                                        <div className="h-3.5 w-full animate-pulse rounded bg-slate-100" />
                                                        <div className="h-3.5 w-3/4 animate-pulse rounded bg-slate-100" />
                                                    </div>
                                                ) : (
                                                    <p className="text-sm italic text-slate-600 leading-relaxed">
                                                        &ldquo;{objective || "Building your skillset to match the target role requirements."}&rdquo;
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Circular progress donut */}
                                        {weekRanges && (
                                            <div className="shrink-0">
                                                <CircularProgress pct={overallPct} weeks={weekRanges.total} />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Tabs */}
                        <Tabs
                            value={activeTab}
                            onValueChange={v => setActiveTab(v as "roadmap" | "history")}
                        >
                            <TabsList>
                                <TabsTrigger value="roadmap" className="cursor-pointer gap-1.5">
                                    <Map className="h-3.5 w-3.5" />Active Roadmap
                                </TabsTrigger>
                                <TabsTrigger value="history" className="cursor-pointer gap-1.5">
                                    <History className="h-3.5 w-3.5" />Roadmap History
                                </TabsTrigger>
                            </TabsList>

                            {/* ── Roadmap tab ─────────────────────────────── */}
                            <TabsContent value="roadmap">
                                {isLoadingRoadmap ? (
                                    <div className="space-y-4 py-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-48 animate-pulse rounded-xl bg-slate-100" />
                                        ))}
                                    </div>
                                ) : !roadmap || loadError ? (
                                    <NoRoadmap onGoToHistory={() => setActiveTab("history")} />
                                ) : (
                                    <div className="pt-5">
                                        {/* Section heading */}
                                        <div className="flex items-center justify-between mb-5">
                                            <h2 className="text-lg font-bold text-slate-900">
                                                Development Milestones
                                            </h2>
                                            <div className="flex items-center gap-3">
                                                {dbMode && (
                                                    <Badge variant="success" className="gap-1 text-[10px]">
                                                        <CheckCircle2 className="h-2.5 w-2.5" />Synced
                                                    </Badge>
                                                )}
                                                {totalDone > 0 && (
                                                    <button
                                                        onClick={handleReset}
                                                        className="text-xs text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                                    >
                                                        Reset progress
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Phase timeline */}
                                        <div className="relative">
                                            {PHASE_CONFIGS.filter(cfg => roadmap[cfg.key].length > 0).map((cfg, idx, arr) => (
                                                <PhaseCard
                                                    key={cfg.key}
                                                    config={cfg}
                                                    skills={roadmap[cfg.key]}
                                                    weeks={weekRanges![cfg.key]}
                                                    progress={progress}
                                                    onToggle={handleToggle}
                                                    isLast={idx === arr.length - 1}
                                                />
                                            ))}
                                        </div>

                                        {/* Job ready pill */}
                                        <div className="flex items-center gap-3 pb-6 pl-[69px]">
                                            <div className="flex items-center gap-2 rounded-full border-2 border-green-400 bg-green-50 px-5 py-2 text-sm font-bold text-green-700 shadow-sm">
                                                <Trophy className="h-4 w-4" />Job Ready
                                            </div>
                                        </div>

                                        {/* Bottom CTA */}
                                        <Link href="/candidate/upload">
                                            <Button variant="secondary" className="gap-1.5">
                                                <ScanSearch className="h-4 w-4" />Analyze Another JD
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </TabsContent>

                            {/* ── History tab ─────────────────────────────── */}
                            <TabsContent value="history">
                                <div className="mb-4 pt-2">
                                    <h2 className="text-base font-semibold text-slate-900">Past Roadmaps</h2>
                                    <p className="mt-0.5 text-sm text-slate-500">
                                        All your previously generated learning roadmaps. Click Open to load one.
                                    </p>
                                </div>
                                <RoadmapHistoryTab onOpen={handleOpenFromHistory} />
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* ── Right sidebar ────────────────────────────────────── */}
                    <div className="w-full lg:w-72 lg:shrink-0">
                        <div className="lg:sticky lg:top-6 space-y-4">

                            {/* Recommended Resources card */}
                            <Card className="shadow-sm overflow-hidden">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Sparkles className="h-4 w-4 text-[#1e3a8a]" />
                                        <h3 className="text-sm font-bold text-slate-900">Recommended Resources</h3>
                                    </div>

                                    {loadingResources ? (
                                        <div className="space-y-4">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="flex gap-3">
                                                    <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-slate-100" />
                                                    <div className="flex-1 space-y-1.5">
                                                        <div className="h-3.5 w-full animate-pulse rounded bg-slate-100" />
                                                        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : resources.length > 0 ? (
                                        <div className="space-y-1">
                                            {resources.map((r, i) => (
                                                <a
                                                    key={i}
                                                    href={resourceUrl(r)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-start gap-3 group rounded-xl p-2.5 -mx-2.5 hover:bg-slate-50 transition-colors"
                                                >
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-[#1e3a8a]/10 group-hover:text-[#1e3a8a] transition-colors mt-0.5">
                                                        <ResourceIcon type={r.type} />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-[#1e3a8a] transition-colors">
                                                            {r.title}
                                                        </p>
                                                        <p className="text-xs text-slate-400 mt-0.5">
                                                            {r.type} · {r.duration}
                                                        </p>
                                                        {r.platform && (
                                                            <p className="text-xs text-slate-400">{r.platform}</p>
                                                        )}
                                                    </div>
                                                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-300 group-hover:text-[#1e3a8a] transition-colors mt-1" />
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="py-3 text-center text-xs text-slate-400">
                                            {roadmap
                                                ? "Add a GROQ_API_KEY to enable AI-curated resources."
                                                : "Load a roadmap to see AI-curated resources."}
                                        </p>
                                    )}

                                    {resources.length > 0 && (
                                        <div className="mt-4 border-t border-slate-100 pt-3">
                                            <p className="flex items-center gap-1 text-[10px] text-slate-400">
                                                <Sparkles className="h-2.5 w-2.5" />
                                                Curated by AI based on your skill gaps
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* CTA card — dark navy */}
                            <div className="rounded-2xl bg-[#1c2d4a] p-5 text-white shadow-md">
                                <h3 className="text-[15px] font-bold mb-1.5">Ready to Start?</h3>
                                <p className="text-sm text-slate-300 leading-relaxed mb-5">
                                    {roadmap
                                        ? "Click any skill pill to track your progress. Changes are saved automatically."
                                        : "Run a skill gap analysis to generate a personalised roadmap for your target role."}
                                </p>
                                <Link href="/candidate/upload" className="block">
                                    <button className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition-colors px-4 py-2.5 text-sm font-bold text-white shadow-sm active:scale-[0.98]">
                                        {roadmap ? "Analyze Another JD" : "Start New Analysis"}
                                    </button>
                                </Link>
                                <button
                                    onClick={() => setActiveTab("history")}
                                    className="mt-2.5 w-full py-1 text-sm text-slate-400 hover:text-white transition-colors"
                                >
                                    View History
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
