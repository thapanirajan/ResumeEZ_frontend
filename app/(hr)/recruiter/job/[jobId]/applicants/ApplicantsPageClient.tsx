"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import {
    ArrowLeft,
    Search,
    ArrowDownUp,
    Sparkles,
    Users,
    Star,
    Eye,
    X,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Upload,
    UploadCloud,
    FileText,
    BarChart2,
    RocketIcon,
    Bell,
    CheckCircle2,
    AlertTriangle,
    Lock,
} from "lucide-react"
import { toast } from "sonner"

import { JobResponse } from "@/types/job"
import { ApplicationAnalysis, ApplicationResponse, ApplicationStatus } from "@/types/application"
import {
    ExternalApplicationResponse,
    ExternalApplicationSource,
    updateApplicationStatusAction,
    updateExternalApplicationStatusAction,
    getApplicationResumeAction,
    uploadExternalResumeAction,
    bulkUploadExternalResumesAction,
    notifyShortlistedAction,
} from "../../actions"
import { applicationApi } from "@/services/application.service"
import ScoreRing from "./ScoreRing"
import CandidateAnalysisModal from "./CandidateAnalysisModal"

// ── Types ─────────────────────────────────────────────────────────────────────

type SortMode = "score" | "date"
type TabFilter = ApplicationStatus | "ALL"

interface Props {
    job: JobResponse
    initialApplications: ApplicationResponse[]
    initialExternalApplications: ExternalApplicationResponse[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(name: string | null): string {
    if (!name) return "?"
    return name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("")
}

function avatarColor(name: string | null): string {
    const colors = [
        "bg-primary/10 text-primary",
        "bg-emerald-100 text-emerald-700",
        "bg-amber-100 text-amber-700",
        "bg-rose-100 text-rose-700",
        "bg-cyan-100 text-cyan-700",
        "bg-violet-100 text-violet-700",
    ]
    if (!name) return colors[0]
    const idx = name.charCodeAt(0) % colors.length
    return colors[idx]
}

function relativeTime(iso: string): string {
    try {
        return formatDistanceToNow(new Date(iso), { addSuffix: true })
    } catch {
        return iso
    }
}


const EMPLOYMENT_LABEL: Record<string, string> = {
    FULL_TIME: "Full-Time",
    PART_TIME: "Part-Time",
    INTERNSHIP: "Internship",
    CONTRACT: "Contract",
    REMOTE: "Remote",
}

const STATUS_STYLES: Record<string, string> = {
    PENDING: "bg-slate-100 text-slate-600",
    REVIEWING: "bg-emerald-100 text-emerald-700",
    ACCEPTED: "bg-blue-100 text-blue-700",
    REJECTED: "bg-red-100 text-red-600",
}

const STATUS_DOT: Record<string, string> = {
    PENDING: "bg-slate-400",
    REVIEWING: "bg-emerald-500",
    ACCEPTED: "bg-blue-500",
    REJECTED: "bg-red-500",
}

const PAGE_SIZE = 20

// ── Resume Modal ──────────────────────────────────────────────────────────────

type ResumeData = Record<string, unknown>

function CvModal({
    application,
    onClose,
}: {
    application: ApplicationResponse
    onClose: () => void
}) {
    const [resumeData, setResumeData] = useState<ResumeData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        getApplicationResumeAction(application.id)
            .then((r) => {
                if (!cancelled) setResumeData(r.resume_data as ResumeData)
            })
            .catch((e: Error) => {
                if (!cancelled) setError(e.message)
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => { cancelled = true }
    }, [application.id])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                        <p className="font-bold text-slate-900">{application.candidate_name}</p>
                        <p className="text-xs text-slate-500">{application.resume_title ?? "Resume"}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {loading && (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    )}
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {resumeData && !loading && (
                        <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono bg-slate-50 rounded-2xl p-4">
                            {JSON.stringify(resumeData, null, 2)}
                        </pre>
                    )}
                </div>
            </div>
        </div>
    )
}

function ExternalCvModal({
    application,
    onClose,
}: {
    application: ExternalApplicationResponse
    onClose: () => void
}) {
    const filename = application.resume_filename.toLowerCase()
    const isSupported = filename.endsWith(".pdf") || filename.endsWith(".doc") || filename.endsWith(".docx")
    const embedUrl = isSupported
        ? `https://docs.google.com/gview?url=${encodeURIComponent(application.resume_file_url)}&embedded=true`
        : null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                        <p className="font-bold text-slate-900">{application.candidate_name}</p>
                        <p className="text-xs text-slate-500">
                            {application.source} · {application.resume_filename}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={application.resume_file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-primary hover:underline"
                        >
                            Open in new tab
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden">
                    {embedUrl ? (
                        <iframe
                            src={embedUrl}
                            className="w-full h-full min-h-[60vh] rounded-b-3xl"
                            title="Resume Preview"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-60 gap-3">
                            <p className="text-sm text-slate-500">Preview not available for this file type.</p>
                            <a
                                href={application.resume_file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:brightness-110 transition"
                            >
                                Open File
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ── Final Shortlist Confirmation Modal ───────────────────────────────────────

type ShortlistedCandidate = { id: string; name: string; kind: "platform" | "external" }

function FinalShortlistModal({
    candidates,
    jobTitle,
    onClose,
    onConfirm,
    isSending,
}: {
    candidates: ShortlistedCandidate[]
    jobTitle: string
    onClose: () => void
    onConfirm: () => void
    isSending: boolean
}) {
    const [confirmed, setConfirmed] = useState(false)
    const preview = candidates.slice(0, 3)
    const overflow = candidates.length - preview.length

    return (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                {/* Header */}
                <div className="flex items-start gap-4 p-6 border-b border-slate-100">
                    <div className="bg-amber-100 rounded-xl p-3 text-amber-600 shrink-0">
                        <Bell className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                            Confirm Final Shortlist Notification
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            This will send notifications to all shortlisted candidates. This action cannot be undone.
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Summary */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                            Candidates to be notified — {candidates.length} total
                        </p>
                        <ul className="space-y-2">
                            {preview.map((c) => (
                                <li key={c.id} className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                                        {c.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-800">{c.name}</span>
                                    {c.kind === "external" && (
                                        <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full uppercase">
                                            ext
                                        </span>
                                    )}
                                </li>
                            ))}
                            {overflow > 0 && (
                                <li className="text-xs text-slate-500 font-medium pl-9">
                                    +{overflow} more candidate{overflow > 1 ? "s" : ""}
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Warning */}
                    <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">
                            Each shortlisted candidate on the ResumeEZ platform will receive an{" "}
                            <strong>in-app notification</strong> and an <strong>email</strong> notifying them
                            they are on the final shortlist for <strong>{jobTitle}</strong>.
                        </p>
                    </div>

                    {/* Confirmation checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={confirmed}
                            onChange={(e) => setConfirmed(e.target.checked)}
                            className="mt-0.5 w-4 h-4 accent-primary"
                        />
                        <span className="text-sm text-slate-700 font-medium">
                            I confirm this final shortlist is correct and ready to send
                        </span>
                    </label>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        disabled={isSending}
                        className="flex-1 px-4 py-2.5 rounded-xl text-slate-600 font-bold text-sm border border-slate-200 hover:bg-slate-100 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={!confirmed || isSending}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isSending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending Notifications...
                            </>
                        ) : (
                            <>
                                <Bell className="w-4 h-4" />
                                Confirm &amp; Send Notifications
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Auto Shortlist Modal ──────────────────────────────────────────────────────

function AutoShortlistModal({
    onClose,
    onConfirm,
    totalCandidates,
    hasScores,
}: {
    onClose: () => void
    onConfirm: (topPercent: number) => void
    totalCandidates: number
    hasScores: boolean
}) {
    const [selectedPercent, setSelectedPercent] = useState<10 | 20 | null>(10)
    const [customPercent, setCustomPercent] = useState("")

    const effectivePercent = (selectedPercent !== null ? selectedPercent : parseInt(customPercent)) || 0
    const count = Math.ceil(totalCandidates * effectivePercent / 100)
    const isValid = effectivePercent > 0 && effectivePercent <= 100

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-slate-200">
                <div className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="bg-primary/10 rounded-xl p-3 text-primary shrink-0">
                            <Sparkles className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                                Auto Shortlist Top Candidates
                            </h2>
                            <p className="text-slate-500 mt-2 leading-relaxed text-sm">
                                {hasScores
                                    ? "Automatically shortlist the highest-matching candidates based on AI scores."
                                    : "Run AI Scores first to enable auto shortlisting."}
                            </p>
                        </div>
                    </div>

                    {hasScores ? (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-3">
                                    Shortlist top candidates by percentage:
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {([10, 20] as const).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => { setSelectedPercent(p); setCustomPercent("") }}
                                            className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                                                selectedPercent === p
                                                    ? "border-primary bg-primary/5 text-primary"
                                                    : "border-slate-100 bg-slate-50 text-slate-600 hover:border-primary/40"
                                            }`}
                                        >
                                            Top {p}%
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setSelectedPercent(null)}
                                        className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                                            selectedPercent === null
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-slate-100 bg-slate-50 text-slate-600 hover:border-primary/40"
                                        }`}
                                    >
                                        Custom %
                                    </button>
                                </div>
                                {selectedPercent === null && (
                                    <div className="mt-3">
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={customPercent}
                                            onChange={(e) => setCustomPercent(e.target.value)}
                                            placeholder="Enter percentage (1–100)"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                )}
                            </div>

                            {isValid && (
                                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="w-4 h-4 text-primary shrink-0" />
                                        <p className="text-sm text-primary font-medium">
                                            This will shortlist the top{" "}
                                            <span className="font-black underline">{count} candidate{count !== 1 ? "s" : ""}</span>{" "}
                                            out of {totalCandidates}.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                            <p className="text-sm text-amber-700 font-medium">
                                Please run AI Scores first so candidates can be ranked before shortlisting.
                            </p>
                        </div>
                    )}
                </div>

                <div className="bg-slate-50 p-6 flex justify-end gap-3 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                    {hasScores && (
                        <button
                            disabled={!isValid}
                            onClick={() => onConfirm(effectivePercent)}
                            className="bg-primary text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                        >
                            Shortlist {isValid && count > 0 ? `${count} ` : ""}Candidate{count !== 1 ? "s" : ""}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

// ── Source options ────────────────────────────────────────────────────────────

const SOURCE_OPTIONS: { value: ExternalApplicationSource; label: string }[] = [
    { value: "EMAIL", label: "Email" },
    { value: "LINKEDIN", label: "LinkedIn" },
    { value: "REFERRAL", label: "Referral" },
    { value: "OFFLINE", label: "Offline" },
    { value: "OTHER", label: "Other" },
]

// ── Single Upload Modal ───────────────────────────────────────────────────────

function SingleUploadModal({
    jobId,
    onClose,
    onSuccess,
}: {
    jobId: string
    onClose: () => void
    onSuccess: (app: ExternalApplicationResponse) => void
}) {
    const [candidateName, setCandidateName] = useState("")
    const [candidateEmail, setCandidateEmail] = useState("")
    const [source, setSource] = useState<ExternalApplicationSource>("OTHER")
    const [notes, setNotes] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!file) { toast.error("Please select a file"); return }
        if (!candidateName.trim()) { toast.error("Candidate name is required"); return }
        const fd = new FormData()
        fd.append("file", file)
        fd.append("candidate_name", candidateName.trim())
        if (candidateEmail.trim()) fd.append("candidate_email", candidateEmail.trim())
        fd.append("source", source)
        if (notes.trim()) fd.append("notes", notes.trim())
        setSubmitting(true)
        try {
            const result = await uploadExternalResumeAction(jobId, fd)
            toast.success(`${candidateName} uploaded successfully`)
            onSuccess(result)
            onClose()
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Upload failed")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-primary" />
                        <p className="font-bold text-slate-900">Upload Resume</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Candidate Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            required
                            placeholder="John Doe"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                        <input
                            type="email"
                            value={candidateEmail}
                            onChange={(e) => setCandidateEmail(e.target.value)}
                            placeholder="john@example.com"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Source</label>
                        <select
                            value={source}
                            onChange={(e) => setSource(e.target.value as ExternalApplicationSource)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                        >
                            {SOURCE_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Optional notes…"
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Resume File <span className="text-red-500">*</span>
                        </label>
                        <label className="flex flex-col items-center justify-center gap-2 w-full h-28 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors">
                            <FileText className="w-6 h-6 text-slate-400" />
                            {file ? (
                                <span className="text-xs font-semibold text-primary">{file.name}</span>
                            ) : (
                                <span className="text-xs text-slate-400">Click to select PDF, DOC, or DOCX</span>
                            )}
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            />
                        </label>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:brightness-110 transition-colors disabled:opacity-60"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            {submitting ? "Uploading…" : "Upload"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ── Bulk Upload Modal ─────────────────────────────────────────────────────────

interface BulkFileEntry {
    file: File
    candidateName: string
}

function BulkUploadModal({
    jobId,
    onClose,
    onSuccess,
}: {
    jobId: string
    onClose: () => void
    onSuccess: (apps: ExternalApplicationResponse[]) => void
}) {
    const [entries, setEntries] = useState<BulkFileEntry[]>([])
    const [source, setSource] = useState<ExternalApplicationSource>("OTHER")
    const [notes, setNotes] = useState("")
    const [submitting, setSubmitting] = useState(false)

    function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? [])
        setEntries(files.map((f) => ({
            file: f,
            candidateName: f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        })))
    }

    function updateName(idx: number, name: string) {
        setEntries((prev) => prev.map((en, i) => i === idx ? { ...en, candidateName: name } : en))
    }

    function removeEntry(idx: number) {
        setEntries((prev) => prev.filter((_, i) => i !== idx))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (entries.length === 0) { toast.error("Please select at least one file"); return }
        const invalidNames = entries.filter((en) => !en.candidateName.trim())
        if (invalidNames.length > 0) { toast.error("All candidates must have a name"); return }

        const fd = new FormData()
        entries.forEach((en) => fd.append("files", en.file))
        fd.append("candidate_names", JSON.stringify(entries.map((en) => en.candidateName.trim())))
        fd.append("source", source)
        if (notes.trim()) fd.append("notes", notes.trim())

        setSubmitting(true)
        try {
            const result = await bulkUploadExternalResumesAction(jobId, fd)
            const uploaded = result.results.filter((r) => r.success && r.data).map((r) => r.data!)
            if (result.uploaded_count > 0) {
                toast.success(`${result.uploaded_count} resume${result.uploaded_count > 1 ? "s" : ""} uploaded successfully`)
            }
            if (result.failed_count > 0) {
                toast.error(`${result.failed_count} upload${result.failed_count > 1 ? "s" : ""} failed`)
            }
            onSuccess(uploaded)
            onClose()
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Bulk upload failed")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <UploadCloud className="w-5 h-5 text-primary" />
                        <p className="font-bold text-slate-900">Bulk Upload Resumes</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {/* File picker */}
                        <div>
                            <label className="flex flex-col items-center justify-center gap-2 w-full h-28 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors">
                                <UploadCloud className="w-7 h-7 text-slate-400" />
                                <span className="text-xs text-slate-400">
                                    {entries.length > 0
                                        ? `${entries.length} file${entries.length > 1 ? "s" : ""} selected — click to change`
                                        : "Click to select multiple PDF, DOC, or DOCX files"}
                                </span>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    multiple
                                    className="hidden"
                                    onChange={handleFilesChange}
                                />
                            </label>
                        </div>

                        {/* Per-file name inputs */}
                        {entries.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Candidate Names</p>
                                {entries.map((en, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <span className="text-xs text-slate-400 truncate flex-1 min-w-0" title={en.file.name}>
                                            {en.file.name}
                                        </span>
                                        <input
                                            value={en.candidateName}
                                            onChange={(e) => updateName(idx, e.target.value)}
                                            placeholder="Candidate name"
                                            className="w-36 px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeEntry(idx)}
                                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Source */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Source</label>
                            <select
                                value={source}
                                onChange={(e) => setSource(e.target.value as ExternalApplicationSource)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                            >
                                {SOURCE_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Optional notes for all uploads…"
                                rows={2}
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || entries.length === 0}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:brightness-110 transition-colors disabled:opacity-60"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                            {submitting ? "Uploading…" : `Upload ${entries.length > 0 ? entries.length : ""} Resume${entries.length !== 1 ? "s" : ""}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ── Unified row type ──────────────────────────────────────────────────────────

type AnyApplication =
    | { kind: "platform"; data: ApplicationResponse }
    | { kind: "external"; data: ExternalApplicationResponse }

// ── Main Component ────────────────────────────────────────────────────────────

export default function ApplicantsPageClient({
    job,
    initialApplications,
    initialExternalApplications,
}: Props) {
    const router = useRouter()

    const [applications, setApplications] = useState(initialApplications)
    const [externalApplications, setExternalApplications] = useState(initialExternalApplications)

    // AI scores + analysis — pre-seed from any already-scored applications
    type AIEntry = { score: number; analysis: ApplicationAnalysis | null }

    const seedAiScores = useMemo<Record<string, AIEntry> | null>(() => {
        const entries: Record<string, AIEntry> = {}
        let hasAny = false
        for (const a of initialApplications) {
            if (a.ai_score != null) {
                entries[a.id] = { score: a.ai_score, analysis: a.ai_analysis ?? null }
                hasAny = true
            }
        }
        for (const a of initialExternalApplications) {
            if (a.ai_score != null) {
                entries[a.id] = { score: a.ai_score, analysis: a.ai_analysis ?? null }
                hasAny = true
            }
        }
        return hasAny ? entries : null
    }, [initialApplications, initialExternalApplications])

    const [aiScores, setAiScores] = useState<Record<string, AIEntry> | null>(seedAiScores)
    const [aiRunning, setAiRunning] = useState(false)
    const [analysisModal, setAnalysisModal] = useState<AnyApplication | null>(null)

    // Filters / sort
    const [search, setSearch] = useState("")
    const [tab, setTab] = useState<TabFilter>("ALL")
    const [sortMode, setSortMode] = useState<SortMode>("date")

    // Pagination
    const [page, setPage] = useState(1)

    // Action loading states
    const [togglingId, setTogglingId] = useState<string | null>(null)

    // Modals
    const [cvApp, setCvApp] = useState<ApplicationResponse | null>(null)
    const [cvExtApp, setCvExtApp] = useState<ExternalApplicationResponse | null>(null)
    const [showSingleUpload, setShowSingleUpload] = useState(false)
    const [showBulkUpload, setShowBulkUpload] = useState(false)
    const [showAutoShortlist, setShowAutoShortlist] = useState(false)

    // ── Final shortlist notification flow state ──────────────────────────────
    const [isFinalizing, setIsFinalizing] = useState(false)    // State 2: list locked, ready
    const [showFinalModal, setShowFinalModal] = useState(false) // State 3: modal open
    const [isSending, setIsSending] = useState(false)          // State 4: sending
    const [notifySuccess, setNotifySuccess] = useState<{ count: number } | null>(null) // State 5: done

    // ── Combined rows ────────────────────────────────────────────────────────

    const allRows: AnyApplication[] = useMemo(() => {
        const platform: AnyApplication[] = applications.map((d) => ({ kind: "platform", data: d }))
        const external: AnyApplication[] = externalApplications.map((d) => ({ kind: "external", data: d }))
        return [...platform, ...external]
    }, [applications, externalApplications])

    // ── Stats ────────────────────────────────────────────────────────────────

    const stats = useMemo(() => {
        const shortlisted = allRows.filter((r) => r.data.status === "REVIEWING").length
        const aiSuggested = aiScores
            ? allRows.filter((r) => (aiScores[r.data.id]?.score ?? 0) >= 70).length
            : 0
        return { total: allRows.length, shortlisted, aiSuggested }
    }, [allRows, aiScores])

    // ── Filtered & sorted rows ───────────────────────────────────────────────

    const filteredRows = useMemo(() => {
        let rows = allRows

        if (tab !== "ALL") {
            rows = rows.filter((r) => r.data.status === tab)
        }

        if (search.trim()) {
            const q = search.toLowerCase()
            rows = rows.filter((r) => {
                const name = (r.data.candidate_name ?? "").toLowerCase()
                const email = (r.data.candidate_email ?? "").toLowerCase()
                return name.includes(q) || email.includes(q)
            })
        }

        if (sortMode === "score" && aiScores) {
            rows = [...rows].sort(
                (a, b) => (aiScores[b.data.id]?.score ?? 0) - (aiScores[a.data.id]?.score ?? 0),
            )
        } else {
            rows = [...rows].sort((a, b) => {
                const aTime = a.kind === "platform" ? a.data.applied_at : a.data.uploaded_at
                const bTime = b.kind === "platform" ? b.data.applied_at : b.data.uploaded_at
                return new Date(bTime).getTime() - new Date(aTime).getTime()
            })
        }

        return rows
    }, [allRows, tab, search, sortMode, aiScores])

    // ── Pagination ───────────────────────────────────────────────────────────

    const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
    const pagedRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    // ── Tab counts ───────────────────────────────────────────────────────────

    const tabCounts = useMemo(() => {
        const counts: Record<string, number> = { ALL: allRows.length }
        for (const r of allRows) {
            counts[r.data.status] = (counts[r.data.status] ?? 0) + 1
        }
        return counts
    }, [allRows])

    // ── Topmost score row ────────────────────────────────────────────────────

    const topMatchId = useMemo(() => {
        if (!aiScores) return null
        let best: string | null = null
        let bestScore = -1
        for (const r of allRows) {
            const s = aiScores[r.data.id]?.score ?? 0
            if (s > bestScore) { bestScore = s; best = r.data.id }
        }
        return best
    }, [allRows, aiScores])

    // ── Run AI Scores ────────────────────────────────────────────────────────

    const runAiScores = useCallback(async () => {
        setAiRunning(true)
        try {
            const result = await applicationApi.scoreApplications(job.id)
            type AIEntry = { score: number; analysis: ApplicationAnalysis | null }
            const map: Record<string, AIEntry> = {}
            for (const s of result.scores) map[s.application_id] = { score: s.score, analysis: s.analysis ?? null }
            for (const s of result.external_scores) map[s.external_application_id] = { score: s.score, analysis: s.analysis ?? null }
            setAiScores(map)
            setSortMode("score")
            toast.success("AI scoring complete")
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "AI scoring failed")
        } finally {
            setAiRunning(false)
        }
    }, [job.id])

    // ── Status toggle ────────────────────────────────────────────────────────

    const toggleStatus = useCallback(
        async (row: AnyApplication) => {
            const id = row.data.id
            const current = row.data.status
            const next = current === "REVIEWING" ? "PENDING" : "REVIEWING"
            setTogglingId(id)
            try {
                if (row.kind === "platform") {
                    await updateApplicationStatusAction(id, next as ApplicationStatus)
                    setApplications((prev) =>
                        prev.map((a) => (a.id === id ? { ...a, status: next as ApplicationStatus } : a)),
                    )
                } else {
                    await updateExternalApplicationStatusAction(id, next)
                    setExternalApplications((prev) =>
                        prev.map((a) => (a.id === id ? { ...a, status: next } : a)),
                    )
                }
            } catch (e: unknown) {
                toast.error(e instanceof Error ? e.message : "Failed to update status")
            } finally {
                setTogglingId(null)
            }
        },
        [],
    )

    const rejectRow = useCallback(
        async (row: AnyApplication) => {
            const id = row.data.id
            setTogglingId(id)
            try {
                if (row.kind === "platform") {
                    await updateApplicationStatusAction(id, "REJECTED")
                    setApplications((prev) =>
                        prev.map((a) => (a.id === id ? { ...a, status: "REJECTED" } : a)),
                    )
                } else {
                    await updateExternalApplicationStatusAction(id, "REJECTED")
                    setExternalApplications((prev) =>
                        prev.map((a) => (a.id === id ? { ...a, status: "REJECTED" } : a)),
                    )
                }
            } catch (e: unknown) {
                toast.error(e instanceof Error ? e.message : "Failed to reject")
            } finally {
                setTogglingId(null)
            }
        },
        [],
    )

    // ── Auto Shortlist ───────────────────────────────────────────────────────

    const handleAutoShortlist = useCallback(async (topPercent: number) => {
        if (!aiScores) return
        setShowAutoShortlist(false)

        const scored = allRows
            .map((r) => ({ row: r, score: aiScores[r.data.id]?.score ?? 0 }))
            .sort((a, b) => b.score - a.score)

        const topN = Math.ceil(scored.length * topPercent / 100)
        const toShortlist = scored.slice(0, topN).filter((s) => s.row.data.status !== "REVIEWING")

        let successCount = 0
        for (const { row } of toShortlist) {
            try {
                if (row.kind === "platform") {
                    await updateApplicationStatusAction(row.data.id, "REVIEWING")
                    setApplications((prev) => prev.map((a) => a.id === row.data.id ? { ...a, status: "REVIEWING" } : a))
                } else {
                    await updateExternalApplicationStatusAction(row.data.id, "REVIEWING")
                    setExternalApplications((prev) => prev.map((a) => a.id === row.data.id ? { ...a, status: "REVIEWING" } : a))
                }
                successCount++
            } catch {
                // continue with others
            }
        }
        toast.success(`${successCount} candidate${successCount !== 1 ? "s" : ""} shortlisted`)
    }, [aiScores, allRows])

    // ── Shortlisted candidates (platform only — they have user accounts) ─────

    const shortlistedCandidates = useMemo<ShortlistedCandidate[]>(() => {
        const platform = applications
            .filter((a) => a.status === "REVIEWING")
            .map((a) => ({ id: a.id, name: a.candidate_name ?? "Unknown", kind: "platform" as const }))
        const external = externalApplications
            .filter((a) => a.status === "REVIEWING")
            .map((a) => ({ id: a.id, name: a.candidate_name, kind: "external" as const }))
        return [...platform, ...external]
    }, [applications, externalApplications])

    // ── Send final notifications ─────────────────────────────────────────────

    const handleSendNotifications = useCallback(async () => {
        // Only send to platform applications (they have ResumeEZ accounts)
        const platformIds = applications
            .filter((a) => a.status === "REVIEWING")
            .map((a) => a.id)

        if (platformIds.length === 0) {
            toast.error("No platform candidates to notify")
            return
        }

        setIsSending(true)
        try {
            const result = await notifyShortlistedAction(job.id, platformIds)
            setShowFinalModal(false)
            setIsFinalizing(false)
            setNotifySuccess({ count: result.notified_count })
            toast.success(`Notifications sent to ${result.notified_count} candidate${result.notified_count !== 1 ? "s" : ""}`)
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Failed to send notifications")
        } finally {
            setIsSending(false)
        }
    }, [applications, job.id])

    // ── Render ───────────────────────────────────────────────────────────────

    const tabs: { key: TabFilter; label: string }[] = [
        { key: "ALL", label: "All" },
        { key: "PENDING", label: "Pending" },
        { key: "REVIEWING", label: "Shortlisted" },
        { key: "ACCEPTED", label: "Accepted" },
        { key: "REJECTED", label: "Rejected" },
    ]

    return (
        <div className="min-h-screen bg-[#f6f6f8] p-6 space-y-6">

            {/* ── Context Bar ── */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Jobs
                        </button>
                        <span className="text-slate-300">/</span>
                        <span>{EMPLOYMENT_LABEL[job.employment_type] ?? job.employment_type}</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">
                        {job.title}
                    </h1>
                    <p className="text-slate-500 text-sm max-w-xl line-clamp-2">
                        {job.description}
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 flex-wrap">
                    {!notifySuccess && (
                        <>
                            <button
                                onClick={() => setShowSingleUpload(true)}
                                disabled={isFinalizing}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:border-primary/40 hover:text-primary transition-all disabled:opacity-40"
                            >
                                <Upload className="w-4 h-4" />
                                Upload Resume
                            </button>
                            <button
                                onClick={() => setShowBulkUpload(true)}
                                disabled={isFinalizing}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:border-primary/40 hover:text-primary transition-all disabled:opacity-40"
                            >
                                <UploadCloud className="w-4 h-4" />
                                Bulk Upload
                            </button>
                            <button
                                onClick={() => setShowAutoShortlist(true)}
                                disabled={isFinalizing}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:border-primary/40 hover:text-primary transition-all disabled:opacity-40"
                            >
                                <RocketIcon className="w-4 h-4" />
                                Auto Shortlist
                            </button>
                            <button
                                onClick={runAiScores}
                                disabled={aiRunning || isFinalizing}
                                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
                            >
                                {aiRunning ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Sparkles className="w-4 h-4" />
                                )}
                                {aiRunning ? "Scoring…" : "Run AI Scores"}
                            </button>

                            {/* Finalization CTA */}
                            {!isFinalizing ? (
                                <button
                                    onClick={() => setIsFinalizing(true)}
                                    disabled={stats.shortlisted === 0}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
                                    title={stats.shortlisted === 0 ? "Shortlist at least one candidate first" : ""}
                                >
                                    <Bell className="w-4 h-4" />
                                    Proceed to Final Decision
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowFinalModal(true)}
                                    disabled={stats.shortlisted === 0}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 hover:brightness-110 active:scale-95 transition-all animate-pulse"
                                >
                                    <Bell className="w-4 h-4" />
                                    Notify Job Seekers
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-500 font-medium text-sm">Total Applicants</p>
                        <Users className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-3xl font-black text-slate-900">{stats.total}</p>
                    <p className="mt-1 text-xs text-slate-400">
                        {applications.length} platform · {externalApplications.length} external
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-500 font-medium text-sm">Shortlisted</p>
                        <Star className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                    </div>
                    <p className="text-3xl font-black text-slate-900">{stats.shortlisted}</p>
                    <p className="mt-1 text-xs text-slate-400">
                        {stats.total > 0
                            ? `${Math.round((stats.shortlisted / stats.total) * 100)}% conversion`
                            : "No applicants yet"}
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
                    <div className="absolute top-2 right-2 opacity-5">
                        <Sparkles className="w-16 h-16 text-primary" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-500 font-medium text-sm">AI Suggested</p>
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-3xl font-black text-slate-900">{stats.aiSuggested}</p>
                    <p className="mt-1 text-xs text-primary font-semibold">
                        {aiScores ? "Scores available — ≥70% match" : "Run AI Scores to see matches"}
                    </p>
                </div>
            </div>

            {/* ── State 5: Success Banner ── */}
            {notifySuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-emerald-900">Notifications Sent Successfully</h3>
                            <p className="text-emerald-700 text-sm mt-1">
                                {notifySuccess.count} candidate{notifySuccess.count !== 1 ? "s" : ""} notified — in-app notifications
                                delivered, emails sent.
                            </p>
                        </div>
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all"
                        >
                            Back to Job Dashboard
                        </button>
                    </div>
                </div>
            )}

            {/* ── State 2: Finalizing Warning Banner ── */}
            {isFinalizing && !notifySuccess && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-amber-900">Review mode active</p>
                        <p className="text-xs text-amber-700 mt-0.5">
                            The shortlist is locked for review. Click <strong>Notify Job Seekers</strong> when you are ready
                            to send final notifications to {stats.shortlisted} shortlisted candidate{stats.shortlisted !== 1 ? "s" : ""}.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsFinalizing(false)}
                        className="text-amber-500 hover:text-amber-700 transition-colors text-xs font-semibold underline"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* ── Filter Bar ── */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search */}
                <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        placeholder="Search by name or email…"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => { setTab(t.key); setPage(1) }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                tab === t.key
                                    ? "bg-primary text-white"
                                    : "text-slate-500 hover:text-slate-900"
                            }`}
                        >
                            {t.label}
                            {(tabCounts[t.key] ?? 0) > 0 && (
                                <span className={`ml-1.5 text-[10px] font-bold ${tab === t.key ? "text-white/60" : "text-slate-400"}`}>
                                    {tabCounts[t.key]}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Sort */}
                <button
                    onClick={() => setSortMode((m) => (m === "score" ? "date" : "score"))}
                    className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-semibold transition-colors ${
                        sortMode === "score"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-white text-slate-600 border-slate-200 hover:border-primary/20"
                    }`}
                >
                    <ArrowDownUp className="w-4 h-4" />
                    {sortMode === "score" ? "Sort: Highest Score" : "Sort: Latest"}
                </button>
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Candidate</th>
                                <th className="px-6 py-4 text-center">Match Score</th>
                                <th className="px-6 py-4">Skills Match</th>
                                <th className="px-6 py-4">Applied</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pagedRows.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-slate-400 text-sm">
                                        {search
                                            ? "No applicants match your search."
                                            : tab !== "ALL"
                                            ? `No ${tab.toLowerCase()} applicants.`
                                            : "No applicants yet for this job."}
                                    </td>
                                </tr>
                            ) : (
                                pagedRows.map((row) => {
                                    const id = row.data.id
                                    const name = row.data.candidate_name ?? "Unknown"
                                    const email = row.data.candidate_email ?? ""
                                    const status = row.data.status
                                    const aiEntry = aiScores?.[id]
                                    const score = aiEntry?.score
                                    const hasAnalysis = aiEntry?.analysis != null
                                    const isTopMatch = id === topMatchId && score !== undefined
                                    const isToggling = togglingId === id
                                    const isShortlisted = status === "REVIEWING"
                                    const appliedAt =
                                        row.kind === "platform"
                                            ? row.data.applied_at
                                            : row.data.uploaded_at
                                    // Show actual matched skills if AI analysis available, otherwise nothing
                                    const topMatchedSkills = aiEntry?.analysis?.matched_skills?.slice(0, 4) ?? []

                                    return (
                                        <tr
                                            key={id}
                                            className={`group transition-colors ${
                                                isTopMatch
                                                    ? "bg-primary/5 hover:bg-primary/10"
                                                    : "hover:bg-slate-50"
                                            }`}
                                        >
                                            {/* Candidate */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${avatarColor(name)}`}
                                                    >
                                                        {initials(name)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-slate-900 text-sm">
                                                                {name}
                                                            </p>
                                                            {isTopMatch && (
                                                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full tracking-tight">
                                                                    Top Match
                                                                </span>
                                                            )}
                                                            {row.kind === "external" && (
                                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded-full">
                                                                    {row.data.source}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-0.5">
                                                            {email || "No email"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Match Score */}
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    {score !== undefined ? (
                                                        <ScoreRing score={score} size={40} />
                                                    ) : (
                                                        <span className="text-slate-300 text-sm font-medium">—</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Skills Match — actual matched skills from AI analysis */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1 max-w-[220px]">
                                                    {topMatchedSkills.length > 0 ? topMatchedSkills.map((s) => (
                                                        <span
                                                            key={s.canonical_id}
                                                            className="text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full"
                                                        >
                                                            {s.name}
                                                        </span>
                                                    )) : (
                                                        <span className="text-xs text-slate-300">
                                                            {aiEntry ? "No skills matched" : "—"}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Applied */}
                                            <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                                                {relativeTime(appliedAt)}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${STATUS_STYLES[status]}`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`}
                                                    />
                                                    {status === "REVIEWING" ? "Shortlisted" : status}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {/* View AI Analysis */}
                                                    {hasAnalysis && (
                                                        <button
                                                            onClick={() => setAnalysisModal(row)}
                                                            className="p-2 text-slate-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
                                                            title="View AI Analysis"
                                                        >
                                                            <BarChart2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {/* View CV */}
                                                    <button
                                                        onClick={() =>
                                                            row.kind === "platform"
                                                                ? setCvApp(row.data)
                                                                : setCvExtApp(row.data)
                                                        }
                                                        className="p-2 text-slate-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
                                                        title="View CV"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>

                                                    {/* Shortlist / Unshortlist — locked during finalization */}
                                                    <button
                                                        onClick={() => toggleStatus(row)}
                                                        disabled={isToggling || isFinalizing}
                                                        className={`p-2 rounded-lg transition-colors ${
                                                            isFinalizing
                                                                ? "opacity-30 cursor-not-allowed"
                                                                : isShortlisted
                                                                ? "text-emerald-500 hover:bg-emerald-50"
                                                                : "text-slate-400 hover:text-emerald-500 hover:bg-emerald-50"
                                                        }`}
                                                        title={isFinalizing ? "Locked during review" : isShortlisted ? "Remove from shortlist" : "Shortlist"}
                                                    >
                                                        {isToggling ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Star
                                                                className={`w-4 h-4 ${isShortlisted ? "fill-emerald-500" : ""}`}
                                                            />
                                                        )}
                                                    </button>

                                                    {/* Reject — locked during finalization */}
                                                    <button
                                                        onClick={() => rejectRow(row)}
                                                        disabled={isToggling || status === "REJECTED" || isFinalizing}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                                                        title={isFinalizing ? "Locked during review" : "Reject"}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination Footer ── */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                        Showing{" "}
                        <span className="font-bold">
                            {filteredRows.length === 0
                                ? 0
                                : (page - 1) * PAGE_SIZE + 1}
                            –{Math.min(page * PAGE_SIZE, filteredRows.length)}
                        </span>{" "}
                        of <span className="font-bold">{filteredRows.length}</span> candidates
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-40"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            Previous
                        </button>
                        <span className="text-xs text-slate-500 font-medium">
                            {page} / {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:brightness-110 transition-all disabled:opacity-40"
                        >
                            Next
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Modals ── */}
            {showFinalModal && (
                <FinalShortlistModal
                    candidates={shortlistedCandidates}
                    jobTitle={job.title}
                    onClose={() => setShowFinalModal(false)}
                    onConfirm={handleSendNotifications}
                    isSending={isSending}
                />
            )}
            {showAutoShortlist && (
                <AutoShortlistModal
                    onClose={() => setShowAutoShortlist(false)}
                    onConfirm={handleAutoShortlist}
                    totalCandidates={allRows.length}
                    hasScores={aiScores !== null}
                />
            )}
            {analysisModal && aiScores?.[analysisModal.data.id]?.analysis && (
                <CandidateAnalysisModal
                    applicant={analysisModal}
                    analysis={aiScores[analysisModal.data.id]!.analysis!}
                    jobTitle={job.title}
                    onClose={() => setAnalysisModal(null)}
                    onStatusChange={(id, next) => {
                        if (analysisModal.kind === "platform") {
                            setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: next as ApplicationStatus } : a))
                        } else {
                            setExternalApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: next } : a))
                        }
                    }}
                />
            )}
            {cvApp && <CvModal application={cvApp} onClose={() => setCvApp(null)} />}
            {cvExtApp && <ExternalCvModal application={cvExtApp} onClose={() => setCvExtApp(null)} />}
            {showSingleUpload && (
                <SingleUploadModal
                    jobId={job.id}
                    onClose={() => setShowSingleUpload(false)}
                    onSuccess={(app) => setExternalApplications((prev) => [app, ...prev])}
                />
            )}
            {showBulkUpload && (
                <BulkUploadModal
                    jobId={job.id}
                    onClose={() => setShowBulkUpload(false)}
                    onSuccess={(apps) => setExternalApplications((prev) => [...apps, ...prev])}
                />
            )}
        </div>
    )
}
