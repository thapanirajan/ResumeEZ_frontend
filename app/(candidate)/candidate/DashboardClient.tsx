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
    BarChart3,
    Target,
    MapPin,
    ArrowUpRight,
    AlertCircle,
    Search,
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
    ResponsiveContainer,
} from "recharts"
import { formatDistanceToNow } from "date-fns"
import UserDropdown from "@/components/common/UserDropDown"
import NotificationCenter from "@/components/common/NotificationCenter"
import KpiCard from "@/components/common/KpiCard"
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

    const { kpi, status_breakdown, weekly_applications, score_distribution, match_trend, top_missing_skills, recent_applications } = data;

    // Filter out zero-count statuses for the donut
    const donutData = status_breakdown.filter((s) => s.count > 0)

    const kpiCards = [
        {
            label: "Total Applications",
            value: kpi.total_applications,
            sub: `${kpi.pending} pending review`,
            icon: Briefcase,
            iconColor: "text-violet-500",
        },
        {
            label: "Shortlisted",
            value: kpi.shortlisted,
            sub: kpi.total_applications > 0
                ? `${Math.round((kpi.shortlisted / kpi.total_applications) * 100)}% rate`
                : "no applications yet",
            icon: Star,
            iconColor: "text-indigo-500",
        },
        {
            label: "Avg AI Match Score",
            value: kpi.avg_ai_score !== null ? `${kpi.avg_ai_score}%` : "—",
            sub: kpi.avg_ai_score !== null
                ? kpi.avg_ai_score >= 70 ? "Strong match" : "Room to improve"
                : "run AI scoring",
            icon: Target,
            iconColor: "text-emerald-500",
        },
        {
            label: "Resumes",
            value: kpi.total_resumes,
            sub: `${kpi.total_skill_gap_reports} gap analyses run`,
            icon: FileText,
            iconColor: "text-sky-500",
        },
    ]

    return (
        <div className="min-h-screen bg-[#f6f7f9] space-y-6 pb-8">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                        {greeting()}, {data.full_name ?? emailPrefix} 👋
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-1">
                        Here&apos;s your job search snapshot.
                        {data.current_role && (
                            <span className="text-slate-400">· {data.current_role}</span>
                        )}
                        {data.location && (
                            <span className="inline-flex items-center gap-0.5 text-slate-400">
                                <MapPin className="w-3 h-3" /> {data.location}
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                    <NotificationCenter userRole="JOB_SEEKER" />
                    <UserDropdown />
                </div>
            </div>



            {/* ── KPI Grid ── */}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {kpiCards.map((c) => (
                    <KpiCard key={c.label} {...c} />
                ))}
            </div>

            {/* ── Row 2: Status Donut + Weekly Applications ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

                {/* Application Status Donut */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">

                    {/* Header */}
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-violet-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 text-sm">Application Status</p>
                            <p className="text-xs text-slate-400">
                                Breakdown of your applications
                            </p>
                        </div>
                    </div>

                    {donutData.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-10">
                            No applications yet
                        </div>
                    ) : (
                        <>
                            {/* Chart */}
                            <div className="relative flex items-center justify-center">

                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={donutData}
                                            dataKey="count"
                                            nameKey="status"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={85}
                                            paddingAngle={2}
                                            strokeWidth={0}
                                        >
                                            {donutData.map((entry) => (
                                                <Cell
                                                    key={entry.status}
                                                    fill={STATUS_COLOR[entry.status] ?? "#94a3b8"}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<ChartTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>

                                {/* CENTER CONTENT */}
                                <div className="absolute text-center">
                                    <p className="text-2xl font-bold text-slate-900">
                                        {kpi.total_applications}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        total
                                    </p>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="mt-6 space-y-2">
                                {status_breakdown.map((s) => {
                                    const percent =
                                        kpi.total_applications > 0
                                            ? Math.round((s.count / kpi.total_applications) * 100)
                                            : 0

                                    return (
                                        <div
                                            key={s.status}
                                            className="flex items-center justify-between text-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-2.5 h-2.5 rounded-full"
                                                    style={{ background: STATUS_COLOR[s.status] }}
                                                />
                                                <span className="text-slate-600">
                                                    {STATUS_LABEL[s.status]}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 text-xs">
                                                <span className="text-slate-500">
                                                    {percent}%
                                                </span>
                                                <span className="font-semibold text-slate-800 w-6 text-right">
                                                    {s.count}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Weekly Applications Area Chart */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <p className="font-semibold text-slate-900 text-sm">
                                Applications Over Time
                            </p>
                            <p className="text-xs text-slate-400">
                                Track your weekly activity
                            </p>
                        </div>

                        <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full">
                            {kpi.total_applications} total
                        </span>
                    </div>

                    {/* Chart */}
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={weekly_applications} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>

                            {/* Gradient */}
                            <defs>
                                <linearGradient id="smoothGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            {/* Minimal grid */}
                            <CartesianGrid
                                stroke="#f1f5f9"
                                strokeDasharray="3 3"
                                vertical={false}
                            />

                            {/* Axes */}
                            <XAxis
                                dataKey="week"
                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                axisLine={false}
                                tickLine={false}
                                allowDecimals={false}
                            />

                            {/* Tooltip */}
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "10px",
                                    border: "1px solid #f1f5f9",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                                    fontSize: "12px",
                                }}
                                cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                            />

                            {/* Area */}
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#4f46e5"
                                strokeWidth={3}
                                fill="url(#smoothGradient)"
                                dot={false}
                                activeDot={{
                                    r: 6,
                                    fill: "#4f46e5",
                                    stroke: "#fff",
                                    strokeWidth: 2,
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Row 3: AI Score Distribution + Skill Gap Match Trend ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* AI Score Distribution */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <p className="font-semibold text-slate-900 text-sm">
                                AI Match Score Distribution
                            </p>
                            <p className="text-xs text-slate-400">
                                How well your applications are performing
                            </p>
                        </div>

                        {kpi.avg_ai_score !== null && (
                            <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${scoreBg(kpi.avg_ai_score)} ${scoreColor(kpi.avg_ai_score)}`}>
                                avg {kpi.avg_ai_score}%
                            </div>
                        )}
                    </div>

                    {/* Chart */}
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                            data={score_distribution}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            barCategoryGap={20}
                        >

                            {/* Minimal grid */}
                            <CartesianGrid
                                stroke="#f8fafc"
                                vertical={false}
                            />

                            {/* Axes */}
                            <XAxis
                                dataKey="range"
                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                axisLine={false}
                                tickLine={false}
                                allowDecimals={false}
                            />

                            {/* Tooltip */}
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "10px",
                                    border: "1px solid #f1f5f9",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                                    fontSize: "12px",
                                }}
                                cursor={{ fill: "rgba(0,0,0,0.02)" }}
                            />

                            {/* Bars */}
                            <Bar
                                dataKey="count"
                                radius={[8, 8, 0, 0]}
                            >
                                {score_distribution.map((entry) => {
                                    let color = "#e2e8f0" // default neutral

                                    if (entry.range === "0–25") color = "#ef4444"      // bad
                                    else if (entry.range === "26–50") color = "#f59e0b" // warning
                                    else if (entry.range === "51–75") color = "#6366f1" // good
                                    else if (entry.range === "76–100") color = "#10b981" // excellent

                                    return (
                                        <Cell
                                            key={entry.range}
                                            fill={color}
                                        />
                                    )
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    {/* Insight hint */}
                    <p className="text-xs text-slate-400 mt-4">
                        Aim for scores above <span className="text-emerald-600 font-medium">75%</span> to increase your chances of getting shortlisted.
                    </p>
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

            {/* ── Top Missing Skills (Clean + Balanced) ── */}
            {top_missing_skills.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-semibold text-slate-800">
                            Skill gaps
                        </p>

                        <button
                            onClick={() => router.push("/candidate/skill-gap")}
                            className="text-xs text-slate-500 hover:text-slate-700 transition"
                        >
                            View all →
                        </button>
                    </div>

                    {/* List */}
                    <div className="divide-y divide-slate-100">

                        {top_missing_skills.slice(0, 6).map((skill, index) => {

                            const isTop = index === 0

                            return (
                                <div
                                    key={skill.skill}
                                    className={`flex items-center justify-between py-3 group ${isTop ? "bg-slate-50 -mx-2 px-2 rounded-lg" : ""
                                        }`}
                                >

                                    {/* Left */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-slate-400 w-4">
                                            {index + 1}
                                        </span>

                                        <span className={`text-sm ${isTop ? "font-semibold text-slate-900" : "text-slate-700"
                                            }`}>
                                            {skill.skill}
                                        </span>
                                    </div>

                                    {/* Right */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400">
                                            {skill.count}
                                        </span>

                                        {isTop && (
                                            <span className="text-[10px] font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                                                highest
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Insight */}
                    <p className="text-xs text-slate-400 mt-4">
                        Focus on the top skills to improve your match rate faster.
                    </p>
                </div>
            )}

            {/* ── Recent Applications (Activity Feed) ── */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-slate-800">
                        Recent activity
                    </p>

                    <button
                        onClick={() => router.push("/candidate/job")}
                        className="text-xs text-slate-500 hover:text-slate-700 transition"
                    >
                        View all →
                    </button>
                </div>

                {recent_applications.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 text-sm">
                        You haven’t applied yet — let’s get started 🚀
                    </div>
                ) : (
                    <div className="space-y-3">

                        {recent_applications.map((app) => {

                            const isGood = app.ai_score !== null && app.ai_score >= 70
                            const isMid = app.ai_score !== null && app.ai_score >= 50

                            return (
                                <div
                                    key={app.id}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition group"
                                >

                                    {/* LEFT */}
                                    <div className="flex items-start gap-3">

                                        {/* Status dot */}
                                        <div
                                            className="w-2 h-2 rounded-full mt-2"
                                            style={{ background: STATUS_COLOR[app.status] }}
                                        />

                                        <div>
                                            {/* Title */}
                                            <p className="text-sm font-medium text-slate-900">
                                                {app.job_title}
                                            </p>

                                            {/* Meta */}
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {STATUS_LABEL[app.status]} ·{" "}
                                                {formatDistanceToNow(new Date(app.applied_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* RIGHT */}
                                    <div className="flex items-center gap-3">

                                        {/* AI Score */}
                                        {app.ai_score !== null && (
                                            <span
                                                className={`text-xs font-medium ${isGood
                                                    ? "text-emerald-600"
                                                    : isMid
                                                        ? "text-amber-600"
                                                        : "text-slate-400"
                                                    }`}
                                            >
                                                {app.ai_score}%
                                            </span>
                                        )}

                                        {/* Arrow */}
                                        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition" />
                                    </div>

                                </div>
                            )
                        })}
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
