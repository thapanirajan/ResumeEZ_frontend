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

function catColor(cat: string) {
    return CATEGORY_COLORS[cat] ?? "bg-gray-100 text-gray-600"
}

function SubScoreBar({ label, score }: { label: string; score: number }) {
    const color = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-indigo-500" : score >= 40 ? "bg-amber-500" : "bg-red-500"
    return (
        <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>{label}</span>
                <span className="font-semibold text-slate-700">{score}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100">
                <div className={`h-1.5 rounded-full transition-all ${color}`} style={{ width: `${Math.min(score, 100)}%` }} />
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base shrink-0">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">{name}</h2>
                            {email && <p className="text-sm text-slate-500">{email}</p>}
                            <p className="text-xs text-slate-400 mt-0.5">{jobTitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">

                    {/* Score Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="sm:col-span-1 flex flex-col items-center justify-center bg-slate-50 rounded-xl p-5">
                            <ScoreRing score={analysis.ats_score} size={72} />
                            <p className="text-xs font-semibold text-slate-500 mt-2">Overall ATS</p>
                        </div>
                        <div className="sm:col-span-3 flex flex-col justify-center gap-3 bg-slate-50 rounded-xl p-5">
                            <SubScoreBar label="Skills Match" score={analysis.skills_score} />
                            <SubScoreBar label="Experience" score={analysis.experience_score} />
                            <SubScoreBar label="Education" score={analysis.education_score} />
                        </div>
                    </div>

                    {/* Skill Columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                        {/* Matched Skills */}
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm font-semibold text-slate-800">Matched</span>
                                <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                    {analysis.matched_skills.length}
                                </span>
                            </div>
                            {analysis.matched_skills.length === 0 ? (
                                <p className="text-xs text-slate-400">No matching skills detected.</p>
                            ) : (
                                <ul className="space-y-1.5">
                                    {analysis.matched_skills.slice(0, 10).map((s) => (
                                        <li key={s.canonical_id} className="rounded-lg bg-white border border-emerald-100 px-2.5 py-2">
                                            <div className="flex items-center justify-between gap-1">
                                                <span className="text-xs font-medium text-emerald-800 truncate">{s.name}</span>
                                                {s.match_type === "semantic" && (
                                                    <span className="shrink-0 text-[9px] font-semibold px-1 py-0.5 rounded bg-purple-100 text-purple-700">~AI</span>
                                                )}
                                                {s.match_type === "fuzzy" && (
                                                    <span className="shrink-0 text-[9px] font-semibold px-1 py-0.5 rounded bg-amber-100 text-amber-700">~fuzz</span>
                                                )}
                                            </div>
                                            <span className={`inline-block mt-1 rounded-full px-1.5 py-0.5 text-[9px] font-medium ${catColor(s.category)}`}>
                                                {s.category}
                                            </span>
                                        </li>
                                    ))}
                                    {analysis.matched_skills.length > 10 && (
                                        <p className="text-xs text-slate-400 text-center">+{analysis.matched_skills.length - 10} more</p>
                                    )}
                                </ul>
                            )}
                        </div>

                        {/* Missing Skills */}
                        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <XCircle className="w-4 h-4 text-red-500" />
                                <span className="text-sm font-semibold text-slate-800">Missing</span>
                                <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                                    {analysis.missing_skills.length}
                                </span>
                            </div>
                            {analysis.missing_skills.length === 0 ? (
                                <p className="text-xs text-slate-400">No skill gaps — strong match!</p>
                            ) : (
                                <ul className="space-y-1.5">
                                    {analysis.missing_skills.slice(0, 10).map((s) => (
                                        <li key={s.canonical_id} className="rounded-lg bg-white border border-red-100 px-2.5 py-2">
                                            <div className="flex items-center justify-between gap-1">
                                                <span className="text-xs font-medium text-red-800 truncate">{s.name}</span>
                                                {s.section === "required" && (
                                                    <span className="shrink-0 text-[9px] font-semibold px-1 py-0.5 rounded bg-red-100 text-red-700">req</span>
                                                )}
                                            </div>
                                            <span className={`inline-block mt-1 rounded-full px-1.5 py-0.5 text-[9px] font-medium ${catColor(s.category)}`}>
                                                {s.category}
                                            </span>
                                        </li>
                                    ))}
                                    {analysis.missing_skills.length > 10 && (
                                        <p className="text-xs text-slate-400 text-center">+{analysis.missing_skills.length - 10} more</p>
                                    )}
                                </ul>
                            )}
                        </div>

                        {/* Extra Skills */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <MinusCircle className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-semibold text-slate-800">Additional</span>
                                <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                    {analysis.extra_skills.length}
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mb-2">Skills in resume, not in JD.</p>
                            {analysis.extra_skills.length === 0 ? (
                                <p className="text-xs text-slate-400">None detected.</p>
                            ) : (
                                <ul className="space-y-1.5">
                                    {analysis.extra_skills.slice(0, 10).map((s) => (
                                        <li key={s.canonical_id} className="rounded-lg bg-white border border-slate-100 px-2.5 py-2">
                                            <span className="text-xs font-medium text-slate-700 truncate block">{s.name}</span>
                                            <span className={`inline-block mt-1 rounded-full px-1.5 py-0.5 text-[9px] font-medium ${catColor(s.category)}`}>
                                                {s.category}
                                            </span>
                                        </li>
                                    ))}
                                    {analysis.extra_skills.length > 10 && (
                                        <p className="text-xs text-slate-400 text-center">+{analysis.extra_skills.length - 10} more</p>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Gap Report */}
                    {analysis.gap_report && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="flex items-center gap-2 mb-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">AI Gap Report</span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">{analysis.gap_report}</p>
                        </div>
                    )}

                    {/* AI Reasoning (collapsible) */}
                    {analysis.reasoning && (
                        <div className="rounded-xl border border-slate-200">
                            <button
                                type="button"
                                onClick={() => setReasoningOpen((p) => !p)}
                                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors rounded-xl"
                            >
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">AI Reasoning</span>
                                {reasoningOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </button>
                            {reasoningOpen && (
                                <div className="px-4 pb-4">
                                    <p className="text-sm text-slate-600 leading-relaxed">{analysis.reasoning}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={handleShortlist}
                            disabled={updatingStatus}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
                                currentStatus === "REVIEWING"
                                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200"
                            }`}
                        >
                            {updatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {currentStatus === "REVIEWING" ? "Remove from Shortlist" : "Shortlist Candidate"}
                        </button>
                        {currentStatus !== "REJECTED" && (
                            <button
                                type="button"
                                onClick={handleReject}
                                disabled={updatingStatus}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all disabled:opacity-50"
                            >
                                Reject
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
