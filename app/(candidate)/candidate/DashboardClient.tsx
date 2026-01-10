"use client";

import { Bell, UserCircle } from "lucide-react";

export default function CandidateDashboard() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Main content */}
            <main className="flex-1 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome, Candidate!</h1>
                        <p className="text-gray-600">Here’s your dashboard overview.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative">
                            <Bell className="h-6 w-6 text-gray-700 hover:text-gray-900 transition-colors" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>
                        </button>
                        <UserCircle className="h-8 w-8 text-gray-700" />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white shadow rounded-xl p-6 flex flex-col items-start">
                        <h2 className="text-gray-500 text-sm">Resume Builder</h2>
                        <p className="text-xl font-semibold mt-2">5 Completed</p>
                    </div>
                    <div className="bg-white shadow rounded-xl p-6 flex flex-col items-start">
                        <h2 className="text-gray-500 text-sm">Skill Gap Analysis</h2>
                        <p className="text-xl font-semibold mt-2">3 Pending</p>
                    </div>
                    <div className="bg-white shadow rounded-xl p-6 flex flex-col items-start">
                        <h2 className="text-gray-500 text-sm">Uploaded JD & Resume</h2>
                        <p className="text-xl font-semibold mt-2">7 Total</p>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white shadow rounded-xl p-6 mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
                    <ul className="divide-y divide-gray-200">
                        <li className="py-3 flex justify-between items-center">
                            <span>Uploaded Resume for Software Engineer</span>
                            <span className="text-sm text-gray-500">2 hours ago</span>
                        </li>
                        <li className="py-3 flex justify-between items-center">
                            <span>Completed Skill Gap Analysis</span>
                            <span className="text-sm text-gray-500">Yesterday</span>
                        </li>
                        <li className="py-3 flex justify-between items-center">
                            <span>Generated Resume PDF</span>
                            <span className="text-sm text-gray-500">2 days ago</span>
                        </li>
                    </ul>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-xl p-6 text-center hover:bg-blue-100 transition-colors cursor-pointer">
                        <p className="font-semibold text-blue-700">Build Resume</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-6 text-center hover:bg-green-100 transition-colors cursor-pointer">
                        <p className="font-semibold text-green-700">Analyze Skills</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-6 text-center hover:bg-yellow-100 transition-colors cursor-pointer">
                        <p className="font-semibold text-yellow-700">Upload JD</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
