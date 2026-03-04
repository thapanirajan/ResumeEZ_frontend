"use client"

import { useState } from "react"
import {
    FileText,
    ChevronRight,
    CheckCircle2,
    Loader2,
    AlertCircle,
    Plus,
    ScanSearch,
    ChevronDown,
    ChevronUp,
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
}

function categoryColor(cat: string) {
    return CATEGORY_COLORS[cat] ?? "bg-gray-100 text-gray-600"
}

function scoreTextColor(pct: number) {
    if (pct >= 80) return "text-emerald-600"
    if (pct >= 60) return "text-[#1e3a8a]"
    if (pct >= 40) return "text-amber-500"
    return "text-red-500"
}

function scoreBarColor(pct: number) {
    if (pct >= 80) return "bg-emerald-500"
    if (pct >= 60) return "bg-[#1e3a8a]"
    if (pct >= 40) return "bg-amber-500"
    return "bg-red-500"
}

function scoreLabel(pct: number) {
    if (pct >= 80) return "Strong match"
    if (pct >= 60) return "Good match"
    if (pct >= 40) return "Moderate match"
    return "Low match"
}

// ── Skill cards ───────────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: string }) {
    return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryColor(category)}`}>
            {category}
        </span>
    )
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
                    <span className="text-[10px] text-emerald-600">{skill.years}yr exp</span>
                )}
            </div>
        </li>
    )
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
    )
}

function ExtraSkillCard({ skill }: { skill: ExtraSkillItem }) {
    return (
        <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            <span className="text-sm font-medium text-slate-700">{skill.name}</span>
            <div className="mt-1.5">
                <CategoryBadge category={skill.category} />
            </div>
        </li>
    )
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
    )
}

// ── Resume picker step ────────────────────────────────────────────────────────

function ResumePicker({
    resumes,
    loading,
    selectedId,
    onSelect,
    onAnalyze,
    analyzing,
}: {
    resumes: Resume[]
    loading: boolean
    selectedId: string | null
    onSelect: (id: string) => void
    onAnalyze: () => void
    analyzing: boolean
}) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <p className="text-sm">Loading your resumes…</p>
            </div>
        )
    }

    if (resumes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-700">No resumes found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Create a resume first to check your match.</p>
                </div>
                <Link
                    href="/candidate/resume/create"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Create a Resume
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-slate-500">Select a resume to compare against this job description:</p>
            <div className="space-y-2">
                {resumes.map((resume) => {
                    const isSelected = selectedId === resume.id
                    return (
                        <button
                            key={resume.id}
                            type="button"
                            onClick={() => onSelect(resume.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${
                                isSelected
                                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                        >
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? "bg-primary/10" : "bg-slate-100"
                            }`}>
                                <FileText className={`w-4 h-4 ${isSelected ? "text-primary" : "text-slate-400"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold truncate ${isSelected ? "text-primary" : "text-slate-800"}`}>
                                    {resume.title}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {formatDistanceToNow(new Date(resume.created_at), { addSuffix: true })}
                                </p>
                            </div>
                            {isSelected
                                ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                : <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                            }
                        </button>
                    )
                })}
            </div>
            <button
                type="button"
                onClick={onAnalyze}
                disabled={!selectedId || analyzing}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1e3a8a] text-white text-sm font-semibold hover:bg-[#1e3a8a]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {analyzing ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing…
                    </>
                ) : (
                    <>
                        <ScanSearch className="w-4 h-4" />
                        Analyze Match
                    </>
                )}
            </button>
        </div>
    )
}

// ── Results view ──────────────────────────────────────────────────────────────

function AnalysisResults({
    result,
    onReset,
}: {
    result: SkillGapResponse
    onReset: () => void
}) {
    const {
        match_percentage,
        total_jd_skills,
        hard_skill_match,
        soft_skill_match,
        matched_skills,
        missing_skills,
        extra_skills,
        gap_report,
    } = result

    return (
        <div className="space-y-5">
            {/* Score card */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    {/* Big number */}
                    <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 px-6 py-5 sm:w-40 sm:shrink-0">
                        <span className={`text-4xl font-bold ${scoreTextColor(match_percentage)}`}>
                            {match_percentage.toFixed(1)}%
                        </span>
                        <span className="mt-1 text-xs font-medium text-slate-500">
                            {scoreLabel(match_percentage)}
                        </span>
                        <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                            <div
                                className={`h-2 rounded-full transition-all ${scoreBarColor(match_percentage)}`}
                                style={{ width: `${Math.min(match_percentage, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Stats + breakdown */}
                    <div className="flex-1 space-y-4">
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

                        <div className="space-y-2">
                            {hard_skill_match !== null && (
                                <BreakdownBar label="Technical Skills" value={hard_skill_match} />
                            )}
                            {soft_skill_match !== null && (
                                <BreakdownBar label="Soft Skills" value={soft_skill_match} />
                            )}
                        </div>

                        <p className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
                            {gap_report}
                        </p>
                    </div>
                </div>
            </div>

            {/* Skills grid */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">✓</span>
                        <h3 className="text-sm font-semibold text-slate-900">Matched</h3>
                        <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">{matched_skills.length}</span>
                    </div>
                    {matched_skills.length === 0
                        ? <p className="text-sm text-slate-400">No matching skills found.</p>
                        : <ul className="space-y-2">{matched_skills.map((s) => <MatchedSkillCard key={s.canonical_id} skill={s} />)}</ul>
                    }
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">✗</span>
                        <h3 className="text-sm font-semibold text-slate-900">Missing</h3>
                        <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">{missing_skills.length}</span>
                    </div>
                    {missing_skills.length === 0
                        ? <p className="text-sm text-slate-400">No skill gaps — great match!</p>
                        : <ul className="space-y-2">{missing_skills.map((s) => <MissingSkillCard key={s.canonical_id} skill={s} />)}</ul>
                    }
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">+</span>
                        <h3 className="text-sm font-semibold text-slate-900">Additional</h3>
                        <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{extra_skills.length}</span>
                    </div>
                    <p className="mb-2 text-xs text-slate-400">Skills you have that aren't required here.</p>
                    {extra_skills.length === 0
                        ? <p className="text-sm text-slate-400">None detected.</p>
                        : <ul className="space-y-2">{extra_skills.map((s) => <ExtraSkillCard key={s.canonical_id} skill={s} />)}</ul>
                    }
                </section>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
                <Link href="/candidate/learning-roadmap">
                    <button className="rounded-lg bg-[#1e3a8a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1e3a8a]/90">
                        View Learning Roadmap →
                    </button>
                </Link>
                <button
                    onClick={onReset}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                    Analyze with Different Resume
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

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Toggle header */}
            <button
                type="button"
                onClick={handleToggle}
                className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-slate-50 transition-colors text-left"
            >
                <div className="flex items-center gap-2.5">
                    <ScanSearch className="w-5 h-5 text-[#1e3a8a]" />
                    <span className="text-sm font-semibold text-slate-800">Check Resume Match</span>
                    {result && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            result.match_percentage >= 80 ? "bg-emerald-100 text-emerald-700" :
                            result.match_percentage >= 60 ? "bg-blue-100 text-blue-700" :
                            result.match_percentage >= 40 ? "bg-amber-100 text-amber-700" :
                            "bg-red-100 text-red-600"
                        }`}>
                            {result.match_percentage.toFixed(0)}% match
                        </span>
                    )}
                </div>
                {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Body */}
            {expanded && (
                <div className="px-6 pb-6 pt-2 bg-slate-50/50 border-t border-slate-100">
                    {error && (
                        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            <AlertCircle className="w-4 h-4 shrink-0" />
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
