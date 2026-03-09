"use client"

import { useState, useMemo, useEffect } from "react"
import {
    Plus,
    X,
    Pencil,
    Trash2,
    Briefcase,
    MapPin,
    DollarSign,
    Clock,
    Calendar,
    Loader2,
    Search,
    AlertTriangle,
    ChevronDown,
    Users,
    Star,
    FileText,
    Sparkles,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { JobResponse } from "@/types/job"
import { ApplicationResponse, ApplicationStatus } from "@/types/application"
import { ResumeData } from "@/app/(candidate)/candidate/resume/type"
import AtsModern from "@/components/resume/templates/AtsModern"
import { deleteJobAction, getJobApplicationsAction, updateApplicationStatusAction, getApplicationResumeAction, scoreJobApplicationsAction } from "./actions"
import { toast } from "sonner"
import CreateJobForm from "./CreateJobForm"
import EditJobForm from "./EditJobForm"

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, { className: string; dot: string; label: string }> = {
    OPEN: {
        className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        dot: "bg-emerald-500",
        label: "Open",
    },
    CLOSED: {
        className: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
        dot: "bg-slate-400",
        label: "Closed",
    },
    DRAFT: {
        className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        dot: "bg-amber-400",
        label: "Draft",
    },
}

const EMPLOYMENT_LABELS: Record<string, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    INTERNSHIP: "Internship",
    CONTRACT: "Contract",
    REMOTE: "Remote",
}

const STATUS_OPTIONS = [
    { value: "ALL", label: "All Statuses" },
    { value: "OPEN", label: "Open" },
    { value: "DRAFT", label: "Draft" },
    { value: "CLOSED", label: "Closed" },
]

const TYPE_OPTIONS = [
    { value: "ALL", label: "All Types" },
    { value: "FULL_TIME", label: "Full Time" },
    { value: "PART_TIME", label: "Part Time" },
    { value: "INTERNSHIP", label: "Internship" },
    { value: "CONTRACT", label: "Contract" },
    { value: "REMOTE", label: "Remote" },
]

// Tabs shown in the applicants side sheet
const APPLICANT_TABS: { value: ApplicationStatus | "ALL"; label: string }[] = [
    { value: "ALL", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "REVIEWING", label: "Shortlisted" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "REJECTED", label: "Rejected" },
]

const APP_STATUS_STYLE: Record<ApplicationStatus, string> = {
    PENDING: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    REVIEWING: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    ACCEPTED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    REJECTED: "bg-red-50 text-red-600 ring-1 ring-red-200",
}

const APP_STATUS_LABEL: Record<ApplicationStatus, string> = {
    PENDING: "Pending",
    REVIEWING: "Shortlisted",
    ACCEPTED: "Accepted",
    REJECTED: "Rejected",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSalary(min: number | null, max: number | null): string | null {
    if (!min && !max) return null
    if (min && max) return `$${(min / 1000).toFixed(0)}k – $${(max / 1000).toFixed(0)}k`
    if (min) return `From $${(min / 1000).toFixed(0)}k`
    return `Up to $${(max! / 1000).toFixed(0)}k`
}

function formatDeadline(deadline: string | null): string | null {
    if (!deadline) return null
    return new Date(deadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

function getInitials(name: string | null): string {
    if (!name) return "?"
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────

function Modal({
    title,
    subtitle,
    icon: Icon,
    onClose,
    children,
    maxWidth = "max-w-2xl",
}: {
    title: string
    subtitle?: string
    icon?: React.ElementType
    onClose: () => void
    children: React.ReactNode
    maxWidth?: string
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
            <div
                className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto`}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Icon className="w-4 h-4 text-primary" />
                            </div>
                        )}
                        <div>
                            <h2 className="text-base font-bold text-slate-800">{title}</h2>
                            {subtitle && (
                                <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{subtitle}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    )
}

// ─── Delete Confirmation Modal ─────────────────────────────────────────────────

function DeleteConfirmModal({
    job,
    isDeleting,
    onConfirm,
    onCancel,
}: {
    job: JobResponse
    isDeleting: boolean
    onConfirm: () => void
    onCancel: () => void
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md"
                role="alertdialog"
                aria-modal="true"
            >
                <div className="p-6">
                    <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Delete Job Posting</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Are you sure you want to delete{" "}
                                <span className="font-semibold text-slate-700">&quot;{job.title}&quot;</span>?
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        <button
                            onClick={onCancel}
                            disabled={isDeleting}
                            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {isDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Trash2 className="w-4 h-4" />
                            )}
                            {isDeleting ? "Deleting…" : "Delete"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── CV Modal ────────────────────────────────────────────────────────────────

function CvModal({
    applicant,
    onClose,
}: {
    applicant: ApplicationResponse
    onClose: () => void
}) {
    const [resumeData, setResumeData] = useState<ResumeData | null>(null)
    const [loading, setLoading] = useState(true)   // starts true — fetch begins immediately
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        getApplicationResumeAction(applicant.id)
            .then((res) => { if (!cancelled) setResumeData(res.resume_data as ResumeData) })
            .catch((e: Error) => { if (!cancelled) setError(e.message ?? "Failed to load resume") })
            .finally(() => { if (!cancelled) setLoading(false) })
        return () => { cancelled = true }
    }, [applicant.id])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [onClose])

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">
                            {applicant.candidate_name ?? "Candidate"}&apos;s Resume
                        </h2>
                        {applicant.resume_title && (
                            <p className="text-xs text-slate-500 mt-0.5">{applicant.resume_title}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Close resume"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-10 py-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <p className="text-sm">Loading resume…</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                            <p className="text-sm text-red-500">{error}</p>
                        </div>
                    ) : resumeData ? (
                        <AtsModern resume={resumeData} />
                    ) : null}
                </div>
            </div>
        </div>
    )
}

// ─── Applicant Card ───────────────────────────────────────────────────────────

function ApplicantCard({
    applicant,
    isShortlisting,
    onToggleShortlist,
    onViewCv,
    aiScore,
    threshold,
}: {
    applicant: ApplicationResponse
    isShortlisting: boolean
    onToggleShortlist: () => void
    onViewCv: () => void
    aiScore?: number
    threshold?: number
}) {
    const isShortlisted = applicant.status === "REVIEWING"
    const initials = getInitials(applicant.candidate_name)
    const hasScore = aiScore !== undefined
    const aboveThreshold = hasScore && threshold !== undefined && aiScore >= threshold

    const scoreBadgeClass = !hasScore
        ? ""
        : aboveThreshold
        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
        : aiScore >= (threshold ?? 0) * 0.75
        ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
        : "bg-red-50 text-red-600 ring-1 ring-red-200"

    return (
        <div
            className={`border rounded-xl p-4 bg-white transition-colors ${
                hasScore && !aboveThreshold
                    ? "border-slate-200 opacity-60 hover:opacity-100"
                    : hasScore && aboveThreshold
                    ? "border-emerald-200 hover:border-emerald-300"
                    : "border-slate-200 hover:border-slate-300"
            }`}
        >
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary select-none">
                    {initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                        <p className="font-semibold text-slate-900 truncate text-sm">
                            {applicant.candidate_name ?? "Unknown Candidate"}
                        </p>
                        <div className="flex items-center gap-1.5 shrink-0">
                            {hasScore && (
                                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${scoreBadgeClass}`}>
                                    <Sparkles className="w-2.5 h-2.5" />
                                    {aiScore}%
                                </span>
                            )}
                            <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${APP_STATUS_STYLE[applicant.status]}`}>
                                {APP_STATUS_LABEL[applicant.status]}
                            </span>
                        </div>
                    </div>
                    {applicant.candidate_email && (
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{applicant.candidate_email}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                        Applied{" "}
                        {formatDistanceToNow(new Date(applicant.applied_at), { addSuffix: true })}
                    </p>
                </div>
            </div>

            {/* Action row */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                <button
                    onClick={onViewCv}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                    <FileText className="w-3.5 h-3.5" />
                    {applicant.resume_title ?? "View CV"}
                </button>

                <button
                    onClick={onToggleShortlist}
                    disabled={isShortlisting}
                    className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
                        isShortlisted
                            ? "text-amber-700 bg-amber-50 hover:bg-amber-100"
                            : "text-slate-600 bg-slate-100 hover:bg-slate-200"
                    }`}
                >
                    {isShortlisting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                        <Star className={`w-3.5 h-3.5 ${isShortlisted ? "fill-amber-500 text-amber-500" : ""}`} />
                    )}
                    {isShortlisted ? "Shortlisted" : "Shortlist"}
                </button>
            </div>
        </div>
    )
}

// ─── Applicants Side Sheet ────────────────────────────────────────────────────

function ApplicantsSheet({
    job,
    onClose,
}: {
    job: JobResponse
    onClose: () => void
}) {
    const [applicants, setApplicants] = useState<ApplicationResponse[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [tab, setTab] = useState<ApplicationStatus | "ALL">("ALL")
    const [search, setSearch] = useState("")
    const [shortlisting, setShortlisting] = useState<string | null>(null)
    const [cvApplicant, setCvApplicant] = useState<ApplicationResponse | null>(null)
    // AI shortlisting state
    const [aiOpen, setAiOpen] = useState(false)
    const [threshold, setThreshold] = useState(70)
    const [aiScores, setAiScores] = useState<Record<string, number> | null>(null)
    const [aiAnalyzing, setAiAnalyzing] = useState(false)
    const [bulkShortlisting, setBulkShortlisting] = useState(false)

    useEffect(() => {
        setLoading(true)
        setError(null)
        getJobApplicationsAction(job.id)
            .then(setApplicants)
            .catch((e: Error) => setError(e.message ?? "Failed to load applicants"))
            .finally(() => setLoading(false))
    }, [job.id])

    // Close on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [onClose])

    async function toggleShortlist(applicant: ApplicationResponse) {
        const newStatus: ApplicationStatus =
            applicant.status === "REVIEWING" ? "PENDING" : "REVIEWING"
        setShortlisting(applicant.id)
        try {
            await updateApplicationStatusAction(applicant.id, newStatus)
            setApplicants((prev) =>
                prev?.map((a) => (a.id === applicant.id ? { ...a, status: newStatus } : a)) ?? null,
            )
            toast.success(newStatus === "REVIEWING" ? "Candidate shortlisted" : "Removed from shortlist")
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Failed to update status")
        } finally {
            setShortlisting(null)
        }
    }

    async function runAiAnalysis() {
        setAiAnalyzing(true)
        try {
            const res = await scoreJobApplicationsAction(job.id)
            const map: Record<string, number> = {}
            res.scores.forEach(({ application_id, score }) => { map[application_id] = score })
            setAiScores(map)
            toast.success("AI analysis complete")
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "AI analysis failed")
        } finally {
            setAiAnalyzing(false)
        }
    }

    async function bulkShortlistAboveThreshold() {
        if (!applicants || !aiScores) return
        const eligible = applicants.filter(
            (a) => (aiScores[a.id] ?? 0) >= threshold && a.status !== "REVIEWING",
        )
        if (eligible.length === 0) {
            toast.info("All qualifying candidates are already shortlisted")
            return
        }
        setBulkShortlisting(true)
        try {
            await Promise.all(
                eligible.map((a) => updateApplicationStatusAction(a.id, "REVIEWING")),
            )
            setApplicants((prev) =>
                prev?.map((a) =>
                    eligible.some((e) => e.id === a.id) ? { ...a, status: "REVIEWING" } : a,
                ) ?? null,
            )
            toast.success(`${eligible.length} candidate${eligible.length !== 1 ? "s" : ""} shortlisted`)
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Bulk shortlist failed")
        } finally {
            setBulkShortlisting(false)
        }
    }

    const counts = useMemo(() => {
        if (!applicants) return {} as Record<string, number>
        return {
            ALL: applicants.length,
            PENDING: applicants.filter((a) => a.status === "PENDING").length,
            REVIEWING: applicants.filter((a) => a.status === "REVIEWING").length,
            ACCEPTED: applicants.filter((a) => a.status === "ACCEPTED").length,
            REJECTED: applicants.filter((a) => a.status === "REJECTED").length,
        }
    }, [applicants])

    const aboveThresholdCount = useMemo(() => {
        if (!applicants || !aiScores) return 0
        return applicants.filter((a) => (aiScores[a.id] ?? 0) >= threshold).length
    }, [applicants, aiScores, threshold])

    const filtered = useMemo(() => {
        if (!applicants) return []
        const q = search.toLowerCase()
        return applicants
            .filter((a) => {
                const matchTab = tab === "ALL" || a.status === tab
                const matchSearch =
                    (a.candidate_name ?? "").toLowerCase().includes(q) ||
                    (a.candidate_email ?? "").toLowerCase().includes(q)
                return matchTab && matchSearch
            })
            .sort((a, b) => {
                // When scores exist, sort above-threshold first
                if (!aiScores) return 0
                return (aiScores[b.id] ?? 0) - (aiScores[a.id] ?? 0)
            })
    }, [applicants, tab, search, aiScores])

    return (
        <>
            {/* Dim backdrop */}
            <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

            {/* Sheet panel */}
            <div
                className="fixed inset-y-0 right-0 z-50 w-full sm:w-[580px] bg-white shadow-2xl flex flex-col"
                role="complementary"
                aria-label="Applicants panel"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
                    <div>
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            <h2 className="text-base font-bold text-slate-900">Applicants</h2>
                            {applicants !== null && (
                                <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                    {applicants.length}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[300px]">{job.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* ✨ AI magic button */}
                        {applicants !== null && applicants.length > 0 && (
                            <button
                                onClick={() => setAiOpen((v) => !v)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                                    aiOpen
                                        ? "bg-violet-600 text-white"
                                        : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                                }`}
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                AI Shortlist
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            aria-label="Close applicants panel"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* ✨ AI Panel */}
                {aiOpen && (
                    <div className="px-5 py-4 border-b border-violet-100 bg-linear-to-br from-violet-50 to-purple-50 shrink-0">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-violet-600" />
                                <span className="text-sm font-bold text-violet-900">AI Shortlisting</span>
                                {aiScores && (
                                    <span className="text-xs font-semibold bg-violet-200 text-violet-800 px-2 py-0.5 rounded-full">
                                        {aboveThresholdCount} / {applicants?.length ?? 0} above {threshold}%
                                    </span>
                                )}
                            </div>
                        </div>

                        <p className="text-xs text-violet-600 mb-2 font-medium">Match threshold</p>
                        <div className="flex gap-1.5 mb-4">
                            {[50, 60, 70, 80, 90].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setThreshold(t)}
                                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                                        threshold === t
                                            ? "bg-violet-600 text-white shadow-sm"
                                            : "bg-white text-violet-600 border border-violet-200 hover:bg-violet-50"
                                    }`}
                                >
                                    {t}%
                                </button>
                            ))}
                        </div>

                        {aiScores ? (
                            <div className="space-y-2">
                                <button
                                    onClick={bulkShortlistAboveThreshold}
                                    disabled={bulkShortlisting || aboveThresholdCount === 0}
                                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    {bulkShortlisting ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Star className="w-3.5 h-3.5" />
                                    )}
                                    {bulkShortlisting
                                        ? "Shortlisting…"
                                        : `Shortlist ${aboveThresholdCount} candidate${aboveThresholdCount !== 1 ? "s" : ""} above ${threshold}%`}
                                </button>
                                <button
                                    onClick={() => { setAiScores(null) }}
                                    className="w-full text-xs text-violet-500 hover:text-violet-700 text-center py-1 cursor-pointer transition-colors"
                                >
                                    Re-run analysis
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={runAiAnalysis}
                                disabled={aiAnalyzing}
                                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {aiAnalyzing ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Sparkles className="w-3.5 h-3.5" />
                                )}
                                {aiAnalyzing ? "Analyzing resumes…" : "Run AI Analysis"}
                            </button>
                        )}
                    </div>
                )}

                {/* Search */}
                <div className="px-5 pt-4 pb-2 shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by name or email…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-5 py-2 shrink-0 flex gap-1 overflow-x-auto scrollbar-none border-b border-slate-100">
                    {APPLICANT_TABS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setTab(value)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                                tab === value ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100"
                            }`}
                        >
                            {label}
                            {counts[value] !== undefined && (
                                <span
                                    className={`text-xs rounded-full px-1.5 py-0.5 leading-none ${
                                        tab === value ? "bg-white/25 text-white" : "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    {counts[value]}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <p className="text-sm">Loading applicants…</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                            <p className="text-sm text-red-500">{error}</p>
                            <button
                                onClick={() => {
                                    setLoading(true)
                                    setError(null)
                                    getJobApplicationsAction(job.id)
                                        .then(setApplicants)
                                        .catch((e: Error) => setError(e.message))
                                        .finally(() => setLoading(false))
                                }}
                                className="text-sm text-primary hover:underline cursor-pointer"
                            >
                                Retry
                            </button>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                <Users className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-600">No applicants</p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {tab === "ALL" ? "No one has applied yet." : "No applicants in this category."}
                                </p>
                            </div>
                            {tab !== "ALL" && (
                                <button onClick={() => setTab("ALL")} className="text-sm text-primary hover:underline cursor-pointer">
                                    View all
                                </button>
                            )}
                        </div>
                    ) : (
                        filtered.map((applicant) => (
                            <ApplicantCard
                                key={applicant.id}
                                applicant={applicant}
                                isShortlisting={shortlisting === applicant.id}
                                onToggleShortlist={() => toggleShortlist(applicant)}
                                onViewCv={() => setCvApplicant(applicant)}
                                aiScore={aiScores ? aiScores[applicant.id] : undefined}
                                threshold={aiScores ? threshold : undefined}
                            />
                        ))
                    )}
                </div>

                {/* Footer */}
                {applicants !== null && applicants.length > 0 && (
                    <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 shrink-0">
                        <p className="text-xs text-slate-500">
                            <span className="font-semibold text-amber-600">{counts["REVIEWING"] ?? 0} shortlisted</span>
                            {" · "}
                            {counts["PENDING"] ?? 0} pending
                            {" · "}
                            {counts["ACCEPTED"] ?? 0} accepted
                        </p>
                    </div>
                )}
            </div>

            {/* CV Modal — sits above the sheet */}
            {cvApplicant && (
                <CvModal applicant={cvApplicant} onClose={() => setCvApplicant(null)} />
            )}
        </>
    )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${color}`} />
            <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-lg font-bold text-slate-900 leading-tight">{value}</p>
            </div>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function JobPageClient({ jobs }: { jobs: JobResponse[] }) {
    type ModalType = "create" | "edit" | "delete" | null
    const [modal, setModal] = useState<ModalType>(null)
    const [selectedJob, setSelectedJob] = useState<JobResponse | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [typeFilter, setTypeFilter] = useState("ALL")
    const [applicantsJob, setApplicantsJob] = useState<JobResponse | null>(null)

    const stats = useMemo(
        () => ({
            total: jobs.length,
            open: jobs.filter((j) => j.status === "OPEN").length,
            draft: jobs.filter((j) => j.status === "DRAFT").length,
            closed: jobs.filter((j) => j.status === "CLOSED").length,
        }),
        [jobs],
    )

    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return jobs.filter((job) => {
            const matchSearch =
                job.title.toLowerCase().includes(q) ||
                (job.location ?? "").toLowerCase().includes(q)
            const matchStatus = statusFilter === "ALL" || job.status === statusFilter
            const matchType = typeFilter === "ALL" || job.employment_type === typeFilter
            return matchSearch && matchStatus && matchType
        })
    }, [jobs, search, statusFilter, typeFilter])

    async function handleDelete() {
        if (!selectedJob) return
        setDeletingId(selectedJob.id)
        try {
            await deleteJobAction(selectedJob.id)
            toast.success("Job deleted successfully")
            setModal(null)
            setSelectedJob(null)
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Failed to delete job"
            toast.error(msg)
        } finally {
            setDeletingId(null)
        }
    }

    function openCreate() {
        setSelectedJob(null)
        setModal("create")
    }
    function openEdit(job: JobResponse) {
        setSelectedJob(job)
        setModal("edit")
    }
    function openDelete(job: JobResponse) {
        setSelectedJob(job)
        setModal("delete")
    }
    function closeModal() {
        setModal(null)
        setSelectedJob(null)
    }

    const hasFilters = search !== "" || statusFilter !== "ALL" || typeFilter !== "ALL"

    return (
        <>
            <div className="space-y-5">
                {/* ── Page Header ── */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Job Postings</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Manage your open, draft, and closed job listings.
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Post a Job
                    </button>
                </div>

                {/* ── Stats Row ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard label="Total" value={stats.total} color="bg-slate-400" />
                    <StatCard label="Open" value={stats.open} color="bg-emerald-500" />
                    <StatCard label="Draft" value={stats.draft} color="bg-amber-400" />
                    <StatCard label="Closed" value={stats.closed} color="bg-slate-300" />
                </div>

                {/* ── Search & Filters ── */}
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by title or location…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 cursor-pointer"
                        >
                            {STATUS_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 cursor-pointer"
                        >
                            {TYPE_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>

                    {hasFilters && (
                        <button
                            onClick={() => {
                                setSearch("")
                                setStatusFilter("ALL")
                                setTypeFilter("ALL")
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                            Clear
                        </button>
                    )}
                </div>

                {/* ── Table ── */}
                {jobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 gap-3 text-center">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700">No jobs posted yet</p>
                            <p className="text-sm text-slate-400 mt-0.5">
                                Click &quot;Post a Job&quot; to get started.
                            </p>
                        </div>
                        <button
                            onClick={openCreate}
                            className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Post your first job
                        </button>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
                                <Search className="w-8 h-8 text-slate-300" />
                                <p className="text-sm font-semibold text-slate-600">
                                    No jobs match your filters
                                </p>
                                <button
                                    onClick={() => {
                                        setSearch("")
                                        setStatusFilter("ALL")
                                        setTypeFilter("ALL")
                                    }}
                                    className="text-sm text-primary hover:underline cursor-pointer"
                                >
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50">
                                            <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">
                                                Job Title
                                            </th>
                                            <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide whitespace-nowrap">
                                                Location
                                            </th>
                                            <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide whitespace-nowrap">
                                                Type
                                            </th>
                                            <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide whitespace-nowrap">
                                                Salary
                                            </th>
                                            <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide whitespace-nowrap">
                                                Deadline
                                            </th>
                                            <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide text-right">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filtered.map((job) => {
                                            const badge = STATUS_BADGE[job.status] ?? STATUS_BADGE.DRAFT
                                            const salary = formatSalary(job.salary_min, job.salary_max)
                                            const deadline = formatDeadline(job.application_deadline)

                                            return (
                                                <tr
                                                    key={job.id}
                                                    className="hover:bg-slate-50/60 transition-colors"
                                                >
                                                    {/* Title */}
                                                    <td className="px-5 py-3.5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                                                <Briefcase className="w-4 h-4 text-slate-500" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-900 truncate max-w-[180px]">
                                                                    {job.title}
                                                                </p>
                                                                {job.experience_required != null && (
                                                                    <p className="text-xs text-slate-400">
                                                                        {job.experience_required}+ yrs exp
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Location */}
                                                    <td className="px-4 py-3.5">
                                                        <span className="flex items-center gap-1.5 text-slate-600 whitespace-nowrap">
                                                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                            {job.location ?? "Remote"}
                                                        </span>
                                                    </td>

                                                    {/* Type */}
                                                    <td className="px-4 py-3.5">
                                                        <span className="flex items-center gap-1.5 text-slate-600 whitespace-nowrap">
                                                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                            {EMPLOYMENT_LABELS[job.employment_type] ??
                                                                job.employment_type}
                                                        </span>
                                                    </td>

                                                    {/* Salary */}
                                                    <td className="px-4 py-3.5">
                                                        {salary ? (
                                                            <span className="flex items-center gap-1.5 text-slate-600 whitespace-nowrap">
                                                                <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                                {salary}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-300">—</span>
                                                        )}
                                                    </td>

                                                    {/* Deadline */}
                                                    <td className="px-4 py-3.5">
                                                        {deadline ? (
                                                            <span className="flex items-center gap-1.5 text-slate-600 whitespace-nowrap">
                                                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                                {deadline}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-300">—</span>
                                                        )}
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-4 py-3.5">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${badge.className}`}
                                                        >
                                                            <span
                                                                className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}
                                                            />
                                                            {badge.label}
                                                        </span>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-4 py-3.5">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => setApplicantsJob(job)}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
                                                                aria-label={`View applicants for ${job.title}`}
                                                            >
                                                                <Users className="w-3.5 h-3.5" />
                                                                Applicants
                                                            </button>
                                                            <button
                                                                onClick={() => openEdit(job)}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                                                                aria-label={`Edit ${job.title}`}
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => openDelete(job)}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                                                                aria-label={`Delete ${job.title}`}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>

                                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
                                    <p className="text-xs text-slate-400">
                                        Showing {filtered.length} of {jobs.length} job
                                        {jobs.length !== 1 ? "s" : ""}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Create Modal ── */}
            {modal === "create" && (
                <Modal title="Post a New Job" icon={Plus} onClose={closeModal}>
                    <CreateJobForm onSuccess={closeModal} />
                </Modal>
            )}

            {/* ── Edit Modal ── */}
            {modal === "edit" && selectedJob && (
                <Modal title="Edit Job" subtitle={selectedJob.title} icon={Pencil} onClose={closeModal}>
                    <EditJobForm job={selectedJob} onSuccess={closeModal} onCancel={closeModal} />
                </Modal>
            )}

            {/* ── Delete Confirmation Modal ── */}
            {modal === "delete" && selectedJob && (
                <DeleteConfirmModal
                    job={selectedJob}
                    isDeleting={deletingId === selectedJob.id}
                    onConfirm={handleDelete}
                    onCancel={closeModal}
                />
            )}

            {/* ── Applicants Side Sheet ── */}
            {applicantsJob && (
                <ApplicantsSheet job={applicantsJob} onClose={() => setApplicantsJob(null)} />
            )}
        </>
    )
}
