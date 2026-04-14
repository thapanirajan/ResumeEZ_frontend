"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
    FileText,
    Briefcase,
    Star,
    CheckCircle2,
    XCircle,
    Clock,
    TrendingUp,
    BarChart3,
    Target,
    MapPin,
    ArrowUpRight,
    AlertCircle,
    ChevronRight,
    Search,
    Sparkles,
    BookOpen,
} from "lucide-react"
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import { formatDistanceToNow } from "date-fns"
import UserDropdown from "@/components/common/UserDropDown"
import NotificationCenter from "@/components/common/NotificationCenter"
import { useAuth } from "@/hooks/useAuth"
import api from "@/util/api"

// ── Types ──────────────────────────────────────────────────────────────────────

interface KPI {
    total_applications: number
    pending: number
    shortlisted: number
    accepted: number
    rejected: number
    total_resumes: number
    total_skill_gap_reports: number
    avg_ai_score: number | null
    avg_match_percentage: number | null
    profile_score: number | null
}

interface DashboardData {
    full_name: string | null
    current_role: string | null
    location: string | null
    profile_score: number | null
    skills: string[]
    kpi: KPI
    status_breakdown: { status: string; count: number }[]
    weekly_applications: { week: string; count: number }[]
    score_distribution: { range: string; count: number }[]
    match_trend: { label: string; match_pct: number }[]
    top_missing_skills: { skill: string; count: number }[]
    recent_applications: {
        id: string
        job_title: string
        company_name: string | null
        status: string
        ai_score: number | null
        applied_at: string
    }[]
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function greeting() {
    const h = new Date().getHours()
    if (h < 12) return "Good morning"
    if (h < 17) return "Good afternoon"
    return "Good evening"
}

function scoreColor(score: number | null) {
    if (score === null) return "text-slate-400"
    if (score >= 75) return "text-emerald-600"
    if (score >= 50) return "text-amber-600"
    return "text-red-500"
}

function scoreBg(score: number | null) {
    if (score === null) return "bg-slate-100"
    if (score >= 75) return "bg-emerald-100"
    if (score >= 50) return "bg-amber-100"
    return "bg-red-100"
}

const STATUS_COLOR: Record<string, string> = {
    PENDING: "#f59e0b",
    REVIEWING: "#6366f1",
    ACCEPTED: "#10b981",
    REJECTED: "#ef4444",
}

const STATUS_LABEL: Record<string, string> = {
    PENDING: "Pending",
    REVIEWING: "Shortlisted",
    ACCEPTED: "Accepted",
    REJECTED: "Rejected",
}

const STATUS_ICON: Record<string, React.ElementType> = {
    PENDING: Clock,
    REVIEWING: Star,
    ACCEPTED: CheckCircle2,
    REJECTED: XCircle,
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function SkeletonBlock({ className = "" }: { className?: string }) {
    return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <SkeletonBlock className="h-8 w-56" />
                    <SkeletonBlock className="h-4 w-72" />
                </div>
                <div className="flex gap-2">
                    <SkeletonBlock className="h-10 w-10 rounded-xl" />
                    <SkeletonBlock className="h-10 w-10 rounded-xl" />
                </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <SkeletonBlock key={i} className="h-32 rounded-2xl" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <SkeletonBlock className="lg:col-span-2 h-72 rounded-2xl" />
                <SkeletonBlock className="lg:col-span-3 h-72 rounded-2xl" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SkeletonBlock className="h-64 rounded-2xl" />
                <SkeletonBlock className="h-64 rounded-2xl" />
            </div>
            <SkeletonBlock className="h-64 rounded-2xl" />
        </div>
    )
}

// ── KPI Card ───────────────────────────────────────────────────────────────────

function KpiCard({
    label,
    value,
    sub,
    icon: Icon,
    accent,
}: {
    label: string
    value: string | number
    sub?: string
    icon: React.ElementType
    accent: string
}) {
    return (
        <div className={`relative bg-white rounded-2xl p-5 border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow`}>
            <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} />
            <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">{label}</p>
                    <p className="text-3xl font-black text-slate-900 leading-none">{value}</p>
                    {sub && <p className="text-xs text-slate-400 font-medium mt-1">{sub}</p>}
                </div>
                <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${accent.replace("bg-", "bg-").split(" ")[0]}/10`}>
                    <Icon className="w-5 h-5 text-slate-600" />
                </div>
            </div>
        </div>
    )
}

// ── Custom tooltip ─────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: Record<string, unknown>) {
    if (!active || !payload || !(payload as unknown[]).length) return null
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg px-3 py-2 text-sm">
            <p className="font-semibold text-slate-700 mb-1">{label as string}</p>
            {(payload as Array<{ name: string; value: number; color: string }>).map((p) => (
                <p key={p.name} style={{ color: p.color }} className="font-medium">
                    {p.name}: <span className="text-slate-900">{p.value}</span>
                </p>
            ))}
        </div>
    )
}

// ── Status badge ───────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    REVIEWING: "bg-violet-50 text-violet-700 border-violet-200",
    ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: "bg-red-50 text-red-600 border-red-200",
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function CandidateDashboard() {
    const { user } = useAuth()
    const router = useRouter()
    const emailPrefix = user?.email?.split("@")[0] ?? "there"

    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        api.get<DashboardData>("/api/candidate/dashboard/")
            .then((res) => setData(res.data))
            .catch((e) => setError(e?.response?.data?.message ?? e?.message ?? "Failed to load dashboard"))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <DashboardSkeleton />

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="w-7 h-7 text-red-500" />
                </div>
                <p className="text-slate-600 font-medium">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold"
                >
                    Retry
                </button>
            </div>
        )
    }

    if (!data) return null

    const { kpi, status_breakdown, weekly_applications, score_distribution, match_trend, top_missing_skills, recent_applications } = data

    // Filter out zero-count statuses for the donut
    const donutData = status_breakdown.filter((s) => s.count > 0)

    const kpiCards = [
        {
            label: "Total Applications",
            value: kpi.total_applications,
            sub: `${kpi.pending} pending review`,
            icon: Briefcase,
            accent: "bg-violet-500",
        },
        {
            label: "Shortlisted",
            value: kpi.shortlisted,
            sub: kpi.total_applications > 0
                ? `${Math.round((kpi.shortlisted / kpi.total_applications) * 100)}% rate`
                : "no applications yet",
            icon: Star,
            accent: "bg-indigo-500",
        },
        {
            label: "Avg AI Match Score",
            value: kpi.avg_ai_score !== null ? `${kpi.avg_ai_score}%` : "—",
            sub: kpi.avg_ai_score !== null
                ? kpi.avg_ai_score >= 70 ? "Strong match" : "Room to improve"
                : "run AI scoring",
            icon: Target,
            accent: "bg-emerald-500",
        },
        {
            label: "Resumes",
            value: kpi.total_resumes,
            sub: `${kpi.total_skill_gap_reports} gap analyses run`,
            icon: FileText,
            accent: "bg-sky-500",
        },
    ]

    return (
        <div className="min-h-screen bg-[#f6f7f9] space-y-6 pb-8">

            {/* ── Header ── */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        {greeting()}, {data.full_name ?? emailPrefix} 👋
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Here&apos;s your job search snapshot.
                        {data.current_role && (
                            <span className="ml-1 text-slate-400">· {data.current_role}</span>
                        )}
                        {data.location && (
                            <span className="ml-1 inline-flex items-center gap-0.5 text-slate-400">
                                <MapPin className="w-3 h-3" /> {data.location}
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            placeholder="Search jobs or skills…"
                            className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-52"
                        />
                    </div>
                    <NotificationCenter userRole="JOB_SEEKER" />
                    <UserDropdown />
                </div>
            </div>

            {/* ── Profile + Quick Actions strip ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shrink-0">
                        {(data.full_name ?? emailPrefix).charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">{data.full_name ?? emailPrefix}</p>
                        <p className="text-xs text-slate-500">{data.current_role ?? "No role set"}</p>
                    </div>
                    {/* Profile score pill */}
                    {data.profile_score !== null && (
                        <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${scoreBg(data.profile_score)} ${scoreColor(data.profile_score)}`}>
                            <Sparkles className="w-3 h-3" />
                            Profile score: {data.profile_score}%
                        </div>
                    )}
                </div>

                {/* Skill pills */}
                <div className="flex flex-wrap gap-1.5 max-w-lg">
                    {data.skills.length > 0 ? (
                        data.skills.slice(0, 8).map((s) => (
                            <span key={s} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                                {s}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-slate-400">No skills added yet</span>
                    )}
                </div>

                {/* Quick links */}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => router.push("/candidate/resume")}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 hover:border-primary/30 hover:text-primary transition-colors"
                    >
                        <FileText className="w-3.5 h-3.5" />
                        Resumes
                    </button>
                    <button
                        onClick={() => router.push("/candidate/job")}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 hover:border-primary/30 hover:text-primary transition-colors"
                    >
                        <Briefcase className="w-3.5 h-3.5" />
                        Browse Jobs
                    </button>
                    <button
                        onClick={() => router.push("/candidate/skill-gap")}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-sm shadow-primary/20 hover:brightness-110 transition-all"
                    >
                        <Target className="w-3.5 h-3.5" />
                        Skill Gap
                    </button>
                </div>
            </div>

            {/* ── KPI Grid ── */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {kpiCards.map((c) => (
                    <KpiCard key={c.label} {...c} />
                ))}
            </div>

            {/* ── Row 2: Status Donut + Weekly Applications ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

                {/* Application Status Donut */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-violet-600" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm">Application Status</p>
                            <p className="text-xs text-slate-400">Breakdown of all {kpi.total_applications} applications</p>
                        </div>
                    </div>

                    {donutData.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-300 py-8">
                            <Briefcase className="w-10 h-10 opacity-30" />
                            <p className="text-sm">No applications yet</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1">
                                <ResponsiveContainer width="100%" height={180}>
                                    <PieChart>
                                        <Pie
                                            data={donutData}
                                            dataKey="count"
                                            nameKey="status"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={52}
                                            outerRadius={80}
                                            paddingAngle={3}
                                            strokeWidth={0}
                                        >
                                            {donutData.map((entry) => (
                                                <Cell key={entry.status} fill={STATUS_COLOR[entry.status] ?? "#94a3b8"} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(val, name) => [val, STATUS_LABEL[name as string] ?? name]}
                                            contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {status_breakdown.map((s) => {
                                    const Icon = STATUS_ICON[s.status] ?? Clock
                                    return (
                                        <div key={s.status} className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_COLOR[s.status] }} />
                                            <p className="text-xs text-slate-500 truncate">
                                                {STATUS_LABEL[s.status]}
                                            </p>
                                            <p className="text-xs font-bold text-slate-800 ml-auto">{s.count}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Weekly Applications Area Chart */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-sky-600" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 text-sm">Applications Over Time</p>
                                <p className="text-xs text-slate-400">Last 8 weeks</p>
                            </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                            {kpi.total_applications} total
                        </span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={weekly_applications} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={<ChartTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="count"
                                name="Applications"
                                stroke="#6366f1"
                                strokeWidth={2.5}
                                fill="url(#areaGrad)"
                                dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }}
                                activeDot={{ r: 5, fill: "#6366f1" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Row 3: AI Score Distribution + Skill Gap Match Trend ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* AI Score Distribution */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <Target className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm">AI Score Distribution</p>
                            <p className="text-xs text-slate-400">
                                Across {score_distribution.reduce((a, b) => a + b.count, 0)} scored applications
                            </p>
                        </div>
                        {kpi.avg_ai_score !== null && (
                            <div className={`ml-auto px-2.5 py-1 rounded-full text-xs font-bold ${scoreBg(kpi.avg_ai_score)} ${scoreColor(kpi.avg_ai_score)}`}>
                                avg {kpi.avg_ai_score}%
                            </div>
                        )}
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={score_distribution} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={36}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="count" name="Applications" radius={[6, 6, 0, 0]}>
                                {score_distribution.map((entry) => {
                                    const r = entry.range
                                    const fill = r === "76–100" ? "#10b981" : r === "51–75" ? "#6366f1" : r === "26–50" ? "#f59e0b" : "#ef4444"
                                    return <Cell key={r} fill={fill} />
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Skill Gap Match Trend */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm">Skill Gap Match Trend</p>
                            <p className="text-xs text-slate-400">
                                {kpi.total_skill_gap_reports} analyses run
                                {kpi.avg_match_percentage !== null && ` · avg ${kpi.avg_match_percentage}%`}
                            </p>
                        </div>
                    </div>
                    {match_trend.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 gap-3 text-slate-300">
                            <BookOpen className="w-10 h-10 opacity-30" />
                            <p className="text-sm font-medium">No skill gap reports yet</p>
                            <button
                                onClick={() => router.push("/candidate/skill-gap")}
                                className="text-xs text-primary font-semibold underline"
                            >
                                Run your first analysis →
                            </button>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={match_trend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.15} />
                                        <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                <Tooltip content={<ChartTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="match_pct"
                                    name="Match %"
                                    stroke="#f59e0b"
                                    strokeWidth={2.5}
                                    dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* ── Row 4: Top Missing Skills ── */}
            {top_missing_skills.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 text-sm">Top Missing Skills</p>
                                <p className="text-xs text-slate-400">Most frequent skill gaps across all your analyses</p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push("/candidate/skill-gap")}
                            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                            View analysis <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Horizontal bar */}
                        <ResponsiveContainer width="100%" height={Math.max(160, top_missing_skills.length * 32)}>
                            <BarChart
                                data={top_missing_skills}
                                layout="vertical"
                                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                                barSize={14}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <YAxis type="category" dataKey="skill" tick={{ fontSize: 11, fill: "#475569" }} axisLine={false} tickLine={false} width={90} />
                                <Tooltip content={<ChartTooltip />} />
                                <Bar dataKey="count" name="Appearances" fill="#ef4444" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>

                        {/* Skill tags */}
                        <div className="flex flex-wrap content-start gap-2 py-2">
                            {top_missing_skills.map((s) => (
                                <div
                                    key={s.skill}
                                    className="group flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full hover:border-red-300 transition-colors cursor-default"
                                >
                                    <span className="text-xs font-semibold text-red-700">{s.skill}</span>
                                    <span className="text-[10px] font-bold text-red-400 bg-red-100 px-1.5 py-0.5 rounded-full leading-none">
                                        ×{s.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Row 5: Recent Applications Table ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm">Recent Applications</p>
                            <p className="text-xs text-slate-400">Your 5 most recent applications</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push("/candidate/job")}
                        className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                        Browse jobs <ChevronRight className="w-3 h-3" />
                    </button>
                </div>

                {recent_applications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 gap-3 text-slate-300">
                        <Briefcase className="w-10 h-10 opacity-30" />
                        <p className="text-sm font-medium text-slate-400">No applications yet</p>
                        <button
                            onClick={() => router.push("/candidate/job")}
                            className="text-xs text-primary font-semibold underline"
                        >
                            Find your first job →
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {recent_applications.map((app) => (
                            <div key={app.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors group">
                                {/* Job info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 text-sm truncate">{app.job_title}</p>
                                    {app.company_name && (
                                        <p className="text-xs text-slate-500 mt-0.5 truncate">{app.company_name}</p>
                                    )}
                                </div>

                                {/* AI Score */}
                                <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                                    {app.ai_score !== null ? (
                                        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${scoreBg(app.ai_score)} ${scoreColor(app.ai_score)}`}>
                                            <Sparkles className="w-3 h-3" />
                                            {app.ai_score}%
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-300 font-medium px-2">—</span>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="shrink-0">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${STATUS_BADGE[app.status] ?? "bg-slate-50 text-slate-500 border-slate-200"}`}>
                                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: STATUS_COLOR[app.status] }} />
                                        {STATUS_LABEL[app.status] ?? app.status}
                                    </span>
                                </div>

                                {/* Time */}
                                <p className="hidden md:block text-xs text-slate-400 shrink-0 w-24 text-right">
                                    {formatDistanceToNow(new Date(app.applied_at), { addSuffix: true })}
                                </p>

                                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors shrink-0" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Footer ── */}
            <p className="text-center text-xs text-slate-400 pb-2">
                Run more skill gap analyses to improve your match score and unlock better job recommendations.
            </p>
        </div>
    )
}
