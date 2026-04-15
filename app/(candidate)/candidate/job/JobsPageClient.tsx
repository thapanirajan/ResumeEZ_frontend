"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { SlidersHorizontal, X, AlertCircle, Briefcase, Search, LayoutList, LayoutGrid, ChevronDown } from "lucide-react"
import { JobResponse } from "@/types/job"
import JobFeed from "@/components/landing/JobFeed"
import JobFilter from "@/components/job/JobFilters"
import MobileFilterDrawer from "@/components/job/MobileFilterDrawer"
import { JobFeedSkeleton } from "@/components/job/JobCardSkeleton"

const BATCH = 12

const SORT_PRESETS: { key: string; label: string; sortBy: string; order: string }[] = [
    { key: "created_at|desc", label: "Newest first", sortBy: "created_at", order: "desc" },
    { key: "created_at|asc", label: "Oldest first", sortBy: "created_at", order: "asc" },
    { key: "salary_max|desc", label: "Highest salary", sortBy: "salary_max", order: "desc" },
    { key: "salary_min|asc", label: "Lowest salary", sortBy: "salary_min", order: "asc" },
    { key: "experience_required|desc", label: "Most experienced", sortBy: "experience_required", order: "desc" },
    { key: "experience_required|asc", label: "Least experienced", sortBy: "experience_required", order: "asc" },
]

const FILTER_LABELS: Record<string, string> = {
    title: "Title",
    location: "Location",
    employment_types: "Type",
    min_salary: "Min salary",
    max_salary: "Max salary",
    min_experience: "Min exp",
    max_experience: "Max exp",
}

type Props = {
    initialJobs: JobResponse[]
    isFiltered: boolean
    error?: string
}

export default function JobsPageClient({ initialJobs, isFiltered, error }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Infinite scroll state
    const [visibleCount, setVisibleCount] = useState(BATCH)
    const sentinelRef = useRef<HTMLDivElement>(null)

    // Bookmark state (optimistic, no persistence)
    const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())

    // Mobile drawer
    const [drawerOpen, setDrawerOpen] = useState(false)

    // Layout toggle
    const [layout, setLayout] = useState<"list" | "grid">("list")

    // Sort — single key encodes both field and direction
    const urlSortKey = `${searchParams.get("sort_by") ?? "created_at"}|${searchParams.get("order") ?? "desc"}`
    const [sortKey, setSortKey] = useState(
        SORT_PRESETS.some((p) => p.key === urlSortKey) ? urlSortKey : "created_at|desc"
    )

    // Title search
    const [titleInput, setTitleInput] = useState(searchParams.get("title") ?? "")

    const applyTitleSearch = () => {
        const params = new URLSearchParams(searchParams.toString())
        if (titleInput.trim().length >= 3) {
            params.set("title", titleInput.trim())
        } else {
            params.delete("title")
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    const applySort = (key: string) => {
        const preset = SORT_PRESETS.find((p) => p.key === key)
        if (!preset) return
        const params = new URLSearchParams(searchParams.toString())
        if (preset.sortBy !== "created_at") params.set("sort_by", preset.sortBy)
        else params.delete("sort_by")
        if (preset.order !== "desc") params.set("order", preset.order)
        else params.delete("order")
        router.push(`${pathname}?${params.toString()}`)
    }

    // Reset visible count when jobs change (React-recommended render-phase state pattern)
    const [prevInitialJobs, setPrevInitialJobs] = useState(initialJobs)
    if (prevInitialJobs !== initialJobs) {
        setPrevInitialJobs(initialJobs)
        setVisibleCount(BATCH)
    }

    // IntersectionObserver for infinite scroll
    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel) return
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisibleCount((c) => c + BATCH)
            },
            { threshold: 0.1 }
        )
        obs.observe(sentinel)
        return () => obs.disconnect()
    }, [])

    const toggleSave = (id: string) => {
        setSavedJobs((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const visibleJobs = initialJobs.slice(0, visibleCount)
    const hasMore = visibleCount < initialJobs.length

    // Active filter tags from URL
    const activeTags: { key: string; value: string; label: string }[] = []
    searchParams.forEach((value, key) => {
        if (key === "sort_by" || key === "order") return
        const label = FILTER_LABELS[key] ?? key
        activeTags.push({ key, value, label })
    })

    const removeTag = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        // For multi-value params (employment_types), delete matching value only
        const all = params.getAll(key).filter((v) => v !== value)
        params.delete(key)
        all.forEach((v) => params.append(key, v))
        router.push(`${pathname}?${params.toString()}`)
    }

    const clearAllFilters = () => router.push(pathname)

    return (
        <div className="bg-slate-50">
            {/* Page header */}
            <div className="mb-5">
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#0f172a]">
                    Browse Jobs
                </h1>
                <p className="mt-2 text-sm text-slate-500 max-w-xl">
                    Find your next opportunity from the latest open roles.
                </p>
            </div>

            {/* Active filter tags */}
            {activeTags.length > 0 && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-slate-400">Active:</span>
                    {activeTags.map((tag) => (
                        <span
                            key={`${tag.key}-${tag.value}`}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm"
                        >
                            <span className="text-slate-400">{tag.label}:</span>
                            {tag.value}
                            <button
                                type="button"
                                onClick={() => removeTag(tag.key, tag.value)}
                                aria-label={`Remove ${tag.label} filter`}
                                className="ml-0.5 rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                    <button
                        type="button"
                        onClick={clearAllFilters}
                        className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                    >
                        Clear all
                    </button>
                </div>
            )}

            {/* 2-column grid */}
            <section
                className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-8 items-start"
                aria-label="Job listings"
            >
                {/* Desktop filter sidebar */}
                <aside
                    className="hidden lg:block border border-slate-200/70 bg-white shadow-sm rounded-2xl p-5 sm:p-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto"
                    aria-label="Job filters"
                >
                    <JobFilter />
                </aside>

                {/* Job list */}
                <div className="min-w-0">
                    {/* Title search + sort */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search job title..."
                                    value={titleInput}
                                    onChange={(e) => setTitleInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && applyTitleSearch()}
                                    className="w-full rounded-lg border border-[#e2e8f0] bg-white 
                                    pl-10 pr-4 py-2.5 text-sm text-[#0f172a]
                                    focus:outline-none focus:ring-2 focus:ring-[#1e3b8a]/20 
                                    focus:border-[#1e3b8a]
                                    transition-all duration-200"
                                    aria-label="Search job title"
                                />
                            </div>
                            {/* Sort control */}
                            <div className="relative shrink-0">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none select-none">
                                    Sort:
                                </span>
                                <select
                                    value={sortKey}
                                    onChange={(e) => {
                                        setSortKey(e.target.value)
                                        applySort(e.target.value)
                                    }}
                                    className="appearance-none rounded-xl border border-slate-200 bg-white pl-12 pr-8 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 shadow-sm transition cursor-pointer"
                                    aria-label="Sort jobs"
                                >
                                    {SORT_PRESETS.map(({ key, label }) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        {titleInput.trim().length > 0 && titleInput.trim().length < 3 && (
                            <p className="mt-1 text-xs text-amber-500 pl-1">Enter at least 3 characters</p>
                        )}
                    </div>

                    {/* Result header */}
                    <div className="mb-4 flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-slate-600">
                            <span className="font-bold text-slate-900">{initialJobs.length}</span>
                            {" "}job{initialJobs.length !== 1 ? "s" : ""} found
                            {isFiltered && (
                                <span className="ml-1.5 text-slate-400 font-normal">(filtered)</span>
                            )}
                        </p>
                        <div className="flex items-center gap-2">
                            {savedJobs.size > 0 && (
                                <span className="text-xs text-slate-400">
                                    {savedJobs.size} saved
                                </span>
                            )}
                            {/* Layout toggle */}
                            <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setLayout("list")}
                                    aria-label="Single column layout"
                                    className={`p-2 transition-colors ${layout === "list" ? "bg-primary text-white" : "text-slate-400 hover:bg-slate-50"}`}
                                >
                                    <LayoutList className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLayout("grid")}
                                    aria-label="Two column layout"
                                    className={`p-2 transition-colors ${layout === "grid" ? "bg-primary text-white" : "text-slate-400 hover:bg-slate-50"}`}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Error state */}
                    {error && (
                        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 mb-4">
                            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-red-700">Failed to load jobs</p>
                                <p className="text-xs text-red-500 mt-0.5">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Empty state */}
                    {!error && initialJobs.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 sm:py-24 gap-3 text-center px-6">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-700">
                                    {isFiltered ? "No jobs match your filters" : "No jobs available right now"}
                                </p>
                                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                                    {isFiltered
                                        ? "Try adjusting or clearing your filters to see more results."
                                        : "Check back later as new roles are posted regularly."}
                                </p>
                            </div>
                            {isFiltered && (
                                <button
                                    type="button"
                                    onClick={clearAllFilters}
                                    className="mt-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    )}

                    {/* Job cards */}
                    {!error && initialJobs.length > 0 && (
                        <>
                            <JobFeed
                                jobs={visibleJobs}
                                savedJobs={savedJobs}
                                onToggleSave={toggleSave}
                                layout={layout}
                            />

                            {/* Load-more sentinel */}
                            <div ref={sentinelRef} className="h-1" aria-hidden="true" />

                            {/* Loading more indicator */}
                            {hasMore && (
                                <div className="mt-6">
                                    <JobFeedSkeleton count={3} />
                                </div>
                            )}

                            {/* All loaded */}
                            {!hasMore && initialJobs.length > BATCH && (
                                <p className="mt-6 text-center text-xs text-slate-400">
                                    All {initialJobs.length} jobs loaded
                                </p>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Mobile: floating filters button */}
            <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 active:scale-95 transition-all"
                aria-label="Open filters"
            >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeTags.length > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold">
                        {activeTags.length}
                    </span>
                )}
            </button>

            {/* Mobile filter drawer */}
            <MobileFilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </div>
    )
}
