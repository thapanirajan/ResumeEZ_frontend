import Sidebar from '@/components/candidate/Sidebar';

export default function UploadResumePage() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 px-10 py-8">
                {/* Page Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Upload Resume & Job Description
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Upload your resume and paste the job description to analyze skill gaps
                        and job matching.
                    </p>
                </div>

                {/* Content Wrapper */}
                <div className="space-y-8">
                    {/* Resume Upload */}
                    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Resume Upload
                        </h2>

                        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10 text-center">
                            <p className="text-sm text-gray-600 mb-3">
                                Upload your resume (PDF or DOCX)
                            </p>

                            <button className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
                                Choose File
                            </button>

                            <p className="mt-3 text-xs text-gray-500">
                                Maximum file size: 2MB
                            </p>
                        </div>
                    </section>

                    {/* Job Description */}
                    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Job Description
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Job Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Backend Developer"
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Job Description
                                </label>
                                <textarea
                                    rows={7}
                                    placeholder="Paste the full job description here..."
                                    className="w-full resize-none rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition">
                            Analyze Resume
                        </button>

                        <button className="rounded-lg border border-gray-300 px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition">
                            Reset
                        </button>
                    </div>

                    {/* Helper Box */}
                    <section className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                        <h3 className="text-sm font-semibold text-blue-900 mb-2">
                            Tips for Better Results
                        </h3>
                        <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                            <li>Use the exact job description from the job posting.</li>
                            <li>Upload your most recent resume.</li>
                            <li>Clearly mention technical and soft skills.</li>
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    );
}
