"use client"

import { Bell, Search, FileText, Briefcase, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import UserDropdown from "@/components/common/UserDropDown";
import { useAuth } from "@/hooks/useAuth";

const stats = [
    {
        label: "Resumes Created",
        value: 3,
        icon: FileText,
        trend: "+1 this week",
        trendUp: true,
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
        borderColor: "border-t-blue-500",
    },
    {
        label: "Jobs Analyzed",
        value: 12,
        icon: Briefcase,
        trend: "+3 this week",
        trendUp: true,
        bgColor: "bg-sky-50",
        iconColor: "text-sky-600",
        borderColor: "border-t-sky-500",
    },
    {
        label: "Skills Missing",
        value: 8,
        icon: TrendingUp,
        trend: "−2 resolved",
        trendUp: false,
        bgColor: "bg-indigo-50",
        iconColor: "text-indigo-600",
        borderColor: "border-t-indigo-500",
    },
];

const jdAnalysis = [
    { role: "Data Scientist",     company: "Google", match: 75, missing: ["Python", "Machine Learning", "Statistics"] },
    { role: "ML Engineer Intern", company: "Meta",   match: 68, missing: ["Deep Learning", "MLOps"] },
    { role: "Backend Engineer",   company: "Amazon", match: 82, missing: ["System Design", "Redis"] },
];

const chartData = jdAnalysis.map((jd) => ({
    name: jd.role,
    "Match Score": jd.match,
    "Missing Skills": jd.missing.length,
}));

const activities = [
    { type: "resume",   title: "Resume updated",           description: "Updated resume for Data Scientist role",        date: "2 hours ago", actionLabel: "View Resume",    href: "/candidate" },
    { type: "analysis", title: "Job Description Analyzed", description: "Compared resume with Google Data Scientist JD",  date: "Yesterday",   actionLabel: "View Analysis",  href: "/candidate" },
    { type: "skill",    title: "Skill Gap Identified",     description: "Missing skills detected: Python, ML",            date: "2 days ago",  actionLabel: "View Skill Gaps", href: "/candidate" },
];

const activityStyle: Record<string, { border: string; dot: string; label: string }> = {
    resume:   { border: "border-l-4 border-blue-400",   dot: "bg-blue-400",   label: "bg-blue-50 text-blue-700" },
    analysis: { border: "border-l-4 border-sky-400",    dot: "bg-sky-400",    label: "bg-sky-50 text-sky-700" },
    skill:    { border: "border-l-4 border-indigo-400", dot: "bg-indigo-400", label: "bg-indigo-50 text-indigo-700" },
};

function matchBarColor(match: number) {
    if (match >= 75) return "bg-green-500";
    if (match >= 50) return "bg-yellow-500";
    return "bg-red-500";
}

function matchTextColor(match: number) {
    if (match >= 75) return "text-green-600";
    if (match >= 50) return "text-yellow-600";
    return "text-red-600";
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}

export default function CandidateDashboard() {
    const { user } = useAuth();
    const emailPrefix = user?.email.split("@")[0] ?? "there";

    return (
        <div className="min-h-screen bg-gray-50 space-y-6 font-sans">

            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {getGreeting()}, {emailPrefix} 👋
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">Here&apos;s your job search snapshot for today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            placeholder="Search jobs or skills..."
                            className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 w-56"
                        />
                    </div>
                    <button className="relative p-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition">
                        <Bell className="h-5 w-5 text-gray-600" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500" />
                    </button>
                    <UserDropdown />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((s) => (
                    <div key={s.label} className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-t-2 ${s.borderColor} hover:shadow-md transition`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{s.label}</p>
                                <p className="text-4xl font-bold text-gray-900 mt-1 tracking-tight">{s.value}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    {s.trendUp
                                        ? <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
                                        : <ArrowDownRight className="h-3.5 w-3.5 text-green-500" />
                                    }
                                    <p className="text-xs font-medium text-green-600">{s.trend}</p>
                                </div>
                            </div>
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${s.bgColor}`}>
                                <s.icon className={`h-6 w-6 ${s.iconColor}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-start gap-3 mb-1">
                    <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-900">Resume Match Insights</h2>
                        <p className="text-xs text-gray-500 mt-0.5">How well your resume aligns with analyzed job descriptions</p>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData} className="mt-4">
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                            cursor={{ fill: "rgba(59,130,246,0.05)" }}
                        />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                        <Bar dataKey="Match Score" fill="#2563EB" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Missing Skills" fill="#BFDBFE" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* JD Analysis */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition space-y-4">
                <div>
                    <h2 className="font-semibold text-gray-900">Resume Analysis by Job Description</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Match scores against each role you&apos;ve analyzed</p>
                </div>
                {jdAnalysis.map((jd) => (
                    <div key={jd.role} className="border border-gray-100 rounded-2xl p-4 space-y-3 hover:border-blue-100 hover:bg-blue-50/30 transition">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">{jd.role}</p>
                                <p className="text-xs text-gray-500">{jd.company}</p>
                            </div>
                            <span className={`text-sm font-bold ${matchTextColor(jd.match)}`}>
                                {jd.match}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                                className={`h-1.5 rounded-full transition-all duration-500 ${matchBarColor(jd.match)}`}
                                style={{ width: `${jd.match}%` }}
                            />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 mb-1.5 font-medium uppercase tracking-wide">Missing Skills</p>
                            <div className="flex flex-wrap gap-1.5">
                                {jd.missing.map((skill) => (
                                    <span key={skill} className="px-2.5 py-1 text-xs bg-red-50 text-red-600 border border-red-100 rounded-full font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="mb-4">
                    <h2 className="font-semibold text-gray-900">Recent Activity</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Your latest actions and updates</p>
                </div>
                <div className="space-y-3">
                    {activities.map((a, i) => {
                        const style = activityStyle[a.type];
                        return (
                            <div key={i} className={`flex items-start justify-between rounded-xl p-4 bg-gray-50 ${style.border} hover:bg-gray-100 transition`}>
                                <div className="flex items-start gap-3">
                                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-semibold text-gray-800">{a.title}</p>
                                        <p className="text-xs text-gray-500">{a.description}</p>
                                        <p className="text-xs text-gray-400">{a.date}</p>
                                    </div>
                                </div>
                                <a
                                    href={a.href}
                                    className={`shrink-0 text-xs px-3 py-1.5 rounded-lg font-medium transition hover:opacity-80 ${style.label}`}
                                >
                                    {a.actionLabel}
                                </a>
                            </div>
                        );
                    })}
                </div>
            </div>

            <footer className="text-xs text-gray-400 text-center pb-2">
                Analyze more job descriptions to improve your resume match score
            </footer>
        </div>
    );
}
