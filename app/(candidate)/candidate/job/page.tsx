import { Suspense } from "react"
import { serverFetch, getServerUser } from "@/lib/serverFetch"
import { JobResponse } from "@/types/job"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LockKeyhole } from "lucide-react"
import JobsPageClient from "./JobsPageClient"
import { JobFeedSkeleton } from "@/components/job/JobCardSkeleton"

type SearchParams = Promise<Record<string, string | string[] | undefined>>

async function JobsContent({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams
    const query = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
        if (!value) continue
        if (Array.isArray(value)) {
            value.forEach((v) => query.append(key, v))
        } else {
            query.append(key, value)
        }
    }
    const qs = query.toString()
    const isFiltered = [...query.entries()].some(([k]) => k !== "sort_by" && k !== "order")

    let jobs: JobResponse[] = []
    let error: string | undefined

    try {
        jobs = await serverFetch<JobResponse[]>(`/api/jobs/${qs ? `?${qs}` : ""}`)
    } catch (e) {
        error = e instanceof Error ? e.message : "Something went wrong"
        console.error("[JobsPage] failed to fetch jobs:", e)
    }

    return <JobsPageClient initialJobs={jobs} isFiltered={isFiltered} error={error} />
}

export default async function JobsPage({ searchParams }: { searchParams: SearchParams }) {
    const user = await getServerUser()

    if (!user) {
        return (
            <div className="bg-slate-50 text-slate-900 min-h-screen">
                <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                    <div className="flex flex-col items-center justify-center py-20 sm:py-24 text-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                            <LockKeyhole className="w-6 h-6 text-slate-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-700">Sign in to view jobs</h2>
                        <p className="text-sm text-slate-500 max-w-xs">
                            Create an account or sign in to browse available job openings.
                        </p>
                        <Link
                            href="/login"
                            className="mt-2 bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary/90 transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                </main>
            </div>
        )
    }

    if (user.role !== "JOB_SEEKER") redirect("/recruiter")

    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-slate-50">
                    <div className="mb-5">
                        <div className="h-8 w-40 bg-slate-200 rounded animate-pulse mb-2" />
                        <div className="h-4 w-64 bg-slate-100 rounded animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">
                        <div className="hidden lg:block h-96 bg-white rounded-2xl border border-slate-200/70 animate-pulse" />
                        <JobFeedSkeleton count={6} />
                    </div>
                </div>
            }
        >
            <JobsContent searchParams={searchParams} />
        </Suspense>
    )
}
