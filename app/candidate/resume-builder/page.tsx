'use client';

import Sidebar from '@/components/candidate/Sidebar';

export default function ResumeBuilderPage() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 px-10 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Resume Builder
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Build an ATS-friendly resume using structured sections and templates.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Resume Form */}
                    <section className="space-y-6">
                        {/* Personal Information */}
                        <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Personal Information
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="input"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="input"
                                />
                                <input
                                    type="text"
                                    placeholder="Phone"
                                    className="input"
                                />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    className="input"
                                />
                            </div>
                        </div>

                        {/* Professional Summary */}
                        <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Professional Summary
                            </h2>

                            <textarea
                                rows={4}
                                placeholder="Brief summary highlighting your experience and strengths..."
                                className="input resize-none"
                            />
                        </div>

                        {/* Skills */}
                        <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Skills
                            </h2>

                            <textarea
                                rows={3}
                                placeholder="e.g. Python, FastAPI, SQL, Docker"
                                className="input resize-none"
                            />
                        </div>

                        {/* Experience */}
                        <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Experience
                            </h2>

                            <textarea
                                rows={5}
                                placeholder="Job Title - Company\n• Achievement or responsibility\n• Achievement or responsibility"
                                className="input resize-none"
                            />
                        </div>

                        {/* Education */}
                        <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Education
                            </h2>

                            <textarea
                                rows={3}
                                placeholder="Degree - Institution (Year)"
                                className="input resize-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button className="btn-primary">
                                Save Resume
                            </button>
                            <button className="btn-secondary">
                                Reset
                            </button>
                        </div>
                    </section>

                    {/* Right: Resume Preview */}
                    <section className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Resume Preview
                        </h2>

                        <div className="border rounded-lg p-6 text-sm text-gray-800 space-y-4">
                            <div>
                                <h3 className="text-xl font-bold">John Doe</h3>
                                <p className="text-gray-600">
                                    john@example.com | +977-98XXXXXXX | Kathmandu, Nepal
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold">Professional Summary</h4>
                                <p className="text-gray-700">
                                    Backend developer with experience in FastAPI and database-driven applications.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold">Skills</h4>
                                <p className="text-gray-700">
                                    Python, FastAPI, SQL, Git, REST APIs
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold">Experience</h4>
                                <p className="text-gray-700">
                                    Backend Developer – XYZ Company
                                    <br />• Built REST APIs using FastAPI
                                    <br />• Optimized database queries
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold">Education</h4>
                                <p className="text-gray-700">
                                    BSc Computer Science – London Met University
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Tailwind utility classes */}
            <style jsx global>{`
            .input {
            width: 100%;
            border-radius: 0.375rem;
            border: 1px solid #d1d5db;
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            outline: none;
            }
            .input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
            }
            .btn-primary {
            background-color: #2563eb;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            }
            .btn-primary:hover {
            background-color: #1d4ed8;
            }
            .btn-secondary {
            border: 1px solid #d1d5db;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            color: #374151;
            }
            .btn-secondary:hover {
            background-color: #f3f4f6;
            }
      `}</style>
        </div>
    );
}
