import { serverFetch, getServerUser } from "@/lib/serverFetch"
import { JobResponse } from "@/types/job"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import JobFeed from "@/components/landing/JobFeed"
import Link from "next/link"
import { LockKeyhole } from "lucide-react"

export default async function JobsPage() {
    const user = await getServerUser()

    if (!user) {
        return (
            <div className="bg-slate-50 text-slate-900 min-h-screen">
                <Header />
                <main className="max-w-3xl mx-auto px-6 py-10">
                    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                            <LockKeyhole className="w-6 h-6 text-slate-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-700">Sign in to view jobs</h2>
                        <p className="text-sm text-slate-500 max-w-xs">
                            Create an account or sign in to browse available job openings.
                        </p>
                        <Link
                            href="/login"
                            className="mt-2 bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-lg shadow-md hover:bg-primary/90 transition-all"
                        >
                            Sign In
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    let jobs: JobResponse[] = []
    try {
        jobs = await serverFetch<JobResponse[]>("/api/jobs/")
    } catch (e) {
        console.error("[JobsPage] failed to fetch jobs:", e)
    }

    return (
        <div className="bg-slate-50 text-slate-900 min-h-screen">
            <Header />
            <main className="max-w-3xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Job Openings</h1>
                    <p className="text-sm text-slate-500 mt-1">{jobs.length} {jobs.length === 1 ? "position" : "positions"} available</p>
                </div>
                <JobFeed jobs={jobs} />
            </main>
            <Footer />
        </div>
    )
}
