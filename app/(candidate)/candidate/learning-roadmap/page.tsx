'use client';

import CandidateSidebar from '@/components/candidate/CandidateSidebar';

const roadmapData = [
    {
        skill: 'Docker',
        status: 'In Progress',
        progress: 40,
        topics: ['Docker Basics', 'Images & Containers', 'Docker Compose'],
    },
    {
        skill: 'AWS',
        status: 'Pending',
        progress: 0,
        topics: ['EC2 Fundamentals', 'S3 Storage', 'IAM Basics'],
    },
    {
        skill: 'System Design',
        status: 'Pending',
        progress: 0,
        topics: ['Scalability Basics', 'Load Balancing', 'Database Design'],
    },
];

export default function LearningRoadmapPage() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <CandidateSidebar />

            {/* Main Content */}
            <main className="flex-1 px-10 py-8">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Personalized Learning Roadmap
                    </h1>
                    <p className="mt-2 text-gray-600">
                        A step-by-step roadmap generated from your skill gap analysis.
                    </p>
                </div>

                {/* Overview */}
                <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-gray-500">Total Skills</p>
                            <p className="text-2xl font-semibold text-gray-900">3</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Completed</p>
                            <p className="text-2xl font-semibold text-gray-900">0</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Overall Progress</p>
                            <p className="text-2xl font-semibold text-blue-600">13%</p>
                        </div>
                    </div>
                </section>

                {/* Roadmap Items */}
                <section className="space-y-6">
                    {roadmapData.map((item) => (
                        <div
                            key={item.skill}
                            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                        >
                            {/* Skill Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {item.skill}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Status: <span className="font-medium">{item.status}</span>
                                    </p>
                                </div>

                                {/* Progress */}
                                <div className="w-full sm:w-56">
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>Progress</span>
                                        <span>{item.progress}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-gray-200">
                                        <div
                                            className="h-2 rounded-full bg-blue-600"
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Topics */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">
                                    Recommended Topics
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                    {item.topics.map((topic) => (
                                        <li key={topic}>{topic}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex gap-3">
                                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
                                    Mark Topic Complete
                                </button>
                                <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                                    View Resources
                                </button>
                            </div>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}
