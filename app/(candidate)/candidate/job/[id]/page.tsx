import { serverFetch, getServerUser } from "@/lib/serverFetch"
import { JobResponse } from "@/types/job"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import {
    ArrowLeft,
    MapPin,
    Briefcase,
    Banknote,
    Clock,
    CalendarX2,
    BadgeCheck,
    GraduationCap,
} from "lucide-react"
import ApplyButton from "./ApplyButton"
import ResumeMatchSection from "./ResumeMatchSection"

const EMPLOYMENT_LABELS: Record<string, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    INTERNSHIP: "Internship",
    CONTRACT: "Contract",
    REMOTE: "Remote",
}

const STATUS_STYLES: Record<string, string> = {
    OPEN: "bg-green-100 text-green-700",
    CLOSED: "bg-slate-100 text-slate-500",
    DRAFT: "bg-yellow-100 text-yellow-700",
}

function formatSalary(min: number | null, max: number | null): string {
    if (!min && !max) return "Not specified"
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`
    if (min) return `From $${(min / 1000).toFixed(0)}k`
    return `Up to $${(max! / 1000).toFixed(0)}k`
}

export default async function JobDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const user = await getServerUser()
    if (!user) redirect("/login")

    const { id } = await params
    let job: JobResponse

    try {
        job = await serverFetch<JobResponse>(`/api/jobs/${id}`)
    } catch {
        notFound()
    }

    const meta = [
        {
            icon: MapPin,
            label: job.location ?? "Remote",
        },
        {
            icon: Briefcase,
            label: EMPLOYMENT_LABELS[job.employment_type] ?? job.employment_type,
        },
        {
            icon: Banknote,
            label: formatSalary(job.salary_min, job.salary_max),
        },
        ...(job.experience_required !== null
            ? [{ icon: GraduationCap, label: `${job.experience_required}+ years experience` }]
            : []),
        {
            icon: Clock,
            label: `Posted ${formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}`,
        },
        ...(job.application_deadline
            ? [{
                icon: CalendarX2,
                label: `Deadline: ${new Date(job.application_deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
                highlight: true,
            }]
            : []),
    ]

    return (
        <div className="bg-slate-50 text-slate-900 min-h-screen">
            <main className="px-4 sm:px-6 py-8 sm:py-10">
                <Link
                    href="/candidate/job"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary mb-5 sm:mb-7 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Jobs
                </Link>

                <div
                    className={
                        user.role === "JOB_SEEKER"
                            ? "grid grid-cols-1 gap-5 sm:gap-6 lg:gap-8 lg:grid-cols-12 lg:items-start"
                            : "max-w-3xl mx-auto"
                    }
                >
                    <div className={user.role === "JOB_SEEKER" ? "lg:col-span-8" : ""}>
                        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_10px_35px_rgba(15,23,42,0.08)] transition-shadow overflow-hidden">
                            <div className="p-5 sm:p-7 lg:p-8 border-b border-slate-100">
                                <div className="flex items-start justify-between gap-4 mb-6">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                                        {job.title}
                                    </h1>
                                    <span className={`shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full ${STATUS_STYLES[job.status] ?? "bg-slate-100 text-slate-500"}`}>
                                        {job.status}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2.5 sm:gap-3">
                                    {meta.map(({ icon: Icon, label, highlight }) => (
                                        <span
                                            key={label}
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs sm:text-sm font-medium ${highlight ? "border-orange-200 bg-orange-50 text-orange-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}
                                        >
                                            <Icon className={`w-3.5 h-3.5 ${highlight ? "text-orange-500" : "text-slate-400"}`} />
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-5 sm:p-7 lg:p-8">
                                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-[0.14em] mb-4 sm:mb-5 flex items-center gap-2">
                                    <BadgeCheck className="w-4 h-4" />
                                    Job Description
                                </h2>
                                <div className="text-[15px] sm:text-base text-slate-700 leading-7 whitespace-pre-wrap">
                                    {job.description}
                                </div>
                            </div>

                            {job.status === "OPEN" && (
                                <div className="px-5 sm:px-7 lg:px-8 pb-5 sm:pb-7 lg:pb-8">
                                    {user.role === "JOB_SEEKER" ? (
                                        <div className="rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4">
                                            <ApplyButton jobId={job.id} />
                                        </div>
                                    ) : (
                                        <div className="w-full text-center py-3 rounded-xl text-sm font-semibold text-slate-400 bg-slate-50 border border-slate-200">
                                            Only candidates can apply for jobs
                                        </div>
                                    )}
                                </div>
                            )}

                            {job.status === "CLOSED" && (
                                <div className="px-5 sm:px-7 lg:px-8 pb-5 sm:pb-7 lg:pb-8">
                                    <div className="w-full text-center py-3 rounded-xl text-sm font-semibold text-slate-400 bg-slate-50 border border-slate-200">
                                        This position is no longer accepting applications
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {user.role === "JOB_SEEKER" && (
                        <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto rounded-2xl border border-slate-200/80 bg-white/70 p-1.5 shadow-[0_6px_22px_rgba(15,23,42,0.06)]">
                            <ResumeMatchSection jobDescription={job.description} />
                        </aside>
                    )}
                </div>
            </main>
        </div>
    )
}
