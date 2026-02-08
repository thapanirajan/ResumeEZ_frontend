

"use client"

import { Plus, FileText, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"

type Resume = {
    id: string;
    title: string;
    lastUpdated: string;
};

const resumes: Resume[] = [
    {
        id: "1",
        title: "Software Engineer Resume",
        lastUpdated: "Updated 2 days ago",
    },
    {
        id: "2",
        title: "Internship Resume",
        lastUpdated: "Updated 1 week ago",
    },
];

export default function ResumeDashboardPage() {
    const router = useRouter()
    return (
        <main className="bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-7xl space-y-10">
                {/* Header */}
                <header className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                        Your Resumes
                    </h1>
                    <p className="text-slate-500">
                        Create a new resume or continue editing an existing one.
                    </p>
                </header>

                {/* Primary CTA */}
                <section>
                    <button
                        className="
                        group relative w-full rounded-2xl border border-slate-200
                        bg-white p-8 text-left shadow-sm transition
                        hover:shadow-md hover:border-[#1e3a8a]/30
                        "
                    >
                        <Link
                            href="/candidate/resume/create"
                            onClick={(e) => {
                                e.preventDefault()
                                localStorage.removeItem("resume-builder-data")
                                router.push("/candidate/resume/create");
                            }}
                            className="flex items-center gap-6 cursor-pointer">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#1e3a8a] text-white">
                                <Plus className="h-6 w-6" />
                            </div>

                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-slate-900">
                                    Create a new resume
                                </h2>
                                <p className="mt-1 text-slate-500">
                                    Start from scratch and build a professional resume in minutes.
                                </p>
                            </div>
                        </Link>
                    </button>
                </section>

                {/* Previous Resumes */}
                <section className="space-y-4">
                    <h3 className="text-lg font-medium text-slate-900">
                        Previously created
                    </h3>

                    {resumes.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                            <p className="text-slate-500">
                                You haven’t created any resumes yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {resumes.map((resume) => (
                                <button
                                    key={resume.id}
                                    className="
                                    group rounded-xl border border-slate-200 bg-white p-5 
                                    text-left shadow-sm transition
                                    hover:shadow-md hover:border-[#1e3a8a]/30
                                    cursor-pointer
                                "
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e3a8a]/10">
                                            <FileText className="h-5 w-5 text-[#1e3a8a]" />
                                        </div>

                                        <div className="flex-1 space-y-1">
                                            <p className="font-medium text-slate-900">
                                                {resume.title}
                                            </p>
                                            <div className="flex items-center gap-1 text-sm text-slate-500">
                                                <Clock className="h-4 w-4" />
                                                {resume.lastUpdated}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
