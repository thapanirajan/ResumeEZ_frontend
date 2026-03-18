"use client";

import {
    Bell,
    Briefcase,
    CheckCircle2,
    Clock,
    FileText,
    Search,
} from "lucide-react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import UserDropdown from "@/components/common/UserDropDown";
import {
    ApplicationSourceValue,
    ApplicationStatusValue,
    JobStatusValue,
    RecruiterDashboardData,
} from "@/types/recruiter_dashboard";

// ── Color maps ────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<ApplicationStatusValue, string> = {
    PENDING: "#F59E0B",
    REVIEWING: "#6366F1",
    ACCEPTED: "#10B981",
    REJECTED: "#EF4444",
};

const JOB_STATUS_COLORS: Record<JobStatusValue, string> = {
    OPEN: "#10B981",
    CLOSED: "#EF4444",
    DRAFT: "#9CA3AF",
};

const SOURCE_PALETTE: Record<ApplicationSourceValue, string> = {
    PLATFORM: "#6366F1",
    EMAIL: "#3B82F6",
    LINKEDIN: "#0EA5E9",
    REFERRAL: "#06B6D4",
    OFFLINE: "#8B5CF6",
    OTHER: "#A78BFA",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function EmptyChart({ height = 240 }: { height?: number }) {
    return (
        <div
            className="flex items-center justify-center text-gray-400 text-sm"
            style={{ height }}
        >
            No data available
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

interface RecruiterDashboardProps {
    data: RecruiterDashboardData | null;
    error?: string | null;
}

export default function RecruiterDashboard({ data, error }: RecruiterDashboardProps) {
    const summary = data?.summary;

    const summaryCards = [
        {
            label: "Job Postings",
            value: summary?.total_jobs ?? "—",
            icon: Briefcase,
            color: "bg-indigo-50",
            iconColor: "text-indigo-500",
        },
        {
            label: "Total Applications",
            value: summary?.total_applications ?? "—",
            icon: FileText,
            color: "bg-blue-50",
            iconColor: "text-blue-500",
        },
        {
            label: "Accepted Candidates",
            value: summary?.accepted_count ?? "—",
            icon: CheckCircle2,
            color: "bg-emerald-50",
            iconColor: "text-emerald-500",
        },
        {
            label: "Pending Review",
            value: summary?.pending_count ?? "—",
            icon: Clock,
            color: "bg-amber-50",
            iconColor: "text-amber-500",
        },
    ];

    const hasStatusData = (data?.application_status_breakdown ?? []).some(
        (d) => d.count > 0
    );
    const hasJobStatusData = (data?.job_status_distribution ?? []).some(
        (d) => d.count > 0
    );
    const hasTopJobsData = (data?.top_jobs_by_applications ?? []).length > 0;
    const hasMonthlyData = (data?.applications_over_time ?? []).some(
        (d) => d.count > 0
    );
    const hasSourceData = (data?.application_source_breakdown ?? []).some(
        (d) => d.count > 0
    );

    return (
        <div className="min-h-screen p-6 space-y-8">
            {/* ── Error Banner ── */}
            {error && (
                <div className="rounded-2xl bg-red-50 border border-red-200 px-5 py-3 text-sm text-red-700">
                    <span className="font-medium">Dashboard error:</span> {error}
                </div>
            )}

            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                    Recruiter Dashboard
                </h1>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            placeholder="Search jobs, resumes..."
                            className="pl-9 pr-4 py-2.5 w-64 rounded-xl bg-white shadow-sm border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                    </div>
                    <button className="p-2.5 rounded-xl bg-white shadow-sm hover:shadow-md transition">
                        <Bell className="h-5 w-5 text-gray-600" />
                    </button>
                    <UserDropdown />
                </div>
            </div>

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {summaryCards.map((card) => (
                    <div
                        key={card.label}
                        className="rounded-3xl bg-white shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-gray-500">{card.label}</p>
                                <p className="text-3xl font-semibold text-gray-900 mt-1">
                                    {card.value}
                                </p>
                            </div>
                            <div className={`p-3 rounded-2xl ${card.color}`}>
                                <card.icon className={`h-7 w-7 ${card.iconColor}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Application Status + Job Status Donuts ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Application Status Donut */}
                <div className="rounded-3xl bg-white shadow-sm p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">
                        Application Pipeline
                    </h2>
                    {hasStatusData ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={data?.application_status_breakdown}
                                    dataKey="count"
                                    nameKey="status"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={105}
                                    paddingAngle={3}
                                >
                                    {data?.application_status_breakdown.map((entry) => (
                                        <Cell
                                            key={entry.status}
                                            fill={STATUS_COLORS[entry.status]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [value, "Applications"]} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyChart height={280} />
                    )}
                </div>

                {/* Job Status Donut */}
                <div className="rounded-3xl bg-white shadow-sm p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">
                        Job Status Overview
                    </h2>
                    {hasJobStatusData ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={data?.job_status_distribution}
                                    dataKey="count"
                                    nameKey="status"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={105}
                                    paddingAngle={3}
                                >
                                    {data?.job_status_distribution.map((entry) => (
                                        <Cell
                                            key={entry.status}
                                            fill={JOB_STATUS_COLORS[entry.status]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [value, "Jobs"]} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyChart height={280} />
                    )}
                </div>
            </div>

            {/* ── Top Jobs by Applications (Horizontal Bar) ── */}
            <div className="rounded-3xl bg-white shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-4">
                    Top Jobs by Applications
                </h2>
                {hasTopJobsData ? (
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart
                            layout="vertical"
                            data={data?.top_jobs_by_applications}
                            margin={{ left: 16, right: 24, top: 4, bottom: 4 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis
                                type="category"
                                dataKey="title"
                                width={150}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="application_count"
                                name="Total Applications"
                                fill="#6366F1"
                                radius={[0, 4, 4, 0]}
                            />
                            <Bar
                                dataKey="accepted_count"
                                name="Accepted"
                                fill="#10B981"
                                radius={[0, 4, 4, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <EmptyChart height={260} />
                )}
            </div>

            {/* ── Applications Over Time + Source Breakdown ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Area Chart — Monthly trend */}
                <div className="rounded-3xl bg-white shadow-sm p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">
                        Applications Over Time
                    </h2>
                    {hasMonthlyData ? (
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={data?.applications_over_time}>
                                <defs>
                                    <linearGradient
                                        id="appGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#6366F1"
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#6366F1"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    name="Applications"
                                    stroke="#6366F1"
                                    strokeWidth={2.5}
                                    fill="url(#appGradient)"
                                    dot={{ r: 4, fill: "#6366F1" }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyChart />
                    )}
                </div>

                {/* Bar Chart — Application Sources */}
                <div className="rounded-3xl bg-white shadow-sm p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">
                        Application Sources
                    </h2>
                    {hasSourceData ? (
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={data?.application_source_breakdown}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="source" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar
                                    dataKey="count"
                                    name="Applications"
                                    radius={[6, 6, 0, 0]}
                                >
                                    {data?.application_source_breakdown.map((entry) => (
                                        <Cell
                                            key={entry.source}
                                            fill={SOURCE_PALETTE[entry.source]}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyChart />
                    )}
                </div>
            </div>

            {/* ── Footer ── */}
            <footer className="text-xs text-gray-400 text-center">
                Settings · Help · Profile
            </footer>
        </div>
    );
}
