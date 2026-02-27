"use client"

import { useState } from "react"
import {
    Plus,
    X,
    Pencil,
    Trash2,
    Briefcase,
    MapPin,
    DollarSign,
    Clock,
    Calendar,
    ChevronRight,
    Loader2,
} from "lucide-react"
import { JobResponse } from "@/types/job"
import { deleteJobAction } from "./actions"
import { toast } from "sonner"
import CreateJobForm from "./CreateJobForm"
import EditJobForm from "./EditJobForm"

const STATUS_BADGE: Record<string, { className: string; dot: string; label: string }> = {
    OPEN: {
        className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        dot: "bg-emerald-500",
        label: "Open",
    },
    CLOSED: {
        className: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
        dot: "bg-slate-400",
        label: "Closed",
    },
    DRAFT: {
        className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        dot: "bg-amber-400",
        label: "Draft",
    },
}

const EMPLOYMENT_LABELS: Record<string, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    INTERNSHIP: "Internship",
    CONTRACT: "Contract",
    REMOTE: "Remote",
}

function formatSalary(min: number | null, max: number | null): string | null {
    if (!min && !max) return null
    if (min && max) return `$${(min / 1000).toFixed(0)}k – $${(max / 1000).toFixed(0)}k`
    if (min) return `From $${(min / 1000).toFixed(0)}k`
    return `Up to $${(max! / 1000).toFixed(0)}k`
}

function formatDeadline(deadline: string | null): string | null {
    if (!deadline) return null
    return new Date(deadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

export default function JobPageClient({ jobs }: { jobs: JobResponse[] }) {
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingJob, setEditingJob] = useState<JobResponse | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    async function handleDelete(id: string) {
        setDeletingId(id)
        try {
            await deleteJobAction(id)
            toast.success("Job deleted successfully")
        } catch (e: any) {
            toast.error(e.message ?? "Failed to delete job")
        } finally {
            setDeletingId(null)
        }
    }

    function openCreate() {
        setShowCreateForm(true)
        setEditingJob(null)
    }

    function openEdit(job: JobResponse) {
        setEditingJob(job)
        setShowCreateForm(false)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Jobs</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        {jobs.length} posting{jobs.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    onClick={() => (showCreateForm ? setShowCreateForm(false) : openCreate())}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${showCreateForm
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-primary text-white hover:bg-primary/90"
                        }`}
                >
                    {showCreateForm ? (
                        <>
                            <X className="w-4 h-4" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4" />
                            Post a Job
                        </>
                    )}
                </button>
            </div>

            {/* Create Form */}
            {showCreateForm && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Plus className="w-4 h-4 text-primary" />
                        </div>
                        <h2 className="text-base font-bold text-slate-800">Post a New Job</h2>
                    </div>
                    <CreateJobForm onSuccess={() => setShowCreateForm(false)} />
                </div>
            )}

            {/* Edit Form */}
            {editingJob && (
                <div className="bg-white border border-primary/20 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Pencil className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-800">Edit Job</h2>
                                <p className="text-xs text-slate-500 truncate max-w-xs">{editingJob.title}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setEditingJob(null)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <EditJobForm
                        job={editingJob}
                        onSuccess={() => setEditingJob(null)}
                        onCancel={() => setEditingJob(null)}
                    />
                </div>
            )}

            {/* Job List */}
            {jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 gap-3 text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-700">No jobs posted yet</p>
                        <p className="text-sm text-slate-400 mt-0.5">
                            Click &quot;Post a Job&quot; to get started.
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Post your first job
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {jobs.map((job) => {
                        const badge = STATUS_BADGE[job.status] ?? STATUS_BADGE.DRAFT
                        const salary = formatSalary(job.salary_min, job.salary_max)
                        const deadline = formatDeadline(job.application_deadline)
                        const isDeleting = deletingId === job.id

                        return (
                            <div
                                key={job.id}
                                className={`bg-white border rounded-2xl p-5 transition-all hover:shadow-md ${editingJob?.id === job.id
                                    ? "border-primary/30 shadow-sm"
                                    : "border-slate-200"
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                                        <Briefcase className="w-5 h-5 text-slate-500" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        {/* Title + Status */}
                                        <div className="flex items-center gap-2 flex-wrap mb-2">
                                            <h3 className="font-bold text-slate-900 truncate">
                                                {job.title}
                                            </h3>
                                            <span
                                                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${badge.className}`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                                {badge.label}
                                            </span>
                                        </div>

                                        {/* Meta */}
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                {job.location ?? "Remote"}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                {EMPLOYMENT_LABELS[job.employment_type] ?? job.employment_type}
                                            </span>
                                            {salary && (
                                                <span className="flex items-center gap-1.5">
                                                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                                                    {salary}
                                                </span>
                                            )}
                                            {job.experience_required != null && (
                                                <span className="flex items-center gap-1.5">
                                                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                                    {job.experience_required}+ yrs exp
                                                </span>
                                            )}
                                            {deadline && (
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    Due {deadline}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => openEdit(job)}
                                            disabled={isDeleting}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-40"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(job.id)}
                                            disabled={isDeleting}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                        >
                                            {isDeleting ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-3.5 h-3.5" />
                                            )}
                                            {isDeleting ? "Deleting…" : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
