"use client"

import { Bell, Search, FileText, Briefcase, TrendingUp, BarChart3 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const stats = [
    { label: "Resumes Created", value: 3, icon: FileText },
    { label: "Job Descriptions Analyzed", value: 12, icon: Briefcase },
    { label: "Skills Missing", value: 8, icon: TrendingUp },
];

const jdAnalysis = [
    { role: "Data Scientist", company: "Google", match: 75, missing: ["Python", "Machine Learning", "Statistics"] },
    { role: "ML Engineer Intern", company: "Meta", match: 68, missing: ["Deep Learning", "MLOps"] },
    { role: "Backend Engineer", company: "Amazon", match: 82, missing: ["System Design", "Redis"] },
];

const chartData = jdAnalysis.map((jd) => ({ name: jd.role, match: jd.match, missing: jd.missing.length }));

const activities = [
    { type: "resume", title: "Resume updated", description: "Updated resume for Data Scientist role", date: "2 hours ago", actionLabel: "View Resume", href: "/candidate" },
    { type: "analysis", title: "Job Description Analyzed", description: "Compared resume with Google Data Scientist JD", date: "Yesterday", actionLabel: "View Analysis", href: "/candidate" },
    { type: "skill", title: "Skill Gap Identified", description: "Missing skills detected: Python, ML", date: "2 days ago", actionLabel: "View Skill Gaps", href: "/candidate" },
];

export default function CandidateDashboard() {
    return (
        <div className="min-h-screen bg-gray-50 p-6 space-y-6 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800">Job Seeker Dashboard</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input placeholder="Search job descriptions or skills..." className="pl-9 pr-3 py-2 rounded-2xl border border-gray-200 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-300" />
                    </div>
                    <button className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition">
                        <Bell className="h-5 w-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">{s.label}</p>
                                <p className="text-3xl font-bold text-gray-800">{s.value}</p>
                            </div>
                            <s.icon className="h-8 w-8 text-indigo-500" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-5 w-5 text-indigo-500" />
                    <h2 className="font-semibold text-gray-800">Resume Match Insights</h2>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData} className="rounded-xl">
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="match" fill="#6366F1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="missing" fill="#A5B4FC" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* JD Analysis Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-4">
                <h2 className="font-semibold text-gray-800">Resume Analysis by Job Description</h2>
                {jdAnalysis.map((jd) => (
                    <div key={jd.role} className="border border-gray-200 rounded-xl p-4 space-y-2 shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-700">{jd.role}</p>
                                <p className="text-xs text-gray-500">{jd.company}</p>
                            </div>
                            <span className="text-sm font-semibold text-indigo-600">{jd.match}% Match</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Missing Skills</p>
                            <div className="flex flex-wrap gap-2">
                                {jd.missing.map((skill) => (
                                    <span key={skill} className="px-2 py-1 text-xs  bg-red-50 rounded-full shadow">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <h2 className="font-semibold mb-3 text-gray-800">Recent Activity</h2>
                <div className="space-y-4">
                    {activities.map((a, i) => (
                        <div key={i} className="flex items-start justify-between border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-700">{a.title}</p>
                                <p className="text-xs text-gray-500">{a.description}</p>
                                <p className="text-xs text-gray-400">{a.date}</p>
                            </div>
                            <a href={a.href} className="text-xs px-3 py-1 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition">
                                {a.actionLabel}
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="text-xs text-gray-400 text-center">
                Analyze more job descriptions to improve your resume match 🚀
            </footer>
        </div>
    );
}
