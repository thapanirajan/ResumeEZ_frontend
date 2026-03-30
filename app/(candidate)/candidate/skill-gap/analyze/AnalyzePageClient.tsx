"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
    ArrowLeft,
    FileText,
    CheckCircle2,
    ChevronRight,
    Loader2,
    AlertCircle,
    Plus,
    ScanSearch,
} from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { resumeApi } from "@/services/resume.service"
import { skillGapApi, saveAnalysisResult } from "@/services/skill-gap.service"

type Resume = {
    id: string
    title: string
    created_at: string
}

export default function AnalyzePageClient() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [resumes, setResumes] = useState<Resume[]>([])
    const [loadingResumes, setLoadingResumes] = useState(true)
    const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null)
    const [jdText, setJdText] = useState("")
    const [jobTitle, setJobTitle] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Pre-fill from query params (when coming from job detail page)
    useEffect(() => {
        const jd = searchParams.get("jd")
        const title = searchParams.get("title")
        if (jd) setJdText(decodeURIComponent(jd))
        if (title) setJobTitle(decodeURIComponent(title))
    }, [searchParams])

    // Load candidate resumes
    useEffect(() => {
        resumeApi.getCandidateResumes()
            .then((data) => setResumes(data as Resume[]))
            .catch(() => setError("Failed to load resumes."))
            .finally(() => setLoadingResumes(false))
    }, [])

    const handleAnalyze = useCallback(async () => {
        if (!selectedResumeId || !jdText.trim()) return
        setIsAnalyzing(true)
        setError(null)
        try {
            const result = await skillGapApi.analyze(selectedResumeId, jdText.trim())
            saveAnalysisResult(result)
            router.push("/candidate/skill-gap")
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Analysis failed. Please try again."
            setError(msg)
            toast.error(msg)
        } finally {
            setIsAnalyzing(false)
        }
    }, [selectedResumeId, jdText, router])

    const canAnalyze = !!selectedResumeId && jdText.trim().length > 20 && !isAnalyzing

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">

                {/* Back */}
                <Link
                    href="/candidate/job"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Jobs
                </Link>

                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-[#1e3a8a]/10 flex items-center justify-center">
                            <ScanSearch className="w-5 h-5 text-[#1e3a8a]" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Skill Gap Analysis</h1>
                    </div>
                    <p className="text-slate-500 text-sm">
                        {jobTitle
                            ? <>Analyzing match for <span className="font-semibold text-slate-700">{jobTitle}</span></>
                            : "Compare your resume against any job description to see your skill gaps."}
                    </p>
                </div>

                {error && (
                    <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}

                <div className="space-y-5">

                    {/* Step 1: Select Resume */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <p className="text-sm font-semibold text-slate-800">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1e3a8a] text-white text-[10px] font-bold mr-2">1</span>
                                Select your resume
                            </p>
                        </div>
                        <div className="p-5">
                            {loadingResumes ? (
                                <div className="flex items-center justify-center py-8 gap-2 text-slate-400">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-sm">Loading resumes…</span>
                                </div>
                            ) : resumes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                        <AlertCircle className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">No resumes found</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Create a resume first to run the analysis.</p>
                                    </div>
                                    <Link
                                        href="/candidate/resume/create"
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e3a8a] hover:underline"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Create a Resume
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {resumes.map((resume) => {
                                        const isSelected = selectedResumeId === resume.id
                                        return (
                                            <button
                                                key={resume.id}
                                                type="button"
                                                onClick={() => setSelectedResumeId(resume.id)}
                                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${
                                                    isSelected
                                                        ? "border-[#1e3a8a] bg-[#1e3a8a]/5 ring-1 ring-[#1e3a8a]/30"
                                                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                }`}
                                            >
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                                    isSelected ? "bg-[#1e3a8a]/10" : "bg-slate-100"
                                                }`}>
                                                    <FileText className={`w-4 h-4 ${isSelected ? "text-[#1e3a8a]" : "text-slate-400"}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-semibold truncate ${isSelected ? "text-[#1e3a8a]" : "text-slate-800"}`}>
                                                        {resume.title}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        {formatDistanceToNow(new Date(resume.created_at), { addSuffix: true })}
                                                    </p>
                                                </div>
                                                {isSelected
                                                    ? <CheckCircle2 className="w-4 h-4 text-[#1e3a8a] shrink-0" />
                                                    : <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                                                }
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 2: Job Description */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <p className="text-sm font-semibold text-slate-800">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1e3a8a] text-white text-[10px] font-bold mr-2">2</span>
                                Paste the job description
                                {jdText.trim().length > 0 && (
                                    <span className="ml-2 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                        pre-filled
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="p-5">
                            <textarea
                                value={jdText}
                                onChange={(e) => setJdText(e.target.value)}
                                placeholder="Paste the full job description here…&#10;&#10;Example:&#10;We are looking for a Backend Engineer with experience in Python, FastAPI, PostgreSQL, Docker..."
                                rows={10}
                                className="w-full text-sm text-slate-700 placeholder-slate-300 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/30 focus:border-[#1e3a8a]/50 resize-none"
                            />
                            <p className="mt-1.5 text-xs text-slate-400">
                                {jdText.trim().length} characters
                                {jdText.trim().length > 0 && jdText.trim().length < 20 && (
                                    <span className="text-amber-500 ml-1">— paste more text for better results</span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Run Button */}
                    <button
                        type="button"
                        onClick={handleAnalyze}
                        disabled={!canAnalyze}
                        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-[#1e3a8a] text-white text-sm font-bold hover:bg-[#1e3a8a]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#1e3a8a]/20"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Running AI Analysis…
                            </>
                        ) : (
                            <>
                                <ScanSearch className="w-4 h-4" />
                                Run Skill Gap Analysis
                            </>
                        )}
                    </button>

                    {isAnalyzing && (
                        <p className="text-center text-xs text-slate-400 animate-pulse">
                            This may take 20–60 seconds while the AI pipeline processes your resume…
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
