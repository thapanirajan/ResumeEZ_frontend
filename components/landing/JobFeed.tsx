import { JobResponse } from "@/types/job"
import JobCard from "./JobCard"
import { formatDistanceToNow } from "date-fns"

const EMPLOYMENT_LABELS: Record<string, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    INTERNSHIP: "Internship",
    CONTRACT: "Contract",
    REMOTE: "Remote",
}

const STATUS_COLOR: Record<string, string> = {
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

export default function JobFeed({ jobs }: { jobs: JobResponse[] }) {
    if (jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 sm:py-24 text-slate-500 gap-2 text-center">
                <span className="text-3xl">💼</span>
                <p className="text-sm font-medium text-slate-700">No jobs available right now</p>
                <p className="text-sm text-slate-500 max-w-sm">
                    Try checking back later as new roles are posted.
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col space-y-4">
            {jobs.map((job) => (
                <JobCard
                    key={job.id}
                    id={job.id}
                    title={job.title}
                    location={job.location ?? "Remote"}
                    salary={formatSalary(job.salary_min, job.salary_max)}
                    type={EMPLOYMENT_LABELS[job.employment_type] ?? job.employment_type}
                    posted={formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                    status={job.status}
                    statusColor={STATUS_COLOR[job.status] ?? "bg-slate-100 text-slate-500"}
                    description={job.description}
                />
            ))}
        </div>
    )
}
