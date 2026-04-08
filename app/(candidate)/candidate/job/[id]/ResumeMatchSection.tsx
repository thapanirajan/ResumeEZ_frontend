"use client"

import { useState } from "react"
import {
    FileText,
    CheckCircle2,
    Loader2,
    AlertCircle,
    Plus,
    ScanSearch,
    ChevronDown,
    ChevronUp,
    Sparkles,
    BookOpen,
    ArrowRight,
    RotateCcw,
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import api from "@/util/api"
import {
    skillGapApi,
    SkillGapResponse,
    MatchedSkillItem,
    MissingSkillItem,
    ExtraSkillItem,
} from "@/services/skill-gap.service"

// ── Types ─────────────────────────────────────────────────────────────────────

type Resume = {
    id: string
    title: string
    created_at: string
    updated_at: string | null
}

type SkillTab = "matched" | "missing" | "extra"

// ── Score config ──────────────────────────────────────────────────────────────

type ScoreConfig = {
    hex: string
    label: string
    labelBg: string
    labelText: string
    barClass: string
    textClass: string
}

function getScoreConfig(pct: number): ScoreConfig {
    if (pct >= 80) return {
        hex: "#10b981",
        label: "Strong Match",
        labelBg: "bg-emerald-100",
        labelText: "text-emerald-700",
        barClass: "bg-emerald-500",
        textClass: "text-emerald-600",
    }
    if (pct >= 60) return {
        hex: "#2563eb",
        label: "Good Match",
        labelBg: "bg-blue-100",
        labelText: "text-blue-700",
        barClass: "bg-blue-500",
        textClass: "text-blue-700",
    }
    if (pct >= 40) return {
        hex: "#f59e0b",
        label: "Moderate Match",
        labelBg: "bg-amber-100",
        labelText: "text-amber-700",
        barClass: "bg-amber-500",
        textClass: "text-amber-600",
    }
    return {
        hex: "#ef4444",
        label: "Low Match",
        labelBg: "bg-red-100",
        labelText: "text-red-600",
        barClass: "bg-red-500",
        textClass: "text-red-600",
    }
}

// ── SVG donut score ───────────────────────────────────────────────────────────

function ScoreDonut({ pct, hex }: { pct: number; hex: string }) {
    const r = 38
    const circ = 2 * Math.PI * r
    const filled = Math.min(pct / 100, 1) * circ

    return (
        <div className="relative inline-flex items-center justify-center w-[88px] h-[88px]">
            <svg width="88" height="88" style={{ transform: "rotate(-90deg)" }} aria-hidden>
                <circle cx="44" cy="44" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle
                    cx="44" cy="44" r={r}
                    fill="none"
                    stroke={hex}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${filled} ${circ - filled}`}
                    style={{ transition: "stroke-dasharray 0.9s cubic-bezier(.4,0,.2,1)" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[22px] font-black leading-none" style={{ color: hex }}>
                    {pct.toFixed(0)}
                </span>
                <span className="text-[10px] font-bold text-slate-400 -mt-0.5">%</span>
            </div>
        </div>
    )
}

// ── Mini progress bar ─────────────────────────────────────────────────────────

function MiniBar({ label, value, barClass }: { label: string; value: number; barClass: string }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500">{label}</span>
                <span className="text-[11px] font-bold text-slate-700">{value.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                    className={`h-full rounded-full ${barClass}`}
                    style={{ width: `${Math.min(value, 100)}%`, transition: "width 0.9s cubic-bezier(.4,0,.2,1)" }}
                />
            </div>
        </div>
    )
}

// ── Category badge ────────────────────────────────────────────────────────────

const CAT_COLORS: Record<string, string> = {
    language:    "bg-blue-50 text-blue-600",
    framework:   "bg-violet-50 text-violet-600",
    tool:        "bg-orange-50 text-orange-600",
    cloud:       "bg-sky-50 text-sky-600",
    database:    "bg-teal-50 text-teal-600",
    ai_ml:       "bg-purple-50 text-purple-600",
    methodology: "bg-slate-100 text-slate-500",
    soft:        "bg-pink-50 text-pink-600",
    api:         "bg-yellow-50 text-yellow-700",
}
function catColor(cat: string) {
    return CAT_COLORS[cat] ?? "bg-gray-100 text-gray-500"
}

// ── Skill chips ───────────────────────────────────────────────────────────────

function MatchedChip({ skill }: { skill: MatchedSkillItem }) {
    return (
        <span
            title={skill.years > 0 ? `${skill.years} yr exp · ${skill.category}` : skill.category}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-800 leading-none"
        >
            <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-500" />
            {skill.name}
            {skill.match_type === "fuzzy" && (
                <span className="text-[9px] font-bold text-amber-500">~</span>
            )}
        </span>
    )
}

function MissingChip({ skill }: { skill: MissingSkillItem }) {
    const isRequired = skill.section === "required"
    return (
        <span
            title={`Priority: ${skill.priority_score.toFixed(1)} · ${skill.category}`}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold leading-none ${
                isRequired
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
        >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isRequired ? "bg-red-500" : "bg-amber-400"}`} />
            {skill.name}
        </span>
    )
}

function ExtraChip({ skill }: { skill: ExtraSkillItem }) {
    return (
        <span
            title={skill.category}
            className={`inline-flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1 text-[12px] font-semibold leading-none ${catColor(skill.category)}`}
        >
            {skill.name}
        </span>
    )
}

// ── Skill tabs ────────────────────────────────────────────────────────────────

function SkillTabs({ matched, missing, extra }: {
    matched: MatchedSkillItem[]
    missing: MissingSkillItem[]
    extra: ExtraSkillItem[]
}) {
    const [tab, setTab] = useState<SkillTab>("matched")

    const tabs = [
        { id: "matched" as SkillTab, label: "Matched", count: matched.length, activeClass: "bg-emerald-600 text-white", inactiveCount: "text-emerald-600" },
        { id: "missing" as SkillTab, label: "Missing", count: missing.length, activeClass: "bg-red-500 text-white", inactiveCount: "text-red-500" },
        { id: "extra"   as SkillTab, label: "Bonus",   count: extra.length,   activeClass: "bg-slate-600 text-white", inactiveCount: "text-slate-500" },
    ]

    return (
        <div>
            {/* Pill tab switcher */}
            <div className="flex gap-1.5 rounded-xl bg-slate-100 p-1">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setTab(t.id)}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 px-2 text-[11px] font-bold transition-all duration-150 ${
                            tab === t.id
                                ? `${t.activeClass} shadow-sm`
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        {t.label}
                        <span className={`rounded-full text-[10px] font-black leading-none px-1.5 py-0.5 ${
                            tab === t.id ? "bg-white/20" : `bg-white ${t.inactiveCount}`
                        }`}>
                            {t.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="mt-3 max-h-[200px] overflow-y-auto">
                {tab === "matched" && (
                    matched.length === 0
                        ? <p className="text-xs text-slate-400 text-center py-6">No matching skills found.</p>
                        : (
                            <div className="flex flex-wrap gap-1.5">
                                {matched.map((s) => <MatchedChip key={s.canonical_id} skill={s} />)}
                            </div>
                        )
                )}

                {tab === "missing" && (
                    missing.length === 0
                        ? (
                            <div className="flex flex-col items-center gap-1 py-6">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <p className="text-xs font-medium text-slate-500">No skill gaps — great fit!</p>
                            </div>
                        )
                        : (
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" /> Required</span>
                                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" /> Preferred</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {missing.map((s) => <MissingChip key={s.canonical_id} skill={s} />)}
                                </div>
                            </div>
                        )
                )}

                {tab === "extra" && (
                    extra.length === 0
                        ? <p className="text-xs text-slate-400 text-center py-6">No additional skills detected.</p>
                        : (
                            <div>
                                <p className="text-[11px] text-slate-400 mb-2">You bring these beyond the job requirements.</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {extra.map((s) => <ExtraChip key={s.canonical_id} skill={s} />)}
                                </div>
                            </div>
                        )
                )}
            </div>
        </div>
    )
}

// ── Resume picker ─────────────────────────────────────────────────────────────

function ResumePicker({ resumes, loading, selectedId, onSelect, onAnalyze, analyzing }: {
    resumes: Resume[]
    loading: boolean
    selectedId: string | null
    onSelect: (id: string) => void
    onAnalyze: () => void
    analyzing: boolean
}) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-10 gap-2.5">
                <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-[#1e3a8a] animate-spin" />
                <p className="text-xs font-medium text-slate-400">Loading your resumes…</p>
            </div>
        )
    }

    if (resumes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-700">No resumes yet</p>
                    <p className="text-xs text-slate-400 mt-0.5">Create one to check your match.</p>
                </div>
                <Link
                    href="/candidate/resume"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#1e3a8a] px-4 py-2 text-xs font-bold text-white hover:bg-[#1e40af] transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Create Resume
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <p className="text-xs font-semibold text-slate-500">Choose a resume to analyze against this job:</p>

            {/* Resume list */}
            <div className="space-y-1.5">
                {resumes.map((resume) => {
                    const sel = selectedId === resume.id
                    return (
                        <button
                            key={resume.id}
                            type="button"
                            onClick={() => onSelect(resume.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-150 ${
                                sel
                                    ? "border-[#1e3a8a] bg-[#1e3a8a]/5"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            }`}
                        >
                            {/* Radio dot */}
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                sel ? "border-[#1e3a8a] bg-[#1e3a8a]" : "border-slate-300"
                            }`}>
                                {sel && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className={`text-xs font-bold truncate ${sel ? "text-[#1e3a8a]" : "text-slate-700"}`}>
                                    {resume.title}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                    {formatDistanceToNow(new Date(resume.updated_at ?? resume.created_at), { addSuffix: true })}
                                </p>
                            </div>

                            <FileText className={`w-4 h-4 shrink-0 ${sel ? "text-[#1e3a8a]" : "text-slate-300"}`} />
                        </button>
                    )
                })}
            </div>

            {/* CTA */}
            <button
                type="button"
                onClick={onAnalyze}
                disabled={!selectedId || analyzing}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1e3a8a] text-white text-sm font-bold hover:bg-[#1e40af] active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
                {analyzing ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing…</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="w-4 h-4" />
                        <span>Analyze Match</span>
                    </>
                )}
            </button>
        </div>
    )
}

// ── Analysis results ──────────────────────────────────────────────────────────

function AnalysisResults({ result, onReset }: { result: SkillGapResponse; onReset: () => void }) {
    const {
        match_percentage,
        total_jd_skills,
        matched_skills,
        missing_skills,
        extra_skills,
        hard_skill_match,
        soft_skill_match,
        gap_report,
    } = result

    const cfg = getScoreConfig(match_percentage)
    const [summaryOpen, setSummaryOpen] = useState(false)

    return (
        <div className="space-y-5">

            {/* ── Score row ── */}
            <div className="flex items-center gap-4">
                <ScoreDonut pct={match_percentage} hex={cfg.hex} />

                <div className="flex-1 min-w-0 space-y-2">
                    {/* Label */}
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${cfg.labelBg} ${cfg.labelText}`}>
                        {cfg.label}
                    </span>

                    {/* Stat pills */}
                    <div className="flex gap-1.5 flex-wrap">
                        <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 leading-none">
                            {total_jd_skills} skills
                        </span>
                        <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700 leading-none">
                            {matched_skills.length} matched
                        </span>
                        <span className="rounded-lg bg-red-50 px-2 py-1 text-[11px] font-bold text-red-600 leading-none">
                            {missing_skills.length} missing
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Breakdown bars ── */}
            {(hard_skill_match !== null || soft_skill_match !== null) && (
                <div className="space-y-2 rounded-xl bg-slate-50 px-3.5 py-3 border border-slate-100">
                    {hard_skill_match !== null && (
                        <MiniBar label="Technical skills" value={hard_skill_match} barClass={cfg.barClass} />
                    )}
                    {soft_skill_match !== null && (
                        <MiniBar label="Soft skills" value={soft_skill_match} barClass={cfg.barClass} />
                    )}
                </div>
            )}

            {/* ── Divider ── */}
            <div className="h-px bg-slate-100" />

            {/* ── Skills tabs ── */}
            <SkillTabs
                matched={matched_skills}
                missing={missing_skills}
                extra={extra_skills}
            />

            {/* ── Divider ── */}
            <div className="h-px bg-slate-100" />

            {/* ── AI Summary (collapsible) ── */}
            <div>
                <button
                    type="button"
                    onClick={() => setSummaryOpen((p) => !p)}
                    className="flex w-full items-center justify-between text-left"
                >
                    <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        <BookOpen className="w-3.5 h-3.5" />
                        AI Summary
                    </span>
                    {summaryOpen
                        ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                        : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    }
                </button>
                {summaryOpen && (
                    <p className="mt-2 text-[13px] leading-relaxed text-slate-600 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3">
                        {gap_report}
                    </p>
                )}
            </div>

            {/* ── Actions ── */}
            <div className="flex flex-col gap-2 pt-1">
                <Link href="/candidate/skill-gap">
                    <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1e40af] transition-colors shadow-sm">
                        <BookOpen className="w-4 h-4" />
                        View Learning Roadmap
                        <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                    </button>
                </Link>
                <button
                    type="button"
                    onClick={onReset}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Try with a different resume
                </button>
            </div>
        </div>
    )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ResumeMatchSection({ jobDescription }: { jobDescription: string }) {
    const [expanded, setExpanded] = useState(false)
    const [resumes, setResumes] = useState<Resume[]>([])
    const [resumesLoaded, setResumesLoaded] = useState(false)
    const [loadingResumes, setLoadingResumes] = useState(false)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [analyzing, setAnalyzing] = useState(false)
    const [result, setResult] = useState<SkillGapResponse | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function handleToggle() {
        if (!expanded && !resumesLoaded) {
            setLoadingResumes(true)
            try {
                const res = await api.get<Resume[]>("/api/resume")
                const data = Array.isArray(res.data) ? res.data : (res.data as any).data ?? []
                setResumes(data)
                setResumesLoaded(true)
            } catch {
                setError("Failed to load resumes. Please try again.")
            } finally {
                setLoadingResumes(false)
            }
        }
        setExpanded((prev) => !prev)
    }

    async function handleAnalyze() {
        if (!selectedId) return
        setAnalyzing(true)
        setError(null)
        try {
            const data = await skillGapApi.analyze(selectedId, jobDescription)
            setResult(data)
        } catch {
            setError("Analysis failed. Please try again.")
        } finally {
            setAnalyzing(false)
        }
    }

    function handleReset() {
        setResult(null)
        setSelectedId(null)
    }

    const cfg = result ? getScoreConfig(result.match_percentage) : null

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

            {/* ── Header toggle ── */}
            <button
                type="button"
                onClick={handleToggle}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                    expanded ? "border-b border-slate-100 bg-slate-50" : "hover:bg-slate-50"
                }`}
            >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1e3a8a]/10">
                    <ScanSearch className="w-4 h-4 text-[#1e3a8a]" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 leading-none">Resume Match</p>
                    {!result
                        ? <p className="text-[11px] text-slate-400 mt-0.5">AI-powered skill gap analysis</p>
                        : <p className="text-[11px] mt-0.5 font-semibold" style={{ color: cfg!.hex }}>
                            {result.match_percentage.toFixed(0)}% — {cfg!.label}
                          </p>
                    }
                </div>

                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
                    expanded ? "bg-slate-200" : "bg-slate-100"
                }`}>
                    {expanded
                        ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                        : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    }
                </div>
            </button>

            {/* ── Body ── */}
            {expanded && (
                <div className="px-4 pb-5 pt-4">
                    {error && (
                        <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                            {error}
                        </div>
                    )}

                    {result ? (
                        <AnalysisResults result={result} onReset={handleReset} />
                    ) : (
                        <ResumePicker
                            resumes={resumes}
                            loading={loadingResumes}
                            selectedId={selectedId}
                            onSelect={setSelectedId}
                            onAnalyze={handleAnalyze}
                            analyzing={analyzing}
                        />
                    )}
                </div>
            )}
        </div>
    )
}
