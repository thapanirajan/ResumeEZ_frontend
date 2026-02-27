"use server"

import { serverFetch } from "@/lib/serverFetch"
import { revalidatePath } from "next/cache"
import { JobCreatePayload, JobResponse, JobUpdatePayload } from "@/types/job"

export async function createJobAction(payload: JobCreatePayload) {
    const job = await serverFetch<JobResponse>("/api/jobs/", {
        method: "POST",
        body: JSON.stringify(payload),
    })
    revalidatePath("/recruiter/job")
    return job
}

export async function updateJobAction(id: string, payload: JobUpdatePayload) {
    const job = await serverFetch<JobResponse>(`/api/jobs/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    })
    revalidatePath("/recruiter/job")
    return job
}

export async function deleteJobAction(id: string) {
    await serverFetch(`/api/jobs/${id}`, { method: "DELETE" })
    revalidatePath("/recruiter/job")
}
