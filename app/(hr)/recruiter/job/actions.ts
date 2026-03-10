"use server"

import { serverFetch } from "@/lib/serverFetch"
import { revalidatePath } from "next/cache"
import { JobCreatePayload, JobResponse, JobUpdatePayload } from "@/types/job"
import { ApplicationResponse, ApplicationStatus } from "@/types/application"
import { cookies } from "next/headers"

export type ExternalApplicationSource = "EMAIL" | "LINKEDIN" | "REFERRAL" | "OFFLINE" | "OTHER"
export type ExternalApplicationStatus = "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED"

export interface ExternalApplicationResponse {
    id: string
    job_id: string
    candidate_name: string
    candidate_email: string | null
    source: ExternalApplicationSource
    resume_file_url: string
    resume_filename: string
    status: ExternalApplicationStatus
    notes: string | null
    uploaded_at: string
    updated_at: string
}

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
): Promise<{
    scores: { application_id: string; score: number }[]
    external_scores: { external_application_id: string; score: number }[]
}> {
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

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000"

export async function uploadExternalResumeAction(
    jobId: string,
    formData: FormData,
): Promise<ExternalApplicationResponse> {
    const cookieStore = await cookies()
    const res = await fetch(`${BACKEND_URL}/api/applications/job/${jobId}/external`, {
        method: "POST",
        headers: {
            Cookie: cookieStore.toString(),
        },
        body: formData,
        cache: "no-store",
    })
    if (!res.ok) {
        const raw = await res.text()
        let message = `Upload failed (${res.status})`
        try {
            const parsed = JSON.parse(raw)
            if (parsed?.detail) message = typeof parsed.detail === "string" ? parsed.detail : message
            else if (parsed?.message) message = parsed.message
        } catch { /* ignore */ }
        throw new Error(message)
    }
    return res.json() as Promise<ExternalApplicationResponse>
}

export async function getExternalApplicationsAction(
    jobId: string,
): Promise<ExternalApplicationResponse[]> {
    return serverFetch<ExternalApplicationResponse[]>(`/api/applications/job/${jobId}/external`)
}

export async function updateExternalApplicationStatusAction(
    externalId: string,
    status: ExternalApplicationStatus,
): Promise<ExternalApplicationResponse> {
    return serverFetch<ExternalApplicationResponse>(`/api/applications/external/${externalId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    })
}

export interface BulkUploadResultItem {
    filename: string
    success: boolean
    data: ExternalApplicationResponse | null
    error: string | null
}

export interface BulkUploadResponse {
    results: BulkUploadResultItem[]
    uploaded_count: number
    failed_count: number
}

export async function bulkUploadExternalResumesAction(
    jobId: string,
    formData: FormData,
): Promise<BulkUploadResponse> {
    const cookieStore = await cookies()
    const res = await fetch(`${BACKEND_URL}/api/applications/job/${jobId}/external/bulk`, {
        method: "POST",
        headers: {
            Cookie: cookieStore.toString(),
        },
        body: formData,
        cache: "no-store",
    })
    if (!res.ok) {
        const raw = await res.text()
        let message = `Bulk upload failed (${res.status})`
        try {
            const parsed = JSON.parse(raw)
            if (parsed?.detail) message = typeof parsed.detail === "string" ? parsed.detail : message
            else if (parsed?.message) message = parsed.message
        } catch { /* ignore */ }
        throw new Error(message)
    }
    return res.json() as Promise<BulkUploadResponse>
}
