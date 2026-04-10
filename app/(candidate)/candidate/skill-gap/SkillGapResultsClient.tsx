"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    CheckCircle2,
    History,
    Plus,
    Search,
    Sparkles,
    XCircle,
} from "lucide-react";

import {
    ExtraSkillItem,
    loadAnalysisResult,
    MatchedSkillItem,
    MissingSkillItem,
    SkillGapResponse,
} from "@/services/skill-gap.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function clampPct(pct: number) {
    return Math.max(0, Math.min(100, pct));
}

function scoreLabel(pct: number) {
    if (pct >= 80) return "Strong match";
    if (pct >= 60) return "Good match";
    if (pct >= 40) return "Moderate match";
    return "Low match";
}

function ScoreBar({ value }: { value: number }) {
    return (
        <div className="h-2 w-full rounded-full bg-slate-100">
            <div
                className="h-2 rounded-full bg-primary transition-[width]"
                style={{ width: `${clampPct(value)}%` }}
            />
        </div>
    );
}

function Metric({
    label,
    value,
    className,
}: {
    label: string;
    value: string | number;
    className?: string;
}) {
    return (
        <div className={cn("rounded-xl border border-slate-200 bg-white p-4", className)}>
            <p className="text-xs font-semibold text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
    );
}

function CategoryBadge({ category }: { category: string }) {
    return (
        <Badge variant="secondary" className="px-2 py-0.5 text-[11px] font-semibold">
            {category || "general"}
        </Badge>
    );
}

function SkillRow({
    name,
    category,
    left,
    right,
    meta,
}: {
    name: string;
    category: string;
    left?: React.ReactNode;
    right?: React.ReactNode;
    meta?: React.ReactNode;
}) {
    return (
        <li className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm transition-colors hover:bg-slate-50">
            <div className="flex min-w-0 items-start gap-3">
                {left}
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <CategoryBadge category={category} />
                        {meta}
                    </div>
                </div>
            </div>
            {right}
        </li>
    );
}

function MatchedRow({ skill }: { skill: MatchedSkillItem }) {
    return (
        <SkillRow
            name={skill.name}
            category={skill.category}
            left={
                <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                </div>
            }
            meta={
                <>
                    {skill.match_type === "fuzzy" && (
                        <Badge variant="outline" className="px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                            fuzzy
                        </Badge>
                    )}
                    {skill.years > 0 && (
                        <span className="text-[11px] font-medium text-slate-500">
                            {skill.years}yr exp
                        </span>
                    )}
                </>
            }
        />
    );
}

function MissingRow({ skill }: { skill: MissingSkillItem }) {
    const sectionVariant =
        skill.section === "required"
            ? "destructive"
            : skill.section === "preferred"
              ? "warning"
              : "secondary";

    return (
        <SkillRow
            name={skill.name}
            category={skill.category}
            left={
                <div className="mt-0.5 rounded-lg bg-slate-100 p-2 text-slate-600">
                    <XCircle className="h-4 w-4" />
                </div>
            }
            meta={
                <Badge
                    variant={sectionVariant as "destructive" | "warning" | "secondary"}
                    className="px-2 py-0.5 text-[11px] font-semibold"
                >
                    {skill.section}
                </Badge>
            }
            right={
                <div className="shrink-0 text-right">
                    <p className="text-[11px] font-semibold text-slate-500">Priority</p>
                    <p className="text-sm font-bold text-slate-900">{skill.priority_score.toFixed(1)}</p>
                </div>
            }
        />
    );
}

function ExtraRow({ skill }: { skill: ExtraSkillItem }) {
    return (
        <SkillRow
            name={skill.name}
            category={skill.category}
            left={
                <div className="mt-0.5 rounded-lg bg-slate-100 p-2 text-slate-600">
                    <Plus className="h-4 w-4" />
                </div>
            }
        />
    );
}

function NoResults() {
    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 md:px-6">
            <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">No analysis found</h2>
                <p className="mt-2 text-sm text-slate-500">
                    Run a skill gap analysis by selecting a resume and pasting a job description.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    <Button asChild>
                        <Link href="/candidate/upload">Go to Skill Gap Analyzer</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function SkillGapResultsClient() {
    const [result] = useState<SkillGapResponse | null>(() => loadAnalysisResult());
    const [tab, setTab] = useState<"missing" | "matched" | "extra">("missing");
    const [query, setQuery] = useState("");
    const [missingSection, setMissingSection] = useState<"all" | "required" | "preferred" | "general">("all");
    const [showFullSummary, setShowFullSummary] = useState(false);

    const normalizedQuery = query.trim().toLowerCase();
    const filterByQuery = <T extends { name: string }>(items: T[]) => {
        if (!normalizedQuery) return items;
        return items.filter((s) => s.name.toLowerCase().includes(normalizedQuery));
    };

    if (!result) return <NoResults />;

    const {
        match_percentage,
        total_jd_skills,
        hard_skill_match,
        soft_skill_match,
        matched_skills,
        missing_skills,
        extra_skills,
        gap_report,
        ontology_version,
        roadmap_id,
    } = result;

    const filteredMatched = useMemo(() => filterByQuery(matched_skills), [matched_skills, normalizedQuery]);
    const filteredExtra = useMemo(() => filterByQuery(extra_skills), [extra_skills, normalizedQuery]);
    const filteredMissing = useMemo(() => {
        const scoped =
            missingSection === "all"
                ? missing_skills
                : missing_skills.filter((s) => s.section === missingSection);
        return filterByQuery(scoped);
    }, [missing_skills, missingSection, normalizedQuery]);

    const requiredMissing = useMemo(
        () => missing_skills.filter((s) => s.section === "required"),
        [missing_skills]
    );

    const topGaps = useMemo(() => requiredMissing.slice(0, 6).map((s) => s.name), [requiredMissing]);

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
            <div className="mx-auto max-w-6xl space-y-6">
                <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                                    Skill Gap Analysis
                                </h1>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Ontology v{ontology_version} · {total_jd_skills} JD skills detected
                                </p>
                            </div>
                        </div>
                        {topGaps.length > 0 && (
                            <p className="text-sm text-slate-600">
                                Focus first on:{" "}
                                <span className="font-semibold text-slate-900">
                                    {topGaps.join(", ")}
                                </span>
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="secondary" size="sm" className="gap-2">
                            <Link href="/candidate/upload">
                                <ArrowLeft className="h-4 w-4" />
                                Analyze Another
                            </Link>
                        </Button>
                        <Button asChild variant="secondary" size="sm" className="gap-2">
                            <Link href="/candidate/upload">
                                <History className="h-4 w-4" />
                                History
                            </Link>
                        </Button>
                        <Button asChild size="sm" className="gap-2">
                            <Link
                                href={
                                    roadmap_id
                                        ? `/candidate/learning-roadmap?roadmap_id=${roadmap_id}`
                                        : "/candidate/learning-roadmap"
                                }
                            >
                                View Roadmap
                            </Link>
                        </Button>
                    </div>
                </header>

                <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-700">Overall match</p>
                                <div className="mt-2 flex items-end gap-3">
                                    <p className="text-5xl font-black tracking-tight text-slate-900">
                                        {match_percentage.toFixed(1)}%
                                    </p>
                                    <Badge variant="secondary" className="mb-2">
                                        {scoreLabel(match_percentage)}
                                    </Badge>
                                </div>
                                <div className="mt-4">
                                    <ScoreBar value={match_percentage} />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 md:min-w-[320px]">
                                <Metric label="JD Skills" value={total_jd_skills} className="p-3" />
                                <Metric label="Matched" value={matched_skills.length} className="p-3" />
                                <Metric label="Missing" value={missing_skills.length} className="p-3" />
                            </div>
                        </div>

                        {(hard_skill_match !== null || soft_skill_match !== null) && (
                            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                                {hard_skill_match !== null && (
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                                            <span>Technical skills</span>
                                            <span className="text-slate-900">{hard_skill_match.toFixed(1)}%</span>
                                        </div>
                                        <div className="mt-2">
                                            <ScoreBar value={hard_skill_match} />
                                        </div>
                                    </div>
                                )}
                                {soft_skill_match !== null && (
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                                            <span>Soft skills</span>
                                            <span className="text-slate-900">{soft_skill_match.toFixed(1)}%</span>
                                        </div>
                                        <div className="mt-2">
                                            <ScoreBar value={soft_skill_match} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-slate-700">Summary</p>
                                <p className="mt-1 text-xs text-slate-500">
                                    A short explanation of what your score means.
                                </p>
                            </div>
                            {/* <Badge variant="secondary" className="px-8">{requiredMissing.length} required gaps</Badge> */}
                        </div>

                        <div className={cn("mt-4 text-sm leading-relaxed text-slate-700", !showFullSummary && "max-h-28 overflow-hidden")}>
                            {gap_report}
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowFullSummary((v) => !v)}
                            className="mt-3 text-sm font-semibold text-primary hover:underline"
                        >
                            {showFullSummary ? "Show less" : "Read more"}
                        </button>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4">
                        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
                            <TabsList className="h-11">
                                <TabsTrigger value="missing" className="gap-2">
                                    Missing
                                    <Badge variant="secondary" className="px-2 py-0.5 text-[11px]">
                                        {missing_skills.length}
                                    </Badge>
                                </TabsTrigger>
                                <TabsTrigger value="matched" className="gap-2">
                                    Matched
                                    <Badge variant="secondary" className="px-2 py-0.5 text-[11px]">
                                        {matched_skills.length}
                                    </Badge>
                                </TabsTrigger>
                                <TabsTrigger value="extra" className="gap-2">
                                    Extra
                                    <Badge variant="secondary" className="px-2 py-0.5 text-[11px]">
                                        {extra_skills.length}
                                    </Badge>
                                </TabsTrigger>
                            </TabsList>

                            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="relative w-full md:max-w-md">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search skills…"
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                                    />
                                </div>

                                {tab === "missing" && (
                                    <div className="flex flex-wrap items-center gap-2">
                                        {(["all", "required", "preferred", "general"] as const).map((v) => (
                                            <button
                                                key={v}
                                                type="button"
                                                onClick={() => setMissingSection(v)}
                                                className={cn(
                                                    "h-10 rounded-xl border px-3 text-sm font-semibold transition-colors",
                                                    missingSection === v
                                                        ? "border-primary/30 bg-primary/10 text-primary"
                                                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                                )}
                                            >
                                                {v === "all" ? "All" : v[0].toUpperCase() + v.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <TabsContent value="missing">
                                {filteredMissing.length === 0 ? (
                                    <p className="mt-6 text-sm text-slate-500">No missing skills match your search.</p>
                                ) : (
                                    <ul className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
                                        {filteredMissing.map((s, i) => (
                                            <MissingRow key={`${s.canonical_id}-${i}`} skill={s} />
                                        ))}
                                    </ul>
                                )}
                            </TabsContent>

                            <TabsContent value="matched">
                                {filteredMatched.length === 0 ? (
                                    <p className="mt-6 text-sm text-slate-500">No matched skills match your search.</p>
                                ) : (
                                    <ul className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
                                        {filteredMatched.map((s, i) => (
                                            <MatchedRow key={`${s.canonical_id}-${i}`} skill={s} />
                                        ))}
                                    </ul>
                                )}
                            </TabsContent>

                            <TabsContent value="extra">
                                <p className="mt-6 text-sm text-slate-500">
                                    Skills in your resume that were not required by this job description.
                                </p>
                                {filteredExtra.length === 0 ? (
                                    <p className="mt-3 text-sm text-slate-500">No extra skills match your search.</p>
                                ) : (
                                    <ul className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
                                        {filteredExtra.map((s, i) => (
                                            <ExtraRow key={`${s.canonical_id}-${i}`} skill={s} />
                                        ))}
                                    </ul>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>
            </div>
        </div>
    );
}

