

"use client"

import { Plus, FileText, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"

type Resume = {
    id: string;
    title: string;
    lastUpdated: string;
};

import { useEffect, useState } from "react";
import { resumeApi, ResumeResponse } from "@/services/resume.service";
import { formatDistanceToNow } from "date-fns";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";

export default function ResumeDashboardPage() {
    const router = useRouter();
    const [resumes, setResumes] = useState<ResumeResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            setIsLoading(true);
            const data = await resumeApi.getCandidateResumes();
            setResumes(data);
        } catch (error) {
            console.error("Failed to fetch resumes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteResume = async (id: string) => {
        try {
            await resumeApi.deleteResume(id);
            setResumes((prev) => prev.filter((r) => r.id !== id));
        } catch (error) {
            console.error("Failed to delete resume:", error);
            throw error;
        }
    };
    return (
        <main className="bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-full space-y-10">
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

                    {isLoading ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-200" />
                            ))}
                        </div>
                    ) : resumes.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                            <p className="text-slate-500">
                                You haven’t created any resumes yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {resumes.map((resume) => (
                                <div
                                    key={resume.id}
                                    onClick={() => {
                                        localStorage.setItem("resume-builder-data", JSON.stringify({ resume: resume.resume_data, template: "classic" }));
                                        router.push(`/candidate/resume/create?id=${resume.id}`);
                                    }}
                                    className="
                                    group relative rounded-xl border border-slate-200 bg-white p-5 
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
                                                Updated {formatDistanceToNow(new Date(resume.updated_at || resume.created_at))} ago
                                            </div>
                                        </div>

                                        <div className="opacity-0 group-hover:opacity-100 transition">
                                            <ConfirmDeleteButton
                                                onConfirm={() => deleteResume(resume.id)}
                                                title="Delete resume?"
                                                description={`This will permanently delete “${resume.title}”.`}
                                                successToast="Resume deleted."
                                                buttonClassName="p-2 text-slate-400 hover:text-red-600 transition"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
