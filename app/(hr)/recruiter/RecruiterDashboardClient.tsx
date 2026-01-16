"use client";

import { Bell, Briefcase, FileText, Sparkles, Search } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";

const stats = [
    { label: "Job Postings", value: 12, icon: Briefcase },
    { label: "Resumes Uploaded", value: 342, icon: FileText },
    { label: "AI Shortlisted", value: 86, icon: Sparkles },
];

const jobs = [
    { title: "Frontend Developer", date: "Jan 02, 2026", resumes: 120, shortlisted: 24 },
    { title: "Backend Engineer", date: "Dec 20, 2025", resumes: 98, shortlisted: 18 },
    { title: "UI/UX Designer", date: "Dec 10, 2025", resumes: 64, shortlisted: 12 },
];

const chartData = [
    { name: "Week 1", shortlisted: 10, hired: 3 },
    { name: "Week 2", shortlisted: 18, hired: 6 },
    { name: "Week 3", shortlisted: 22, hired: 8 },
    { name: "Week 4", shortlisted: 36, hired: 12 },
];

export default function RecruiterDashboard() {
    return (
        <div className="min-h-screen p-6 space-y-8">
            {/* Header */}
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
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((s) => (
                    <div
                        key={s.label}
                        className="rounded-3xl bg-white shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-gray-500">{s.label}</p>
                                <p className="text-3xl font-semibold text-gray-900">
                                    {s.value}
                                </p>
                            </div>
                            <div className="p-3 rounded-2xl bg-indigo-50">
                                <s.icon className="h-7 w-7 text-indigo-500" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Job History */}
            <div className="rounded-3xl bg-white shadow-sm">
                <div className="p-6 space-y-4">
                    <h2 className="font-semibold text-gray-900">
                        Job Posting History
                    </h2>

                    <div className="space-y-2">
                        {jobs.map((job) => (
                            <div
                                key={job.title}
                                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {job.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Posted {job.date}
                                    </p>
                                </div>

                                <p className="text-sm text-gray-600">
                                    {job.shortlisted}/{job.resumes} shortlisted
                                </p>

                                <button className="px-4 py-1.5 text-sm rounded-xl bg-gray-100 hover:bg-gray-200 transition">
                                    View
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Insights */}
            <div className="rounded-3xl bg-white shadow-sm">
                <div className="p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">
                        AI Shortlisting Performance
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="shortlisted" fill="#6366F1" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="hired" fill="#A5B4FC" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>

                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={chartData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    dataKey="shortlisted"
                                    stroke="#6366F1"
                                    strokeWidth={3}
                                    dot={false}
                                />
                                <Line
                                    dataKey="hired"
                                    stroke="#A5B4FC"
                                    strokeWidth={3}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-xs text-gray-400 text-center">
                Settings · Help · Profile
            </footer>
        </div>
    );
}
