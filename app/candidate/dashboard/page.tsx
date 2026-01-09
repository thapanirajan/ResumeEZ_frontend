import Sidebar from "@/components/candidate/Sidebar";
import StatCard from "@/components/candidate/StatCard";


export default function CandidateDashboardPage() {
    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-10">
                {/* Header */}
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Welcome back, Nirajan 👋
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Track your resume progress and improve your job readiness
                    </p>
                </div>

                {/* Stats Section */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        title="Resume Status"
                        value="Analyzed"
                        description="Last updated: 2 days ago"
                    />
                    <StatCard
                        title="Resume–JD Match"
                        value="72%"
                        description="Good match"
                    />
                    <StatCard
                        title="Skill Gaps Identified"
                        value="5 Skills"
                        description="Needs improvement"
                    />
                    <StatCard
                        title="Learning Progress"
                        value="2 / 6"
                        description="Skills completed"
                    />
                </section>

                {/* Quick Actions */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Quick Actions
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            'Upload Resume & JD',
                            'View Skill Gap Analysis',
                            'View Learning Roadmap',
                            'Open Resume Builder',
                        ].map((action) => (
                            <button
                                key={action}
                                className="rounded-xl border border-gray-200 bg-white px-4 py-6 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 transition"
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Recent Activity */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Recent Activity
                    </h3>

                    <div className="rounded-xl border border-gray-200 bg-white divide-y">
                        {[
                            'Resume analyzed for Backend Developer role',
                            'Skill gap analysis completed',
                            'Learning roadmap generated',
                        ].map((activity, index) => (
                            <div key={index} className="p-4 text-sm text-gray-600">
                                {activity}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Skill Snapshot */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">
                            Strong Skills
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>Python</li>
                            <li>FastAPI</li>
                            <li>SQL</li>
                        </ul>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">
                            Missing / Weak Skills
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>Docker</li>
                            <li>System Design</li>
                            <li>Cloud Deployment</li>
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
}
