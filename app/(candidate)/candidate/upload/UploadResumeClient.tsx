"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import {
    ScanSearch,
    FileText,
    CheckCircle2,
    Circle,
    RotateCcw,
    History,
    ChevronRight,
    Map,
    AlertCircle,
    Loader2,
    Sparkles,
    Plus,
} from "lucide-react";
import { toast } from "sonner";

import { ResumeResponse, resumeApi } from "@/services/resume.service";
import {
    skillGapApi,
    saveAnalysisResult,
    SkillGapReportListItem,
} from "@/services/skill-gap.service";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// ── Score helpers ─────────────────────────────────────────────────────────────

function scoreVariant(pct: number): "success" | "info" | "warning" | "destructive" {
    if (pct >= 80) return "success";
    if (pct >= 60) return "info";
    if (pct >= 40) return "warning";
    return "destructive";
}

function scoreLabel(pct: number) {
    if (pct >= 80) return "Strong match";
    if (pct >= 60) return "Good match";
    if (pct >= 40) return "Moderate match";
    return "Low match";
}

function scoreBarColor(pct: number) {
    if (pct >= 80) return "bg-emerald-500";
    if (pct >= 60) return "bg-blue-600";
    if (pct >= 40) return "bg-amber-400";
    return "bg-red-500";
}

// ── History card ──────────────────────────────────────────────────────────────

function HistoryCard({
    report,
    onView,
    loadingId,
}: {
    report: SkillGapReportListItem;
    onView: (report: SkillGapReportListItem) => void;
    loadingId: string | null;
}) {
    const pct = report.match_percentage;
    const isLoading = loadingId === report.id;

    return (
        <Card className="group transition-shadow hover:shadow-md">
            <CardContent className="p-5">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
                        <FileText className="h-4 w-4 text-slate-500" />
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {report.resume_title}
                                </p>
                                <p
                                    className="mt-0.5 text-xs text-slate-400"
                                    title={format(new Date(report.created_at), "PPpp")}
                                >
                                    {formatDistanceToNow(new Date(report.created_at), {
                                        addSuffix: true,
                                    })}
                                </p>
                            </div>

                            {/* Match badge + score */}
                            <div className="flex flex-col items-end gap-1 shrink-0">
                                <span className="text-xl font-bold text-slate-900">
                                    {pct.toFixed(1)}%
                                </span>
                                <Badge variant={scoreVariant(pct)} className="text-[10px] px-2 py-0.5">
                                    {scoreLabel(pct)}
                                </Badge>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                                className={`h-1.5 rounded-full transition-all ${scoreBarColor(pct)}`}
                                style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                        </div>

                        {/* Stats + actions */}
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs text-slate-500">
                                <span className="font-medium text-slate-700">{report.total_jd_skills}</span>{" "}
                                skills detected in JD
                            </p>

                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => onView(report)}
                                    disabled={isLoading}
                                    className="h-8 gap-1.5 text-xs"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                        <ChevronRight className="h-3 w-3" />
                                    )}
                                    View Report
                                </Button>

                                {report.roadmap_id && (
                                    <Link
                                        href={`/candidate/learning-roadmap?roadmap_id=${report.roadmap_id}`}
                                    >
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 gap-1.5 text-xs text-slate-600"
                                        >
                                            <Map className="h-3 w-3" />
                                            Roadmap
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ── History tab ───────────────────────────────────────────────────────────────

function HistoryTab() {
    const router = useRouter();
    const [reports, setReports] = useState<SkillGapReportListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        skillGapApi
            .getHistory()
            .then(setReports)
            .catch(() => setError("Failed to load history. Please try again."))
            .finally(() => setLoading(false));
    }, []);

    const handleViewReport = useCallback(
        async (report: SkillGapReportListItem) => {
            setLoadingId(report.id);
            try {
                const detail = await skillGapApi.getReport(report.id);
                saveAnalysisResult({
                    analysis_id: detail.id,
                    resume_id: detail.resume_id,
                    roadmap_id: detail.roadmap_id,
                    match_percentage: detail.match_percentage,
                    total_jd_skills: detail.total_jd_skills,
                    hard_skill_match: detail.hard_skill_match,
                    soft_skill_match: detail.soft_skill_match,
                    matched_skills: detail.matched_skills,
                    missing_skills: detail.missing_skills,
                    extra_skills: detail.extra_skills,
                    gap_report: detail.gap_report,
                    ontology_version: detail.ontology_version,
                    roadmap: { phase_1_core: [], phase_2_primary: [], phase_3_advanced: [] },
                });
                router.push("/candidate/skill-gap");
            } catch {
                toast.error("Failed to load report. Please try again.");
                setLoadingId(null);
            }
        },
        [router]
    );

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-100" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
            </div>
        );
    }

    if (reports.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                    <History className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">No analyses yet</h3>
                <p className="mt-1.5 max-w-xs text-sm text-slate-500">
                    Run your first skill gap analysis to start tracking progress.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {reports.map((report) => (
                <HistoryCard
                    key={report.id}
                    report={report}
                    onView={handleViewReport}
                    loadingId={loadingId}
                />
            ))}
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function UploadResumeClient() {
    const router = useRouter();

    // Form state
    const [resumes, setResumes] = useState<ResumeResponse[]>([]);
    const [selectedResumeId, setSelectedResumeId] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [isLoadingResumes, setIsLoadingResumes] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Tab state (persisted in a ref so switching tabs doesn't reset form)
    const [activeTab, setActiveTab] = useState("analyze");

    useEffect(() => {
        resumeApi
            .getCandidateResumes()
            .then((data) => {
                setResumes(data);
                if (data.length > 0) setSelectedResumeId(data[0].id);
            })
            .catch(() => toast.error("Could not load your resume versions."))
            .finally(() => setIsLoadingResumes(false));
    }, []);

    const selectedResume = useMemo(
        () => resumes.find((r) => r.id === selectedResumeId) ?? null,
        [resumes, selectedResumeId]
    );

    const resumeReady = Boolean(selectedResumeId);
    const jdReady = jobDescription.trim().length >= 20;
    const canSubmit = resumeReady && jdReady && !isSubmitting;

    async function handleAnalyze() {
        if (!selectedResumeId) { toast.error("Please select a resume version."); return; }
        if (!jobDescription.trim()) { toast.error("Please paste a job description."); return; }
        try {
            setIsSubmitting(true);
            const result = await skillGapApi.analyze(selectedResumeId, jobDescription.trim());
            saveAnalysisResult(result);
            toast.success("Analysis complete!");
            router.push("/candidate/skill-gap");
        } catch (err: unknown) {
            const axiosError = err as { response?: { data?: { detail?: string; message?: string } } };
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
        if (resumes.length > 0) setSelectedResumeId(resumes[0].id);
        else setSelectedResumeId("");
    }

    return (
        <div className="bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

                {/* ── Page header ───────────────────────────────────────── */}
                <div className="mb-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2.5 mb-1">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1e3a8a]/10">
                                    <ScanSearch className="h-5 w-5 text-[#1e3a8a]" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Skill Gap Analyzer
                                </h1>
                            </div>
                            <p className="text-sm text-slate-500">
                                Compare your resume against any job description for a personalised learning roadmap.
                            </p>
                        </div>
                        <Badge variant="secondary" className="mt-1">Candidate Workspace</Badge>
                    </div>
                </div>

                {/* ── Tabs ──────────────────────────────────────────────── */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="analyze" className="cursor-pointer">
                            <Sparkles className="h-3.5 w-3.5" />
                            New Analysis
                        </TabsTrigger>
                        <TabsTrigger value="history" className="cursor-pointer">
                            <History className="h-3.5 w-3.5 cursor-pointer" />
                            History
                        </TabsTrigger>
                    </TabsList>

                    {/* ── New Analysis tab ─────────────────────────────── */}
                    <TabsContent value="analyze">
                        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">

                            {/* Left column — form */}
                            <div className="space-y-4">

                                {/* Step 1 */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1e3a8a] text-[11px] font-bold text-white">
                                                1
                                            </span>
                                            <CardTitle className="text-base">Select Resume Version</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {isLoadingResumes ? (
                                            <div className="space-y-2">
                                                <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
                                                <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
                                            </div>
                                        ) : resumes.length === 0 ? (
                                            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 py-6 text-center">
                                                <FileText className="h-7 w-7 text-slate-300" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700">No resumes found</p>
                                                    <p className="mt-0.5 text-xs text-slate-400">Create one in the Resume Builder first.</p>
                                                </div>
                                                <Link href="/candidate/resume/create">
                                                    <Button size="sm" variant="secondary" className="gap-1.5">
                                                        <Plus className="h-3.5 w-3.5" />
                                                        Create Resume
                                                    </Button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                                        Resume version
                                                    </label>
                                                    <select
                                                        value={selectedResumeId}
                                                        onChange={(e) => setSelectedResumeId(e.target.value)}
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
                                                    >
                                                        {resumes.map((resume) => (
                                                            <option key={resume.id} value={resume.id}>
                                                                {resume.title}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {selectedResume && (
                                                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
                                                        <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                                        <span className="text-xs text-slate-500">
                                                            Using:{" "}
                                                            <span className="font-semibold text-slate-700">
                                                                {selectedResume.title}
                                                            </span>
                                                        </span>
                                                        <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-emerald-500" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Step 2 */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1e3a8a] text-[11px] font-bold text-white">
                                                2
                                            </span>
                                            <CardTitle className="text-base">Paste Job Description</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                                Job title{" "}
                                                <span className="normal-case text-slate-400">(optional)</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={jobTitle}
                                                onChange={(e) => setJobTitle(e.target.value)}
                                                placeholder="e.g. Backend Engineer"
                                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-300 transition focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                                Job description
                                            </label>
                                            <textarea
                                                rows={11}
                                                value={jobDescription}
                                                onChange={(e) => setJobDescription(e.target.value)}
                                                placeholder="Paste the full job description here…&#10;&#10;Include responsibilities, requirements, and preferred skills for best results."
                                                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-300 transition focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
                                            />
                                            <div className="flex items-center justify-between text-xs text-slate-400">
                                                <span>Include requirements &amp; preferred skills for best results.</span>
                                                <span className={jobDescription.length > 0 && !jdReady ? "text-amber-500" : ""}>
                                                    {jobDescription.length} chars
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right column — sidebar */}
                            <aside className="space-y-4 lg:sticky lg:top-6 h-fit">

                                {/* Ready check */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Ready Check</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2.5">
                                        <div className="flex items-center gap-2.5">
                                            {resumeReady ? (
                                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                                            ) : (
                                                <Circle className="h-4 w-4 shrink-0 text-slate-300" />
                                            )}
                                            <span className={`text-sm ${resumeReady ? "text-emerald-700 font-medium" : "text-slate-500"}`}>
                                                Resume selected
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            {jdReady ? (
                                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                                            ) : (
                                                <Circle className="h-4 w-4 shrink-0 text-slate-300" />
                                            )}
                                            <span className={`text-sm ${jdReady ? "text-emerald-700 font-medium" : "text-slate-500"}`}>
                                                Job description added
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* What you'll get */}
                                <Card className="border-[#1e3a8a]/20 bg-[#1e3a8a]/[0.03]">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm text-[#1e3a8a]">What you&apos;ll get</CardTitle>
                                        <CardDescription>AI-powered analysis in ~30s</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {[
                                                "Skill match percentage",
                                                "Matched & missing skills",
                                                "Priority-ranked gap list",
                                                "3-phase learning roadmap",
                                            ].map((item) => (
                                                <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                                                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1e3a8a]/10 text-[#1e3a8a] text-[9px] font-bold">✓</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Separator />

                                {/* Actions */}
                                <div className="space-y-2">
                                    <Button
                                        onClick={handleAnalyze}
                                        disabled={!canSubmit}
                                        className="w-full gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Analyzing…
                                            </>
                                        ) : (
                                            <>
                                                <ScanSearch className="h-4 w-4" />
                                                Analyze Skill Gap
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={handleReset}
                                        className="w-full gap-2"
                                        disabled={isSubmitting}
                                    >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                        Reset
                                    </Button>
                                </div>

                                {isSubmitting && (
                                    <p className="text-center text-xs text-slate-400 animate-pulse">
                                        This may take 20–60 s while the AI pipeline runs…
                                    </p>
                                )}
                            </aside>
                        </div>
                    </TabsContent>

                    {/* ── History tab ──────────────────────────────────── */}
                    <TabsContent value="history">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-semibold text-slate-900">Analysis History</h2>
                                <p className="text-sm text-slate-500">
                                    All your past skill gap analyses, newest first.
                                </p>
                            </div>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="gap-1.5"
                                onClick={() => setActiveTab("analyze")}
                            >
                                <Plus className="h-3.5 w-3.5" />
                                New Analysis
                            </Button>
                        </div>
                        <HistoryTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
