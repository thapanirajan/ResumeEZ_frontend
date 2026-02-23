"use client"

import { useForm } from "react-hook-form"
import { JobResponse, JobUpdatePayload } from "@/types/job"
import { updateJobAction } from "./actions"
import { toast } from "sonner"
import { useState } from "react"

type Props = {
    job: JobResponse
    onSuccess: () => void
    onCancel: () => void
}

export default function EditJobForm({ job, onSuccess, onCancel }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<JobUpdatePayload>({
        defaultValues: {
            title: job.title,
            description: job.description,
            location: job.location ?? "",
            employment_type: job.employment_type,
            experience_required: job.experience_required ?? undefined,
            salary_min: job.salary_min ?? undefined,
            salary_max: job.salary_max ?? undefined,
            application_deadline: job.application_deadline
                ? new Date(job.application_deadline).toISOString().split("T")[0]
                : undefined,
            status: job.status,
        },
    })
    const [pending, setPending] = useState(false)

    async function onSubmit(data: JobUpdatePayload) {
        setPending(true)
        try {
            await updateJobAction(job.id, data)
            toast.success("Job updated!")
            onSuccess()
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setPending(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                <input
                    {...register("title", { minLength: { value: 3, message: "Min 3 characters" } })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                    {...register("description", { minLength: { value: 10, message: "Min 10 characters" } })}
                    rows={4}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
            </div>

            {/* Location + Employment Type */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <input
                        {...register("location")}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
                    <select
                        {...register("employment_type")}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
                    >
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="INTERNSHIP">Internship</option>
                        <option value="CONTRACT">Contract</option>
                        <option value="REMOTE">Remote</option>
                    </select>
                </div>
            </div>

            {/* Salary + Experience */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Min Salary ($)</label>
                    <input
                        {...register("salary_min", { valueAsNumber: true, min: 0 })}
                        type="number"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Salary ($)</label>
                    <input
                        {...register("salary_max", { valueAsNumber: true, min: 0 })}
                        type="number"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Experience (yrs)</label>
                    <input
                        {...register("experience_required", { valueAsNumber: true, min: 0 })}
                        type="number"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>
            </div>

            {/* Deadline + Status */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Application Deadline</label>
                    <input
                        {...register("application_deadline")}
                        type="date"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select
                        {...register("status")}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
                    >
                        <option value="OPEN">Open</option>
                        <option value="CLOSED">Closed</option>
                        <option value="DRAFT">Draft</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={pending}
                    className="flex-1 bg-primary text-white py-2.5 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                    {pending ? "Saving..." : "Save Changes"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
