// types/job.ts

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "CONTRACT" | "REMOTE"
export type JobStatus = "OPEN" | "CLOSED" | "DRAFT"

export type JobResponse = {
    id: string
    recruiter_id: string
    title: string
    description: string
    location: string | null
    employment_type: EmploymentType
    experience_required: number | null
    salary_min: number | null
    salary_max: number | null
    application_deadline: string | null
    status: JobStatus
    created_at: string
    updated_at: string
}

export type JobCreatePayload = {
    title: string
    description: string
    location?: string
    employment_type: EmploymentType
    experience_required?: number
    salary_min?: number
    salary_max?: number
    application_deadline?: string
}

export type JobUpdatePayload = Partial<JobCreatePayload & { status: JobStatus }>
