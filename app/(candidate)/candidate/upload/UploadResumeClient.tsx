"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ResumeResponse, resumeApi } from "@/services/resume.service";
import { skillGapApi, saveAnalysisResult } from "@/services/skill-gap.service";
import toast from "react-hot-toast";

export default function UploadResumeClient() {
    const router = useRouter();
    const [resumes, setResumes] = useState<ResumeResponse[]>([]);
    const [selectedResumeId, setSelectedResumeId] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [isLoadingResumes, setIsLoadingResumes] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchCandidateResumes();
    }, []);

    const selectedResume = useMemo(
        () => resumes.find((resume) => resume.id === selectedResumeId) || null,
        [resumes, selectedResumeId]
    );

    const canSubmit =
        Boolean(selectedResumeId) && Boolean(jobDescription.trim()) && !isSubmitting;

    async function fetchCandidateResumes() {
        try {
            setIsLoadingResumes(true);
            const data = await resumeApi.getCandidateResumes();
            setResumes(data);
            if (data.length > 0) {
                setSelectedResumeId(data[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch candidate resumes:", error);
            toast.error("Could not load your resume versions.");
        } finally {
            setIsLoadingResumes(false);
        }
    }

    async function handleAnalyze() {
        if (!selectedResumeId) {
            toast.error("Please select a resume version.");
            return;
        }

        if (!jobDescription.trim()) {
            toast.error("Please paste a job description.");
            return;
        }

        try {
            setIsSubmitting(true);
            const result = await skillGapApi.analyze(
                selectedResumeId,
                jobDescription.trim()
            );
            saveAnalysisResult(result);
            toast.success("Analysis complete!");
            router.push("/candidate/skill-gap");
        } catch (error: unknown) {
            console.error("Skill gap analysis failed:", error);
            const axiosError = error as {
                response?: { data?: { detail?: string; message?: string } };
            };
            const message =
                axiosError?.response?.data?.detail ||
                axiosError?.response?.data?.message ||
                "Analysis failed. Please try again.";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleReset() {
        setJobTitle("");
        setJobDescription("");
        if (resumes.length > 0) {
            setSelectedResumeId(resumes[0].id);
        } else {
            setSelectedResumeId("");
        }
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <main className="flex-1 px-6 py-8 md:px-10">
                <div className="mx-auto max-w-full space-y-6">
                    <header className="rounded-2xl border border-slate-200 bg-linear-to-r from-white to-slate-100 p-6 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
                                    Skill Gap Analyzer
                                </h1>
                                <p className="mt-2 text-sm text-slate-600 md:text-base">
                                    Pick your resume version, paste a job description, and get a focused roadmap.
                                </p>
                            </div>
                            <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                                Candidate Workspace
                            </span>
                        </div>
                    </header>

                    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                        <div className="space-y-6">
                            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1e3a8a] text-xs font-semibold text-white">
                                        1
                                    </span>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Select Resume Version
                                    </h2>
                                </div>

                                {isLoadingResumes ? (
                                    <div className="space-y-2">
                                        <div className="h-11 w-full animate-pulse rounded-lg bg-slate-100" />
                                        <div className="h-4 w-48 animate-pulse rounded bg-slate-100" />
                                    </div>
                                ) : resumes.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                                        No resume versions found. Create at least one resume from Resume Builder first.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-slate-700">
                                            Resume version
                                        </label>
                                        <select
                                            value={selectedResumeId}
                                            onChange={(e) => setSelectedResumeId(e.target.value)}
                                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
                                        >
                                            <option>
                                                Please select a resume
                                            </option>
                                            {resumes.map((resume) => (
                                                <option key={resume.id} value={resume.id}>
                                                    {resume.title}
                                                </option>
                                            ))}
                                        </select>

                                        {selectedResume && (
                                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                                                Using: <span className="font-medium text-slate-800">{selectedResume.title}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </section>

                            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1e3a8a] text-xs font-semibold text-white">
                                        2
                                    </span>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Paste Job Description
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">
                                            Job title (optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            placeholder="e.g. Backend Developer"
                                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">
                                            Job description
                                        </label>
                                        <textarea
                                            rows={12}
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            placeholder="Paste the full job description here..."
                                            className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
                                        />
                                        <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                                            <span>Tip: include requirements, responsibilities, and preferred skills.</span>
                                            <span>{jobDescription.length} characters</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <aside className="h-fit space-y-4 lg:sticky lg:top-6">
                            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h3 className="text-sm font-semibold text-slate-900">Ready Check</h3>
                                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                                    <li className={selectedResumeId ? "text-emerald-700" : ""}>
                                        {selectedResumeId ? "Done" : "Pending"} Resume selected
                                    </li>
                                    <li className={jobDescription.trim() ? "text-emerald-700" : ""}>
                                        {jobDescription.trim() ? "Done" : "Pending"} Job description added
                                    </li>
                                </ul>
                            </section>

                            <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                                <h3 className="text-sm font-semibold text-blue-900">
                                    What you&apos;ll get
                                </h3>
                                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                                    <li>✓ Skill match percentage</li>
                                    <li>✓ Matched &amp; missing skills</li>
                                    <li>✓ Priority-ranked gap list</li>
                                    <li>✓ 3-phase learning roadmap</li>
                                </ul>
                            </section>

                            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={!canSubmit}
                                        className="flex-1 rounded-lg bg-[#1e3a8a] px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Analyzing..." : "Analyze Skill Gap"}
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}
