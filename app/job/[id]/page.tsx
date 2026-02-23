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
    if (min && max) return `$${(min / 1000).toFixed(0)}k – $${(max / 1000).toFixed(0)}k`
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
            <Header />

            <main className="max-w-3xl mx-auto px-6 py-10">
                {/* Back */}
                <Link
                    href="/job"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Jobs
                </Link>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    {/* Header section */}
                    <div className="p-8 border-b border-slate-100">
                        <div className="flex items-start justify-between gap-4 mb-5">
                            <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                                {job.title}
                            </h1>
                            <span className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[job.status] ?? "bg-slate-100 text-slate-500"}`}>
                                {job.status}
                            </span>
                        </div>

                        {/* Meta grid */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2.5">
                            {meta.map(({ icon: Icon, label, highlight }) => (
                                <span
                                    key={label}
                                    className={`flex items-center gap-1.5 text-sm ${highlight ? "text-orange-600" : "text-slate-500"}`}
                                >
                                    <Icon className={`w-4 h-4 ${highlight ? "text-orange-400" : "text-slate-400"}`} />
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="p-8">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <BadgeCheck className="w-4 h-4" />
                            Job Description
                        </h2>
                        <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {job.description}
                        </div>
                    </div>

                    {/* Apply CTA */}
                    {job.status === "OPEN" && (
                        <div className="px-8 pb-8">
                            <button className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">
                                Apply Now
                            </button>
                        </div>
                    )}

                    {job.status === "CLOSED" && (
                        <div className="px-8 pb-8">
                            <div className="w-full text-center py-3 rounded-xl text-sm font-semibold text-slate-400 bg-slate-50 border border-slate-200">
                                This position is no longer accepting applications
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
