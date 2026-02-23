"use client"

import { useForm } from "react-hook-form"
import { JobCreatePayload } from "@/types/job"
import { createJobAction } from "./actions"
import { toast } from "sonner"
import { useState } from "react"

type Props = {
    onSuccess?: () => void
}

export default function CreateJobForm({ onSuccess }: Props) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<JobCreatePayload>()
    const [pending, setPending] = useState(false)

    async function onSubmit(data: JobCreatePayload) {
        setPending(true)
        try {
            await createJobAction(data)
            toast.success("Job posted!")
            reset()
            onSuccess?.()
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
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Job Title <span className="text-red-500">*</span>
                </label>
                <input
                    {...register("title", { required: "Title is required", minLength: { value: 3, message: "Min 3 characters" } })}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    {...register("description", { required: "Description is required", minLength: { value: 10, message: "Min 10 characters" } })}
                    rows={4}
                    placeholder="Describe the role, responsibilities, and requirements..."
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
                        placeholder="e.g. Kathmandu, Nepal"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Employment Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register("employment_type", { required: true })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
                    >
                        <option value="">Select type</option>
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="INTERNSHIP">Internship</option>
                        <option value="CONTRACT">Contract</option>
                        <option value="REMOTE">Remote</option>
                    </select>
                </div>
            </div>

            {/* Salary Range + Experience */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Min Salary ($)</label>
                    <input
                        {...register("salary_min", { valueAsNumber: true, min: { value: 0, message: "Must be ≥ 0" } })}
                        type="number"
                        placeholder="e.g. 60000"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Salary ($)</label>
                    <input
                        {...register("salary_max", { valueAsNumber: true, min: { value: 0, message: "Must be ≥ 0" } })}
                        type="number"
                        placeholder="e.g. 90000"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Experience (yrs)</label>
                    <input
                        {...register("experience_required", { valueAsNumber: true, min: { value: 0, message: "Must be ≥ 0" } })}
                        type="number"
                        placeholder="e.g. 2"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>
            </div>

            {/* Application Deadline */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Application Deadline</label>
                <input
                    {...register("application_deadline")}
                    type="date"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
            </div>

            <button
                type="submit"
                disabled={pending}
                className="w-full bg-primary text-white py-2.5 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
                {pending ? "Posting..." : "Post Job"}
            </button>
        </form>
    )
}
