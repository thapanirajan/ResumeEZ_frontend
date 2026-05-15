"use client";

import {
    Briefcase,
    CheckCircle2,
    Clock,
    FileText,
    Search,
    TrendingUp,
    AlertCircle,
    LayoutDashboard,
} from "lucide-react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import UserDropdown from "@/components/common/UserDropDown";
import NotificationCenter from "@/components/common/NotificationCenter";
import KpiCard from "@/components/common/KpiCard";
import {
    ApplicationSourceValue,
    ApplicationStatusValue,
    JobStatusValue,
    RecruiterDashboardData,
} from "@/types/recruiter_dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ── Color maps ────────────────────────────────────────────────────────────────

const PIPELINE_ORDER: ApplicationStatusValue[] = ["PENDING", "REVIEWING", "ACCEPTED", "REJECTED"];
const JOB_STATUS_ORDER: JobStatusValue[] = ["OPEN", "DRAFT", "CLOSED"];

function toCountMap(rows?: Array<{ status: string; count: number }>) {
    const map: Record<string, number> = {};
    (rows ?? []).forEach((r) => {
        map[r.status] = r.count;
    });
    return map;
}

const STATUS_COLORS: Record<ApplicationStatusValue, string> = {
    PENDING:   "#F59E0B",
    REVIEWING: "#6366F1",
    ACCEPTED:  "#10B981",
    REJECTED:  "#EF4444",
};

const JOB_STATUS_COLORS: Record<JobStatusValue, string> = {
    OPEN:   "#10B981",
    CLOSED: "#EF4444",
    DRAFT:  "#9CA3AF",
};

const SOURCE_PALETTE: Record<ApplicationSourceValue, string> = {
    PLATFORM: "#1e3b8a",
    EMAIL:    "#3B82F6",
    LINKEDIN: "#0EA5E9",
    REFERRAL: "#06B6D4",
    OFFLINE:  "#8B5CF6",
    OTHER:    "#A78BFA",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function EmptyState({ height = 240 }: { height?: number }) {
    return (
        <div
            className="flex flex-col items-center justify-center gap-2 text-slate-400"
            style={{ height }}
        >
            <TrendingUp size={28} className="opacity-30" />
            <p className="text-sm font-medium">No data available yet</p>
        </div>
    );
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
    return (
        <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold text-slate-800">{title}</CardTitle>
            {description && (
                <CardDescription className="text-xs text-slate-400">{description}</CardDescription>
            )}
        </CardHeader>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

interface RecruiterDashboardProps {
    data: RecruiterDashboardData | null;
    error?: string | null;
}

export default function RecruiterDashboard({ data, error }: RecruiterDashboardProps) {
    const summary = data?.summary;
    const statusCounts = toCountMap(data?.application_status_breakdown as Array<{ status: string; count: number }> | undefined);
    const jobStatusCounts = toCountMap(data?.job_status_distribution as Array<{ status: string; count: number }> | undefined);

    const pipelineStackData = [
        {
            name: "Applications",
            ...Object.fromEntries(PIPELINE_ORDER.map((s) => [s, statusCounts[s] ?? 0])),
        },
    ];

    const jobStatusStackData = [
        {
            name: "Jobs",
            ...Object.fromEntries(JOB_STATUS_ORDER.map((s) => [s, jobStatusCounts[s] ?? 0])),
        },
    ];

    const summaryCards = [
        {
            label: "Job Postings",
            value: summary?.total_jobs ?? "—",
            icon: Briefcase,
            iconColor: "text-primary",
            iconBg: "bg-primary/10",
        },
        {
            label: "Total Applications",
            value: summary?.total_applications ?? "—",
            icon: FileText,
            iconColor: "text-indigo-600",
            iconBg: "bg-indigo-50",
        },
        {
            label: "Accepted Candidates",
            value: summary?.accepted_count ?? "—",
            icon: CheckCircle2,
            iconColor: "text-emerald-600",
            iconBg: "bg-emerald-50",
        },
        {
            label: "Pending Review",
            value: summary?.pending_count ?? "—",
            icon: Clock,
            iconColor: "text-amber-600",
            iconBg: "bg-amber-50",
        },
    ];

    const hasStatusData  = (data?.application_status_breakdown ?? []).some((d) => d.count > 0);
    const hasJobStatus   = (data?.job_status_distribution ?? []).some((d) => d.count > 0);
    const hasTopJobs     = (data?.top_jobs_by_applications ?? []).length > 0;
    const hasMonthly     = (data?.applications_over_time ?? []).some((d) => d.count > 0);
    const hasSource      = (data?.application_source_breakdown ?? []).some((d) => d.count > 0);

    return (
        <div className="min-h-screen space-y-7">

            {/* ── Error Banner ── */}
            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                    <div>
                        <span className="font-bold">Dashboard error: </span>{error}
                    </div>
                </div>
            )}

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                        <LayoutDashboard size={17} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 leading-none">
                            Recruiter Dashboard
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">
                            Overview of your hiring activity
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                    <NotificationCenter userRole="RECRUITER" />
                    <UserDropdown />
                </div>
            </div>

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {summaryCards.map((card) => (
                    <KpiCard key={card.label} {...card} />
                ))}
            </div>

            {/* ── Application Pipeline + Job Status Donuts ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-slate-200">
                    <SectionHeader
                        title="Application Pipeline"
                        description="Breakdown by current status"
                    />
                    <CardContent className="pt-0">
                        {hasStatusData ? (
                            <>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart
                                        layout="vertical"
                                        data={pipelineStackData}
                                        margin={{ left: 0, right: 20, top: 8, bottom: 0 }}
                                        barCategoryGap={18}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                        <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                                            formatter={(value, name) => [value, String(name)]}
                                        />
                                        {PIPELINE_ORDER.map((status, idx) => (
                                            <Bar
                                                key={status}
                                                dataKey={status}
                                                stackId="a"
                                                fill={STATUS_COLORS[status]}
                                                fillOpacity={0.9}
                                                radius={
                                                    idx === 0
                                                        ? [8, 0, 0, 8]
                                                        : idx === PIPELINE_ORDER.length - 1
                                                          ? [0, 8, 8, 0]
                                                          : 0
                                                }
                                            />
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                                {/* Status legend pills */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {data?.application_status_breakdown.map((entry) => (
                                        <Badge key={entry.status} variant="secondary" className="gap-1.5 text-[11px]">
                                            <span
                                                className="w-2 h-2 rounded-full shrink-0"
                                                style={{ background: STATUS_COLORS[entry.status] }}
                                            />
                                            {entry.status} · {entry.count}
                                        </Badge>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <EmptyState height={280} />
                        )}
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <SectionHeader
                        title="Job Status Overview"
                        description="Distribution of open, draft & closed jobs"
                    />
                    <CardContent className="pt-0">
                        {hasJobStatus ? (
                            <>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart
                                        layout="vertical"
                                        data={jobStatusStackData}
                                        margin={{ left: 0, right: 20, top: 8, bottom: 0 }}
                                        barCategoryGap={18}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                        <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                                            formatter={(value, name) => [value, String(name)]}
                                        />
                                        {JOB_STATUS_ORDER.map((status, idx) => (
                                            <Bar
                                                key={status}
                                                dataKey={status}
                                                stackId="a"
                                                fill={JOB_STATUS_COLORS[status]}
                                                fillOpacity={0.9}
                                                radius={
                                                    idx === 0
                                                        ? [8, 0, 0, 8]
                                                        : idx === JOB_STATUS_ORDER.length - 1
                                                          ? [0, 8, 8, 0]
                                                          : 0
                                                }
                                            />
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {data?.job_status_distribution.map((entry) => (
                                        <Badge key={entry.status} variant="secondary" className="gap-1.5 text-[11px]">
                                            <span
                                                className="w-2 h-2 rounded-full shrink-0"
                                                style={{ background: JOB_STATUS_COLORS[entry.status] }}
                                            />
                                            {entry.status} · {entry.count}
                                        </Badge>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <EmptyState height={280} />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ── Top Jobs by Applications ── */}
            <Card className="border-slate-200">
                <SectionHeader
                    title="Top Jobs by Applications"
                    description="Jobs with the highest applicant volume"
                />
                <CardContent className="pt-0">
                    {hasTopJobs ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart
                                layout="vertical"
                                data={data?.top_jobs_by_applications}
                                margin={{ left: 0, right: 16, top: 4, bottom: 4 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                <YAxis
                                    type="category"
                                    dataKey="title"
                                    width={110}
                                    tick={{ fontSize: 11, fill: "#64748b" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                                />
                                <Legend />
                                <Bar dataKey="application_count" name="Total Applications" fill="#1e3b8a" radius={[0, 6, 6, 0]} />
                                <Bar dataKey="accepted_count" name="Accepted" fill="#10B981" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState height={260} />
                    )}
                </CardContent>
            </Card>

            {/* ── Applications Over Time + Source Breakdown ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-slate-200">
                    <SectionHeader
                        title="Applications Over Time"
                        description="Monthly application volume trend"
                    />
                    <CardContent className="pt-0">
                        {hasMonthly ? (
                            <ResponsiveContainer width="100%" height={240}>
                                <AreaChart data={data?.applications_over_time}>
                                    <defs>
                                        <linearGradient id="appGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%"  stopColor="#1e3b8a" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#1e3b8a" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        name="Applications"
                                        stroke="#1e3b8a"
                                        strokeWidth={2.5}
                                        fill="url(#appGradient)"
                                        dot={{ r: 4, fill: "#1e3b8a", strokeWidth: 0 }}
                                        activeDot={{ r: 6, fill: "#1e3b8a" }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState />
                        )}
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <SectionHeader
                        title="Application Sources"
                        description="Where your applicants are coming from"
                    />
                    <CardContent className="pt-0">
                        {hasSource ? (
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={data?.application_source_breakdown}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="source" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                                    />
                                    <Bar dataKey="count" name="Applications" radius={[6, 6, 0, 0]}>
                                        {data?.application_source_breakdown.map((entry) => (
                                            <Cell key={entry.source} fill={SOURCE_PALETTE[entry.source]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center justify-center gap-1 py-4">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-400 font-medium">All systems operational · ResumeEZ AI © 2026</span>
            </div>
        </div>
    );
}
