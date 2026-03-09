export type ApplicationStatus = "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED"

export type ApplicationResponse = {
    id: string
    job_id: string
    candidate_id: string
    candidate_name: string | null
    candidate_email: string | null
    resume_id: string
    resume_title: string | null
    status: ApplicationStatus
    applied_at: string
    updated_at: string
}
