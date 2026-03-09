"use server"

import { serverFetch } from "@/lib/serverFetch"
import { revalidatePath } from "next/cache"
import { JobCreatePayload, JobResponse, JobUpdatePayload } from "@/types/job"
import { ApplicationResponse, ApplicationStatus } from "@/types/application"

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

export async function getJobApplicationsAction(jobId: string): Promise<ApplicationResponse[]> {
    return serverFetch<ApplicationResponse[]>(`/api/applications/job/${jobId}`)
}

export async function scoreJobApplicationsAction(
    jobId: string,
): Promise<{ scores: { application_id: string; score: number }[] }> {
    return serverFetch(`/api/applications/job/${jobId}/ai-scores`)
}

export async function getApplicationResumeAction(
    applicationId: string,
): Promise<{ resume_id: string; resume_title: string | null; resume_data: unknown }> {
    return serverFetch(`/api/applications/${applicationId}/resume`)
}

export async function updateApplicationStatusAction(
    applicationId: string,
    status: ApplicationStatus,
): Promise<void> {
    await serverFetch(`/api/applications/${applicationId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    })
}
