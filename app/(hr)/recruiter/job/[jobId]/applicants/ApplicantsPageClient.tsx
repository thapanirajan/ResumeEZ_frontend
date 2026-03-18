"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import {
    ArrowLeft,
    Search,
    SlidersHorizontal,
    ArrowDownUp,
    Sparkles,
    Users,
    Star,
    Eye,
    X,
    Loader2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { toast } from "sonner"

import { JobResponse } from "@/types/job"
import { ApplicationResponse, ApplicationStatus } from "@/types/application"
import {
    ExternalApplicationResponse,
    scoreJobApplicationsAction,
    updateApplicationStatusAction,
    updateExternalApplicationStatusAction,
    getApplicationResumeAction,
} from "../../actions"
import ScoreRing from "./ScoreRing"

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
        "bg-indigo-100 text-indigo-700",
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

// Extract top keywords from job description for skills matching
function extractJobKeywords(description: string): string[] {
    const stopWords = new Set([
        "the", "and", "or", "to", "a", "an", "in", "of", "for", "with",
        "is", "are", "will", "we", "you", "our", "your", "be", "as",
        "at", "by", "on", "this", "that", "have", "has", "from",
    ])
    return [...new Set(
        description
            .toLowerCase()
            .match(/\b[a-z][a-z+#.]{2,}\b/g) ?? []
    )].filter((w) => !stopWords.has(w)).slice(0, 40)
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
                            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
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
                            className="text-xs font-semibold text-indigo-600 hover:underline"
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
                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
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

    // AI scores
    const [aiScores, setAiScores] = useState<Record<string, number> | null>(null)
    const [aiRunning, setAiRunning] = useState(false)

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

    // Job keywords for skills matching
    const jobKeywords = useMemo(() => extractJobKeywords(job.description), [job.description])

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
            ? allRows.filter((r) => (aiScores[r.data.id] ?? 0) >= 70).length
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
                (a, b) => (aiScores[b.data.id] ?? 0) - (aiScores[a.data.id] ?? 0),
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
            const s = aiScores[r.data.id] ?? 0
            if (s > bestScore) { bestScore = s; best = r.data.id }
        }
        return best
    }, [allRows, aiScores])

    // ── Run AI Scores ────────────────────────────────────────────────────────

    const runAiScores = useCallback(async () => {
        setAiRunning(true)
        try {
            const result = await scoreJobApplicationsAction(job.id)
            const map: Record<string, number> = {}
            for (const s of result.scores) map[s.application_id] = s.score
            for (const s of result.external_scores) map[s.external_application_id] = s.score
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
                            className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
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

                <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={runAiScores}
                        disabled={aiRunning}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-60"
                    >
                        {aiRunning ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                        {aiRunning ? "Scoring…" : "Run AI Scores"}
                    </button>
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
                        <Sparkles className="w-16 h-16 text-indigo-600" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-500 font-medium text-sm">AI Suggested</p>
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                    </div>
                    <p className="text-3xl font-black text-slate-900">{stats.aiSuggested}</p>
                    <p className="mt-1 text-xs text-indigo-600 font-semibold">
                        {aiScores ? "Scores available — ≥70% match" : "Run AI Scores to see matches"}
                    </p>
                </div>
            </div>

            {/* ── Filter Bar ── */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search */}
                <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        placeholder="Search by name or email…"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
                                    ? "bg-indigo-600 text-white"
                                    : "text-slate-500 hover:text-slate-900"
                            }`}
                        >
                            {t.label}
                            {(tabCounts[t.key] ?? 0) > 0 && (
                                <span className={`ml-1.5 text-[10px] font-bold ${tab === t.key ? "text-indigo-200" : "text-slate-400"}`}>
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
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                            : "bg-white text-slate-600 border-slate-200 hover:border-indigo-200"
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
                                    const score = aiScores?.[id]
                                    const isTopMatch = id === topMatchId && score !== undefined
                                    const isToggling = togglingId === id
                                    const isShortlisted = status === "REVIEWING"
                                    const appliedAt =
                                        row.kind === "platform"
                                            ? row.data.applied_at
                                            : row.data.uploaded_at
                                    // Top job requirement keywords shown as context pills
                                    const topKeywords = jobKeywords.slice(0, 4)

                                    return (
                                        <tr
                                            key={id}
                                            className={`group transition-colors ${
                                                isTopMatch
                                                    ? "bg-indigo-50/60 hover:bg-indigo-50"
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

                                            {/* Skills Match — job keywords shown as context */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1 max-w-[220px]">
                                                    {topKeywords.length > 0 ? topKeywords.map((kw) => (
                                                        <span
                                                            key={kw}
                                                            className="text-[11px] font-medium bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full"
                                                        >
                                                            {kw}
                                                        </span>
                                                    )) : (
                                                        <span className="text-xs text-slate-300">—</span>
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
                                                    {/* View CV */}
                                                    <button
                                                        onClick={() =>
                                                            row.kind === "platform"
                                                                ? setCvApp(row.data)
                                                                : setCvExtApp(row.data)
                                                        }
                                                        className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                                                        title="View CV"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>

                                                    {/* Shortlist / Unshortlist */}
                                                    <button
                                                        onClick={() => toggleStatus(row)}
                                                        disabled={isToggling}
                                                        className={`p-2 rounded-lg transition-colors ${
                                                            isShortlisted
                                                                ? "text-emerald-500 hover:bg-emerald-50"
                                                                : "text-slate-400 hover:text-emerald-500 hover:bg-emerald-50"
                                                        }`}
                                                        title={isShortlisted ? "Remove from shortlist" : "Shortlist"}
                                                    >
                                                        {isToggling ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Star
                                                                className={`w-4 h-4 ${isShortlisted ? "fill-emerald-500" : ""}`}
                                                            />
                                                        )}
                                                    </button>

                                                    {/* Reject */}
                                                    <button
                                                        onClick={() => rejectRow(row)}
                                                        disabled={isToggling || status === "REJECTED"}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                                                        title="Reject"
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
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors disabled:opacity-40"
                        >
                            Next
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Modals ── */}
            {cvApp && <CvModal application={cvApp} onClose={() => setCvApp(null)} />}
            {cvExtApp && <ExternalCvModal application={cvExtApp} onClose={() => setCvExtApp(null)} />}
        </div>
    )
}
