"use client"

import { useState } from "react"
import { JobResponse } from "@/types/job"
import { deleteJobAction } from "./actions"
import { toast } from "sonner"
import CreateJobForm from "./CreateJobForm"
import EditJobForm from "./EditJobForm"

const STATUS_BADGE: Record<string, string> = {
    OPEN: "bg-green-100 text-green-700",
    CLOSED: "bg-slate-100 text-slate-500",
    DRAFT: "bg-yellow-100 text-yellow-700",
}

export default function JobPageClient({ jobs }: { jobs: JobResponse[] }) {
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingJob, setEditingJob] = useState<JobResponse | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    async function handleDelete(id: string) {
        setDeletingId(id)
        try {
            await deleteJobAction(id)
            toast.success("Job deleted")
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">My Jobs</h1>
                <button
                    onClick={() => { setShowCreateForm(!showCreateForm); setEditingJob(null) }}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                    <span className="material-icons-round text-sm">
                        {showCreateForm ? "close" : "add"}
                    </span>
                    {showCreateForm ? "Cancel" : "Post a Job"}
                </button>
            </div>

            {/* Create Form */}
            {showCreateForm && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Post a New Job</h2>
                    <CreateJobForm onSuccess={() => setShowCreateForm(false)} />
                </div>
            )}

            {/* Edit Form */}
            {editingJob && (
                <div className="bg-white border border-primary/30 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Edit: {editingJob.title}</h2>
                    <EditJobForm
                        job={editingJob}
                        onSuccess={() => setEditingJob(null)}
                        onCancel={() => setEditingJob(null)}
                    />
                </div>
            )}

            {/* Job List */}
            {jobs.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                    <span className="material-icons-round text-4xl block mb-2">work_off</span>
                    No jobs posted yet. Click &quot;Post a Job&quot; to get started.
                </div>
            ) : (
                <div className="space-y-3">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-slate-800 truncate">{job.title}</h3>
                                    <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded ${STATUS_BADGE[job.status]}`}>
                                        {job.status}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500">
                                    {job.location ?? "Remote"} · {job.employment_type.replace("_", " ")}
                                    {job.salary_min ? ` · $${(job.salary_min / 1000).toFixed(0)}k` : ""}
                                    {job.salary_max ? `–$${(job.salary_max / 1000).toFixed(0)}k` : ""}
                                </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => { setEditingJob(job); setShowCreateForm(false) }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    <span className="material-icons-round text-sm">edit</span>
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(job.id)}
                                    disabled={deletingId === job.id}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                >
                                    <span className="material-icons-round text-sm">delete</span>
                                    {deletingId === job.id ? "..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
