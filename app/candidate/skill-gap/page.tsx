'use client';

import Sidebar from '@/components/candidate/Sidebar';

export default function SkillGapAnalysisPage() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 px-10 py-8">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Skill Gap Analysis
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Compare your resume with the job description to identify missing and
                        strong skills.
                    </p>
                </div>

                {/* Match Score */}
                <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        Resume–Job Match Score
                    </h2>

                    <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold text-blue-600">72%</div>
                        <div>
                            <p className="text-sm text-gray-600">
                                Good match — improving missing skills can increase your chances.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Matched Skills */}
                    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Matched Skills
                        </h3>

                        <ul className="space-y-2 text-sm text-gray-700">
                            {['Python', 'FastAPI', 'SQL', 'Git'].map((skill) => (
                                <li
                                    key={skill}
                                    className="rounded-md bg-green-50 px-3 py-2 text-green-700"
                                >
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Missing Skills */}
                    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Missing Skills
                        </h3>

                        <ul className="space-y-2 text-sm text-gray-700">
                            {['Docker', 'AWS', 'System Design'].map((skill) => (
                                <li
                                    key={skill}
                                    className="rounded-md bg-red-50 px-3 py-2 text-red-700"
                                >
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Weak Skills */}
                    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Weak Skills
                        </h3>

                        <ul className="space-y-2 text-sm text-gray-700">
                            {['Cloud Deployment', 'Testing'].map((skill) => (
                                <li
                                    key={skill}
                                    className="rounded-md bg-yellow-50 px-3 py-2 text-yellow-700"
                                >
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* Feedback Section */}
                <section className="mt-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Resume Improvement Suggestions
                    </h2>

                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                        <li>Add Docker and cloud deployment experience if available.</li>
                        <li>Include system design concepts in project descriptions.</li>
                        <li>Highlight testing tools and practices used in projects.</li>
                    </ul>
                </section>

                {/* Action Buttons */}
                <div className="mt-8 flex gap-4">
                    <button className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition">
                        View Learning Roadmap
                    </button>

                    <button className="rounded-lg border border-gray-300 px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition">
                        Upload New Resume
                    </button>
                </div>
            </main>
        </div>
    );
}
