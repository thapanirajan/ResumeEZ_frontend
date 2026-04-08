"use client"

import { useState, useCallback } from "react"
import {
    X,
    CheckCircle2,
    XCircle,
    MinusCircle,
    ChevronDown,
    ChevronUp,
    Sparkles,
    User,
    Loader2,
    Star,
    BarChart2,
} from "lucide-react"
import { toast } from "sonner"

import { ApplicationAnalysis, ApplicationStatus } from "@/types/application"
import { ExternalApplicationStatus } from "../../actions"
import { updateApplicationStatusAction, updateExternalApplicationStatusAction } from "../../actions"
import ScoreRing from "./ScoreRing"

// ── Types ──────────────────────────────────────────────────────────────────────

type PlatformApplicant = {
    kind: "platform"
    data: {
        id: string
        candidate_name: string | null
        candidate_email: string | null
        status: ApplicationStatus
    }
}
type ExternalApplicant = {
    kind: "external"
    data: {
        id: string
        candidate_name: string
        candidate_email: string | null
        source: string
        status: ExternalApplicationStatus
    }
}
type AnyApplicant = PlatformApplicant | ExternalApplicant

interface Props {
    applicant: AnyApplicant
    analysis: ApplicationAnalysis
    jobTitle: string
    onClose: () => void
    onStatusChange?: (id: string, status: string) => void
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
    language:    "bg-blue-50 text-blue-600 border border-blue-100",
    framework:   "bg-indigo-50 text-indigo-600 border border-indigo-100",
    tool:        "bg-orange-50 text-orange-600 border border-orange-100",
    cloud:       "bg-sky-50 text-sky-600 border border-sky-100",
    database:    "bg-emerald-50 text-emerald-600 border border-emerald-100",
    ai_ml:       "bg-purple-50 text-purple-600 border border-purple-100",
    methodology: "bg-slate-50 text-slate-500 border border-slate-100",
    soft:        "bg-pink-50 text-pink-600 border border-pink-100",
    api:         "bg-yellow-50 text-yellow-600 border border-yellow-100",
}

function catColor(cat: string) {
    return CATEGORY_COLORS[cat] ?? "bg-gray-50 text-gray-500 border border-gray-100"
}

function SubScoreBar({ label, score }: { label: string; score: number }) {
    const color =
        score >= 80 ? "bg-emerald-400" :
        score >= 60 ? "bg-violet-400" :
        score >= 40 ? "bg-amber-400" : "bg-red-400"
    const textColor =
        score >= 80 ? "text-emerald-600" :
        score >= 60 ? "text-violet-600" :
        score >= 40 ? "text-amber-600" : "text-red-500"
    return (
        <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500">{label}</span>
                <span className={`font-bold tabular-nums ${textColor}`}>{score}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100">
                <div className={`h-1.5 rounded-full transition-all duration-500 ${color}`} style={{ width: `${Math.min(score, 100)}%` }} />
            </div>
        </div>
    )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function CandidateAnalysisModal({ applicant, analysis, jobTitle, onClose, onStatusChange }: Props) {
    const [reasoningOpen, setReasoningOpen] = useState(false)
    const [updatingStatus, setUpdatingStatus] = useState(false)

    const name = applicant.data.candidate_name || "Unknown"
    const email = applicant.data.candidate_email
    const currentStatus = applicant.data.status
    const appId = applicant.data.id

    const handleShortlist = useCallback(async () => {
        const next = currentStatus === "REVIEWING" ? "PENDING" : "REVIEWING"
        setUpdatingStatus(true)
        try {
            if (applicant.kind === "platform") {
                await updateApplicationStatusAction(appId, next as ApplicationStatus)
            } else {
                await updateExternalApplicationStatusAction(appId, next as ExternalApplicationStatus)
            }
            onStatusChange?.(appId, next)
            toast.success(next === "REVIEWING" ? "Candidate shortlisted" : "Removed from shortlist")
        } catch {
            toast.error("Failed to update status")
        } finally {
            setUpdatingStatus(false)
        }
    }, [applicant, appId, currentStatus, onStatusChange])

    const handleReject = useCallback(async () => {
        if (currentStatus === "REJECTED") return
        setUpdatingStatus(true)
        try {
            if (applicant.kind === "platform") {
                await updateApplicationStatusAction(appId, "REJECTED")
            } else {
                await updateExternalApplicationStatusAction(appId, "REJECTED")
            }
            onStatusChange?.(appId, "REJECTED")
            toast.success("Candidate rejected")
            onClose()
        } catch {
            toast.error("Failed to reject")
        } finally {
            setUpdatingStatus(false)
        }
    }, [applicant, appId, currentStatus, onStatusChange, onClose])

    const isRejected = currentStatus === "REJECTED"
    const isShortlisted = currentStatus === "REVIEWING"

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 bg-slate-800/30 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* Right-Side Drawer */}
            <div className="fixed right-0 top-0 h-screen w-full max-w-xl bg-white shadow-xl z-50 flex flex-col border-l border-slate-100">

                {/* Drawer Header */}
                <header className="px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                        >
                            <X className="w-4 h-4 text-slate-400" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-bold text-slate-800">{name}</h2>
                                {applicant.kind === "external" && (
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-bold uppercase rounded-full">
                                        {applicant.data.source}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-violet-600 font-bold text-xs">
                                    ATS {analysis.ats_score}%
                                </span>
                                <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-violet-400 rounded-full" style={{ width: `${analysis.ats_score}%` }} />
                                </div>
                                {email && <span className="text-[11px] text-slate-400">· {email}</span>}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5">

                    {/* Score Overview */}
                    <section className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart2 className="w-4 h-4 text-slate-300" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Score Breakdown</h3>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            <div className="flex flex-col items-center justify-center bg-white rounded-lg p-3 border border-slate-100">
                                <ScoreRing score={analysis.ats_score} size={60} />
                                <p className="text-[10px] font-semibold text-slate-400 mt-2 text-center">Overall</p>
                            </div>
                            <div className="col-span-3 flex flex-col justify-center gap-3 bg-white rounded-lg p-3 border border-slate-100">
                                <SubScoreBar label="Skills" score={analysis.skills_score} />
                                <SubScoreBar label="Experience" score={analysis.experience_score} />
                                <SubScoreBar label="Education" score={analysis.education_score} />
                            </div>
                        </div>
                    </section>

                    {/* AI Summary */}
                    {analysis.gap_report && (
                        <section className="bg-violet-50 rounded-xl p-4 border border-violet-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                                <h3 className="text-xs font-bold uppercase tracking-wider text-violet-500">AI Summary</h3>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                {analysis.gap_report}
                            </p>
                        </section>
                    )}

                    {/* Skills Breakdown */}
                    <section className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-50 flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-300" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Skills</h3>
                        </div>

                        <div className="p-4 grid grid-cols-2 gap-4">
                            {/* Matched Skills */}
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-2.5 flex items-center gap-1">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    Matched ({analysis.matched_skills.length})
                                </p>
                                {analysis.matched_skills.length === 0 ? (
                                    <p className="text-xs text-slate-300">None detected</p>
                                ) : (
                                    <ul className="space-y-1.5">
                                        {analysis.matched_skills.slice(0, 8).map((s) => (
                                            <li key={s.canonical_id} className="flex items-center gap-1.5 text-xs text-slate-600">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                <span className="truncate">{s.name}</span>
                                                {s.match_type === "semantic" && (
                                                    <span className="shrink-0 text-[9px] font-semibold px-1 py-0.5 rounded bg-violet-50 text-violet-500 border border-violet-100">~AI</span>
                                                )}
                                                {s.match_type === "fuzzy" && (
                                                    <span className="shrink-0 text-[9px] font-semibold px-1 py-0.5 rounded bg-amber-50 text-amber-500 border border-amber-100">~fuzz</span>
                                                )}
                                            </li>
                                        ))}
                                        {analysis.matched_skills.length > 8 && (
                                            <p className="text-[11px] text-slate-400">+{analysis.matched_skills.length - 8} more</p>
                                        )}
                                    </ul>
                                )}
                            </div>

                            {/* Missing Skills */}
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-2.5 flex items-center gap-1">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-300" />
                                    Missing ({analysis.missing_skills.length})
                                </p>
                                {analysis.missing_skills.length === 0 ? (
                                    <p className="text-xs text-slate-300">No gaps — strong match!</p>
                                ) : (
                                    <ul className="space-y-1.5">
                                        {analysis.missing_skills.slice(0, 8).map((s) => (
                                            <li key={s.canonical_id} className="flex items-center gap-1.5 text-xs text-slate-400">
                                                <XCircle className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                                                <span className="truncate">{s.name}</span>
                                                {s.section === "required" && (
                                                    <span className="shrink-0 text-[9px] font-semibold px-1 py-0.5 rounded bg-rose-50 text-rose-400 border border-rose-100">req</span>
                                                )}
                                            </li>
                                        ))}
                                        {analysis.missing_skills.length > 8 && (
                                            <p className="text-[11px] text-slate-400">+{analysis.missing_skills.length - 8} more</p>
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Extra Skills */}
                        {analysis.extra_skills.length > 0 && (
                            <div className="px-4 pb-4 pt-0">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1">
                                    <MinusCircle className="w-3 h-3" />
                                    Additional ({analysis.extra_skills.length})
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {analysis.extra_skills.slice(0, 12).map((s) => (
                                        <span
                                            key={s.canonical_id}
                                            className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${catColor(s.category)}`}
                                        >
                                            {s.name}
                                        </span>
                                    ))}
                                    {analysis.extra_skills.length > 12 && (
                                        <span className="text-[11px] text-slate-400 self-center">+{analysis.extra_skills.length - 12} more</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* AI Reasoning (collapsible) */}
                    {analysis.reasoning && (
                        <section className="rounded-xl border border-slate-100 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setReasoningOpen((p) => !p)}
                                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-slate-300" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Reasoning</span>
                                </div>
                                {reasoningOpen
                                    ? <ChevronUp className="w-3.5 h-3.5 text-slate-300" />
                                    : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />}
                            </button>
                            {reasoningOpen && (
                                <div className="px-4 pb-4 bg-slate-50">
                                    <p className="text-xs text-slate-500 leading-relaxed">{analysis.reasoning}</p>
                                </div>
                            )}
                        </section>
                    )}
                </div>

                {/* Footer Actions */}
                <footer className="px-5 py-4 border-t border-slate-100 bg-white">
                    <div className={`grid gap-3 ${isRejected ? "grid-cols-1" : "grid-cols-2"}`}>
                        {!isRejected && (
                            <button
                                type="button"
                                onClick={handleReject}
                                disabled={updatingStatus}
                                className="flex items-center justify-center gap-2 h-10 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all disabled:opacity-50"
                            >
                                {updatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                Reject
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleShortlist}
                            disabled={updatingStatus}
                            className={`flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 ${
                                isShortlisted
                                    ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                    : "bg-violet-500 text-white hover:bg-violet-600 shadow-sm shadow-violet-200"
                            }`}
                        >
                            {updatingStatus
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <Star className={`w-4 h-4 ${isShortlisted ? "" : "fill-white"}`} />}
                            {isShortlisted ? "Remove Shortlist" : "Shortlist"}
                        </button>
                    </div>
                </footer>
            </div>
        </>
    )
}
