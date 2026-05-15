"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
    Plus,
    X,
    Pencil,
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
    Upload,
    ExternalLink,
    Mail,
    Linkedin,
    Link,
    Paperclip,
    CheckCircle2,
    XCircle,
    Trash2,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { JobResponse } from "@/types/job"
import { ApplicationResponse, ApplicationStatus } from "@/types/application"
import { ResumeData } from "@/app/(candidate)/candidate/resume/type"
import AtsModern from "@/components/resume/templates/AtsModern"
import {
    deleteJobAction,
    getJobApplicationsAction,
    updateApplicationStatusAction,
    getApplicationResumeAction,
    uploadExternalResumeAction,
    bulkUploadExternalResumesAction,
    getExternalApplicationsAction,
    updateExternalApplicationStatusAction,
    type ExternalApplicationResponse,
    type ExternalApplicationSource,
    type ExternalApplicationStatus,
    type BulkUploadResultItem,
} from "./actions"
import { applicationApi } from "@/services/application.service"
import { toast } from "sonner"
import CreateJobForm from "./CreateJobForm"
import EditJobForm from "./EditJobForm"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import KpiCard from "@/components/common/KpiCard"

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
                        <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 shadow-red-200 shadow-lg"
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            {isDeleting ? "Deleting…" : "Delete"}
                        </Button>
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

// ─── Source label helpers ─────────────────────────────────────────────────────

const SOURCE_LABEL: Record<ExternalApplicationSource, string> = {
    EMAIL: "Email",
    LINKEDIN: "LinkedIn",
    REFERRAL: "Referral",
    OFFLINE: "Offline",
    OTHER: "Other",
}

const SOURCE_ICON: Record<ExternalApplicationSource, React.ElementType> = {
    EMAIL: Mail,
    LINKEDIN: Linkedin,
    REFERRAL: Link,
    OFFLINE: Paperclip,
    OTHER: Paperclip,
}

const SOURCE_OPTIONS: { value: ExternalApplicationSource; label: string }[] = [
    { value: "EMAIL", label: "Email" },
    { value: "LINKEDIN", label: "LinkedIn" },
    { value: "REFERRAL", label: "Referral" },
    { value: "OFFLINE", label: "Offline / Walk-in" },
    { value: "OTHER", label: "Other" },
]

// ─── Bulk Upload Modal ────────────────────────────────────────────────────────

type FileEntry = { id: string; file: File; candidateName: string }

function BulkUploadModal({
    job,
    onClose,
    onUploaded,
}: {
    job: JobResponse
    onClose: () => void
    onUploaded: (apps: ExternalApplicationResponse[]) => void
}) {
    const [entries, setEntries] = useState<FileEntry[]>([])
    const [source, setSource] = useState<ExternalApplicationSource>("OTHER")
    const [notes, setNotes] = useState("")
    const [uploading, setUploading] = useState(false)
    const [results, setResults] = useState<BulkUploadResultItem[] | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)

    function addFiles(newFiles: FileList | File[]) {
        const accepted = Array.from(newFiles).filter((f) =>
            /\.(pdf|doc|docx)$/i.test(f.name)
        )
        setEntries((prev) => [
            ...prev,
            ...accepted.map((f) => ({
                id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
                file: f,
                candidateName: f.name.replace(/\.[^.]+$/, ""),
            })),
        ])
    }

    function removeEntry(id: string) {
        setEntries((prev) => prev.filter((e) => e.id !== id))
    }

    function updateName(id: string, name: string) {
        setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, candidateName: name } : e)))
    }

    async function handleUpload() {
        if (entries.length === 0) { toast.error("Add at least one file"); return }
        setUploading(true)
        try {
            const formData = new FormData()
            entries.forEach((e) => formData.append("files", e.file))
            formData.append("candidate_names", JSON.stringify(entries.map((e) => e.candidateName)))
            formData.append("source", source)
            if (notes.trim()) formData.append("notes", notes.trim())

            const res = await bulkUploadExternalResumesAction(job.id, formData)
            setResults(res.results)

            const succeeded = res.results.filter((r) => r.success && r.data).map((r) => r.data!)
            if (succeeded.length > 0) onUploaded(succeeded)

            if (res.failed_count === 0) {
                toast.success(`${res.uploaded_count} resume${res.uploaded_count !== 1 ? "s" : ""} uploaded`)
            } else {
                toast.warning(`${res.uploaded_count} uploaded, ${res.failed_count} failed`)
            }
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Bulk upload failed")
        } finally {
            setUploading(false)
        }
    }

    const isDone = results !== null

    return (
        <Modal title="Bulk Upload Resumes" subtitle={job.title} icon={Upload} onClose={onClose} maxWidth="max-w-2xl">
            {isDone ? (
                /* ── Results view ── */
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl">
                            <CheckCircle2 className="w-4 h-4" />
                            {results.filter((r) => r.success).length} uploaded
                        </div>
                        {results.some((r) => !r.success) && (
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-xl">
                                <XCircle className="w-4 h-4" />
                                {results.filter((r) => !r.success).length} failed
                            </div>
                        )}
                    </div>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                        {results.map((r, i) => (
                            <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                                {r.success ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                    <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                                )}
                                <span className="flex-1 text-sm text-slate-700 truncate">{r.filename}</span>
                                {!r.success && r.error && (
                                    <span className="text-xs text-red-500 truncate max-w-[200px]">{r.error}</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={onClose}>Done</Button>
                    </div>
                </div>
            ) : (
                /* ── Upload form ── */
                <div className="space-y-4">
                    {/* Drop zone */}
                    <label
                        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-8 cursor-pointer transition-colors ${
                            isDragOver
                                ? "border-primary bg-primary/5"
                                : "border-slate-200 hover:border-primary/40 hover:bg-primary/5"
                        }`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={(e) => { e.preventDefault(); setIsDragOver(false); addFiles(e.dataTransfer.files) }}
                    >
                        <Upload className="w-6 h-6 text-slate-400" />
                        <p className="text-sm font-medium text-slate-600">
                            Drop files here or <span className="text-primary">browse</span>
                        </p>
                        <p className="text-xs text-slate-400">PDF, DOC, DOCX — multiple files supported</p>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            multiple
                            className="sr-only"
                            onChange={(e) => { if (e.target.files) addFiles(e.target.files) }}
                        />
                    </label>

                    {/* File list with editable names */}
                    {entries.length > 0 && (
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <div className="grid grid-cols-[1fr_1fr_auto] gap-0 bg-slate-50 px-3 py-2 border-b border-slate-200">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">File</span>
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Candidate Name</span>
                                <span />
                            </div>
                            <div className="divide-y divide-slate-100 max-h-52 overflow-y-auto">
                                {entries.map((e) => (
                                    <div key={e.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center px-3 py-2">
                                        <span className="text-xs text-slate-600 truncate" title={e.file.name}>
                                            {e.file.name}
                                        </span>
                                        <input
                                            type="text"
                                            value={e.candidateName}
                                            onChange={(ev) => updateName(e.id, ev.target.value)}
                                            className="text-xs px-2 py-1 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                                        />
                                        <button
                                            onClick={() => removeEntry(e.id)}
                                            className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
                                {entries.length} file{entries.length !== 1 ? "s" : ""} selected
                            </div>
                        </div>
                    )}

                    {/* Shared source & notes */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Source</label>
                            <div className="relative">
                                <select
                                    value={source}
                                    onChange={(e) => setSource(e.target.value as ExternalApplicationSource)}
                                    className="appearance-none w-full pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                                >
                                    {SOURCE_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Notes <span className="text-slate-400 font-normal">(optional, shared)</span>
                            </label>
                            <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="e.g. Campus drive batch"
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-slate-400">
                            {entries.length === 0 ? "No files selected" : `${entries.length} file${entries.length !== 1 ? "s" : ""} ready`}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="secondary" onClick={onClose} disabled={uploading}>
                                Cancel
                            </Button>
                            <Button onClick={handleUpload} disabled={uploading || entries.length === 0}>
                                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                {uploading ? "Uploading…" : `Upload ${entries.length > 0 ? entries.length : ""} Resume${entries.length !== 1 ? "s" : ""}`}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    )
}

// ─── Upload Resume Modal ───────────────────────────────────────────────────────

function UploadResumeModal({
    job,
    onClose,
    onUploaded,
}: {
    job: JobResponse
    onClose: () => void
    onUploaded: (app: ExternalApplicationResponse) => void
}) {
    const [candidateName, setCandidateName] = useState("")
    const [candidateEmail, setCandidateEmail] = useState("")
    const [source, setSource] = useState<ExternalApplicationSource>("OTHER")
    const [notes, setNotes] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!file) { toast.error("Please select a resume file"); return }
        if (!candidateName.trim()) { toast.error("Candidate name is required"); return }

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("candidate_name", candidateName.trim())
            if (candidateEmail.trim()) formData.append("candidate_email", candidateEmail.trim())
            formData.append("source", source)
            if (notes.trim()) formData.append("notes", notes.trim())

            const result = await uploadExternalResumeAction(job.id, formData)
            toast.success(`Resume uploaded for ${result.candidate_name}`)
            onUploaded(result)
            onClose()
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Upload failed")
        } finally {
            setUploading(false)
        }
    }

    return (
        <Modal title="Upload External Resume" subtitle={job.title} icon={Upload} onClose={onClose} maxWidth="max-w-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Candidate Name */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Candidate Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        placeholder="Full name"
                        required
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                    />
                </div>

                {/* Candidate Email */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Candidate Email <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                        type="email"
                        value={candidateEmail}
                        onChange={(e) => setCandidateEmail(e.target.value)}
                        placeholder="candidate@example.com"
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                    />
                </div>

                {/* Source */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Source</label>
                    <div className="relative">
                        <select
                            value={source}
                            onChange={(e) => setSource(e.target.value as ExternalApplicationSource)}
                            className="appearance-none w-full pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 cursor-pointer"
                        >
                            {SOURCE_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Notes <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Referred by John Smith, strong background in React…"
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-none"
                    />
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Resume File <span className="text-red-500">*</span>
                    </label>
                    <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors group">
                        <FileText className="w-5 h-5 text-slate-400 group-hover:text-primary shrink-0 transition-colors" />
                        <div className="flex-1 min-w-0">
                            {file ? (
                                <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-slate-600">Click to select file</p>
                                    <p className="text-xs text-slate-400">PDF, DOC, DOCX — max 10MB</p>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            className="sr-only"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />
                    </label>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={uploading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={uploading || !file || !candidateName.trim()}>
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {uploading ? "Uploading…" : "Upload Resume"}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

// ─── External CV Modal ────────────────────────────────────────────────────────

function ExternalCvModal({
    applicant,
    onClose,
}: {
    applicant: ExternalApplicationResponse
    onClose: () => void
}) {
    const filename = applicant.resume_filename.toLowerCase()
    const isSupported = filename.endsWith(".pdf") || filename.endsWith(".doc") || filename.endsWith(".docx")

    // Supabase sets Content-Disposition: attachment, so direct iframe embedding fails for all types.
    // Route everything through Google Docs Viewer which fetches and renders server-side.
    const embedUrl = isSupported
        ? `https://docs.google.com/gview?url=${encodeURIComponent(applicant.resume_file_url)}&embedded=true`
        : null

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [onClose])

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">
                            {applicant.candidate_name}&apos;s Resume
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                            <Badge variant="default" className="text-[10px] py-0 h-5">
                                {SOURCE_LABEL[applicant.source]}
                            </Badge>
                            {applicant.resume_filename}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="secondary" asChild>
                            <a href={applicant.resume_file_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3.5 h-3.5" />
                                Open in new tab
                            </a>
                        </Button>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-hidden rounded-b-2xl">
                    {embedUrl ? (
                        <iframe
                            src={embedUrl}
                            className="w-full h-full border-0"
                            title={`${applicant.candidate_name} resume`}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
                            <FileText className="w-10 h-10 text-slate-300" />
                            <div>
                                <p className="text-sm font-semibold text-slate-600">Preview not available</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    This file type cannot be previewed in the browser.
                                </p>
                            </div>
                            <a
                                href={applicant.resume_file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Open File
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── External Applicant Card ───────────────────────────────────────────────────

function ExternalApplicantCard({
    applicant,
    isShortlisting,
    onToggleShortlist,
    onViewCv,
    aiScore,
    threshold,
}: {
    applicant: ExternalApplicationResponse
    isShortlisting: boolean
    onToggleShortlist: () => void
    onViewCv: () => void
    aiScore?: number
    threshold?: number
}) {
    const isShortlisted = applicant.status === "REVIEWING"
    const initials = getInitials(applicant.candidate_name)
    const SourceIcon = SOURCE_ICON[applicant.source]
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
        <div className={cn(
            "border rounded-xl p-4 bg-primary/[0.02] transition-colors",
            hasScore && !aboveThreshold ? "border-slate-200 opacity-60 hover:opacity-100"
                : hasScore && aboveThreshold ? "border-emerald-200 hover:border-emerald-300"
                : "border-primary/10 hover:border-primary/20"
        )}>
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary select-none">
                    {initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                        <p className="font-semibold text-slate-900 truncate text-sm">
                            {applicant.candidate_name}
                        </p>
                        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                            {hasScore && (
                                <Badge className={cn("gap-1 text-xs font-bold", scoreBadgeClass)}>
                                    <Sparkles className="w-2.5 h-2.5" />
                                    {aiScore}%
                                </Badge>
                            )}
                            <Badge variant="default" className="gap-1 text-[10px]">
                                <SourceIcon className="w-2.5 h-2.5" />
                                {SOURCE_LABEL[applicant.source]}
                            </Badge>
                            <Badge className={cn("text-[10px]", APP_STATUS_STYLE[applicant.status as ApplicationStatus])}>
                                {APP_STATUS_LABEL[applicant.status as ApplicationStatus]}
                            </Badge>
                        </div>
                    </div>
                    {applicant.candidate_email && (
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{applicant.candidate_email}</p>
                    )}
                    {applicant.notes && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate italic">{applicant.notes}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                        Uploaded{" "}
                        {formatDistanceToNow(new Date(applicant.uploaded_at), { addSuffix: true })}
                    </p>
                </div>
            </div>

            {/* Action row */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                <Button size="sm" variant="secondary" onClick={onViewCv}>
                    <FileText className="w-3.5 h-3.5" />
                    View CV
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onToggleShortlist}
                    disabled={isShortlisting}
                    className={cn(
                        "ml-auto",
                        isShortlisted ? "text-amber-700 bg-amber-50 hover:bg-amber-100" : ""
                    )}
                >
                    {isShortlisting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                        <Star className={cn("w-3.5 h-3.5", isShortlisted && "fill-amber-500 text-amber-500")} />
                    )}
                    {isShortlisted ? "Shortlisted" : "Shortlist"}
                </Button>
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
                <Button size="sm" variant="secondary" onClick={onViewCv}>
                    <FileText className="w-3.5 h-3.5" />
                    {applicant.resume_title ?? "View CV"}
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onToggleShortlist}
                    disabled={isShortlisting}
                    className={cn(
                        "ml-auto",
                        isShortlisted ? "text-amber-700 bg-amber-50 hover:bg-amber-100" : ""
                    )}
                >
                    {isShortlisting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                        <Star className={cn("w-3.5 h-3.5", isShortlisted && "fill-amber-500 text-amber-500")} />
                    )}
                    {isShortlisted ? "Shortlisted" : "Shortlist"}
                </Button>
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
    const [externalApplicants, setExternalApplicants] = useState<ExternalApplicationResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [tab, setTab] = useState<ApplicationStatus | "ALL">("ALL")
    const [search, setSearch] = useState("")
    const [shortlisting, setShortlisting] = useState<string | null>(null)
    const [shortlistingExternal, setShortlistingExternal] = useState<string | null>(null)
    const [cvApplicant, setCvApplicant] = useState<ApplicationResponse | null>(null)
    const [cvExternalApplicant, setCvExternalApplicant] = useState<ExternalApplicationResponse | null>(null)
    const [uploadModalOpen, setUploadModalOpen] = useState(false)
    const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false)
    // Resizable panel state
    const [panelWidth, setPanelWidth] = useState(580)
    const isDragging = useRef(false)
    const dragStartX = useRef(0)
    const dragStartWidth = useRef(580)

    const MIN_WIDTH = 380
    const MAX_WIDTH = typeof window !== "undefined" ? Math.round(window.innerWidth * 0.9) : 1200

    const startResize = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        isDragging.current = true
        dragStartX.current = e.clientX
        dragStartWidth.current = panelWidth
        document.body.style.cursor = "col-resize"
        document.body.style.userSelect = "none"
    }, [panelWidth])

    useEffect(() => {
        function onMouseMove(e: MouseEvent) {
            if (!isDragging.current) return
            const delta = dragStartX.current - e.clientX   // panel anchored right: drag left = wider
            const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, dragStartWidth.current + delta))
            setPanelWidth(next)
        }
        function onMouseUp() {
            if (!isDragging.current) return
            isDragging.current = false
            document.body.style.cursor = ""
            document.body.style.userSelect = ""
        }
        window.addEventListener("mousemove", onMouseMove)
        window.addEventListener("mouseup", onMouseUp)
        return () => {
            window.removeEventListener("mousemove", onMouseMove)
            window.removeEventListener("mouseup", onMouseUp)
        }
    }, [MAX_WIDTH])

    // AI shortlisting state
    const [aiOpen, setAiOpen] = useState(false)
    const [threshold, setThreshold] = useState(70)
    const [aiScores, setAiScores] = useState<Record<string, number> | null>(null)
    const [aiAnalyzing, setAiAnalyzing] = useState(false)
    const [bulkShortlisting, setBulkShortlisting] = useState(false)

    useEffect(() => {
        setLoading(true)
        setError(null)
        Promise.all([
            getJobApplicationsAction(job.id),
            getExternalApplicationsAction(job.id),
        ])
            .then(([platform, external]) => {
                setApplicants(platform)
                setExternalApplicants(external)
            })
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
            const res = await applicationApi.scoreApplications(job.id)
            const map: Record<string, number> = {}
            res.scores.forEach(({ application_id, score }) => { map[application_id] = score })
            res.external_scores.forEach(({ external_application_id, score }) => { map[external_application_id] = score })
            setAiScores(map)
            toast.success("AI analysis complete")
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "AI analysis failed")
        } finally {
            setAiAnalyzing(false)
        }
    }

    async function toggleShortlistExternal(applicant: ExternalApplicationResponse) {
        const newStatus: ExternalApplicationStatus =
            applicant.status === "REVIEWING" ? "PENDING" : "REVIEWING"
        setShortlistingExternal(applicant.id)
        try {
            await updateExternalApplicationStatusAction(applicant.id, newStatus)
            setExternalApplicants((prev) =>
                prev.map((a) => (a.id === applicant.id ? { ...a, status: newStatus } : a)),
            )
            toast.success(newStatus === "REVIEWING" ? "Candidate shortlisted" : "Removed from shortlist")
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Failed to update status")
        } finally {
            setShortlistingExternal(null)
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
        if (!aiScores) return 0
        const platformCount = (applicants ?? []).filter((a) => (aiScores[a.id] ?? 0) >= threshold).length
        const externalCount = externalApplicants.filter((a) => (aiScores[a.id] ?? 0) >= threshold).length
        return platformCount + externalCount
    }, [applicants, externalApplicants, aiScores, threshold])

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
                className="fixed inset-y-0 right-0 z-50 bg-white shadow-2xl flex flex-col w-full"
                style={{ width: typeof window !== "undefined" && window.innerWidth < 640 ? "100%" : panelWidth }}
                role="complementary"
                aria-label="Applicants panel"
            >
                {/* Drag handle */}
                <div
                    onMouseDown={startResize}
                    className="absolute left-0 inset-y-0 w-1.5 cursor-col-resize group hidden sm:flex items-center justify-center z-10 hover:bg-primary/20 active:bg-primary/30 transition-colors"
                    title="Drag to resize"
                >
                    <div className="w-0.5 h-10 rounded-full bg-slate-300 group-hover:bg-primary group-active:bg-primary transition-colors" />
                </div>
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
                        {/* Upload external resumes */}
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setUploadModalOpen(true)}
                            title="Upload a single resume"
                        >
                            <Upload className="w-3.5 h-3.5" />
                            Upload
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setBulkUploadModalOpen(true)}
                            title="Upload multiple resumes at once"
                        >
                            <Upload className="w-3.5 h-3.5" />
                            Bulk Upload
                        </Button>
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
                                        {aboveThresholdCount} / {(applicants?.length ?? 0) + externalApplicants.length} above {threshold}%
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
                                    Promise.all([
                                        getJobApplicationsAction(job.id),
                                        getExternalApplicationsAction(job.id),
                                    ])
                                        .then(([platform, external]) => {
                                            setApplicants(platform)
                                            setExternalApplicants(external)
                                        })
                                        .catch((e: Error) => setError(e.message))
                                        .finally(() => setLoading(false))
                                }}
                                className="text-sm text-primary hover:underline cursor-pointer"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Platform applicants */}
                            {filtered.length === 0 && externalApplicants.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-600">No applicants yet</p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            No one has applied yet. You can upload external resumes using the button above.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {filtered.length > 0 && (
                                        <>
                                            {externalApplicants.length > 0 && (
                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide pb-1">
                                                    Platform Applications
                                                </p>
                                            )}
                                            {filtered.map((applicant) => (
                                                <ApplicantCard
                                                    key={applicant.id}
                                                    applicant={applicant}
                                                    isShortlisting={shortlisting === applicant.id}
                                                    onToggleShortlist={() => toggleShortlist(applicant)}
                                                    onViewCv={() => setCvApplicant(applicant)}
                                                    aiScore={aiScores ? aiScores[applicant.id] : undefined}
                                                    threshold={aiScores ? threshold : undefined}
                                                />
                                            ))}
                                        </>
                                    )}

                                    {filtered.length === 0 && tab !== "ALL" && (
                                        <div className="flex flex-col items-center py-6 gap-2 text-center">
                                            <p className="text-sm text-slate-400">No platform applicants in this category.</p>
                                            <button onClick={() => setTab("ALL")} className="text-sm text-primary hover:underline cursor-pointer">
                                                View all
                                            </button>
                                        </div>
                                    )}

                                    {/* External applicants */}
                                    {externalApplicants.length > 0 && (
                                        <>
                                            <div className="flex items-center gap-2 pt-2 pb-1">
                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                                    Externally Uploaded
                                                </p>
                                                <Badge variant="default" className="text-[10px] h-5 py-0">
                                                    {externalApplicants.length}
                                                </Badge>
                                            </div>
                                            {externalApplicants.map((applicant) => (
                                                <ExternalApplicantCard
                                                    key={applicant.id}
                                                    applicant={applicant}
                                                    isShortlisting={shortlistingExternal === applicant.id}
                                                    onToggleShortlist={() => toggleShortlistExternal(applicant)}
                                                    onViewCv={() => setCvExternalApplicant(applicant)}
                                                    aiScore={aiScores ? aiScores[applicant.id] : undefined}
                                                    threshold={aiScores ? threshold : undefined}
                                                />
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                        </>
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

            {/* External CV Modal */}
            {cvExternalApplicant && (
                <ExternalCvModal applicant={cvExternalApplicant} onClose={() => setCvExternalApplicant(null)} />
            )}

            {/* Upload External Resume Modal */}
            {uploadModalOpen && (
                <UploadResumeModal
                    job={job}
                    onClose={() => setUploadModalOpen(false)}
                    onUploaded={(app) => setExternalApplicants((prev) => [app, ...prev])}
                />
            )}

            {/* Bulk Upload Modal */}
            {bulkUploadModalOpen && (
                <BulkUploadModal
                    job={job}
                    onClose={() => setBulkUploadModalOpen(false)}
                    onUploaded={(apps) => setExternalApplicants((prev) => [...apps, ...prev])}
                />
            )}
        </>
    )
}


// ─── Main Component ───────────────────────────────────────────────────────────

export default function JobPageClient({ jobs }: { jobs: JobResponse[] }) {
    const router = useRouter()
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold text-slate-900">Job Postings</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Manage your open, draft, and closed job listings.
                        </p>
                    </div>
                    <Button onClick={openCreate} className="shrink-0 w-full sm:w-auto">
                        <Plus className="w-4 h-4" />
                        Post a Job
                    </Button>
                </div>

                {/* ── Stats Row ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <KpiCard label="Total" value={stats.total} icon={Briefcase} iconColor="text-primary" iconBg="bg-primary/10" />
                    <KpiCard label="Open" value={stats.open} icon={CheckCircle2} iconColor="text-emerald-600" iconBg="bg-emerald-50" />
                    <KpiCard label="Draft" value={stats.draft} icon={Pencil} iconColor="text-amber-600" iconBg="bg-amber-50" />
                    <KpiCard label="Closed" value={stats.closed} icon={XCircle} iconColor="text-slate-500" iconBg="bg-slate-100" />
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
                        <Button onClick={openCreate} className="mt-1">
                            <Plus className="w-4 h-4" />
                            Post your first job
                        </Button>
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
                                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                                <Briefcase className="w-4 h-4 text-primary" />
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
                                                        <Badge
                                                            className={cn("gap-1.5 text-xs font-semibold", badge.className)}
                                                        >
                                                            <span className={cn("w-1.5 h-1.5 rounded-full", badge.dot)} />
                                                            {badge.label}
                                                        </Badge>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-4 py-3.5">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Button
                                                                size="sm"
                                                                onClick={() => router.push(`/recruiter/job/${job.id}/applicants`)}
                                                                aria-label={`View applicants for ${job.title}`}
                                                            >
                                                                <Users className="w-3.5 h-3.5" />
                                                                Applicants
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                onClick={() => openEdit(job)}
                                                                aria-label={`Edit ${job.title}`}
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" />
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => openDelete(job)}
                                                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                aria-label={`Delete ${job.title}`}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                Delete
                                                            </Button>
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
