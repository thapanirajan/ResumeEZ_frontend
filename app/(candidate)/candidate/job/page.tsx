import { Suspense } from "react"
import { serverFetch, getServerUser } from "@/lib/serverFetch"
import { JobResponse } from "@/types/job"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import JobFeed from "@/components/landing/JobFeed"
import Link from "next/link"
import { LockKeyhole } from "lucide-react"
import JobFilter from "@/components/job/JobFilters"

type SearchParams = Promise<Record<string, string | string[] | undefined>>

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
                <Footer />
            </div>
        )
    }

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

    let jobs: JobResponse[] = []
    try {
        jobs = await serverFetch<JobResponse[]>(`/api/jobs/${qs ? `?${qs}` : ""}`)
    } catch (e) {
        console.error("[JobsPage] failed to fetch jobs:", e)
    }

    const isFiltered = qs.length > 0

    return (
        <div className="text-slate-900 min-h-scree">
            <main className=" px-4 sm:px-6 py-6 sm:py-10">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        Jobs
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Browse open roles and find your next opportunity.
                    </p>
                </div>

                <section className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-8 items-start">
                    {/* Filters */}
                    <aside className="border border-slate-200/70 bg-white shadow-sm rounded-2xl p-4 sm:p-6 lg:sticky lg:top-24">
                        <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100 rounded-xl" />}>
                            <JobFilter />
                        </Suspense>
                    </aside>

                    {/* Job Listings */}
                    <div className="min-w-0">
                        <div className="mb-4 sm:mb-6 flex flex-col gap-1">
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                                {jobs.length} job{jobs.length === 1 ? "" : "s"} found
                                {isFiltered && (
                                    <span className="ml-2 text-sm font-normal text-slate-500">
                                        (filtered)
                                    </span>
                                )}
                            </h2>
                            <p className="text-sm text-slate-600">
                                Updated listings based on the latest postings.
                            </p>
                        </div>
                        <JobFeed jobs={jobs} />
                    </div>
                </section>
            </main>
        </div>
    )
}
