export type ApplicationStatusValue = "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED"
export type JobStatusValue = "OPEN" | "CLOSED" | "DRAFT"
export type ApplicationSourceValue =
    | "PLATFORM"
    | "EMAIL"
    | "LINKEDIN"
    | "REFERRAL"
    | "OFFLINE"
    | "OTHER"

export type DashboardSummary = {
    total_jobs: number
    total_applications: number
    accepted_count: number
    pending_count: number
}

export type ApplicationStatusItem = {
    status: ApplicationStatusValue
    count: number
}

export type TopJobItem = {
    job_id: string
    title: string
    application_count: number
    accepted_count: number
}

export type MonthlyApplicationItem = {
    month: string // e.g. "Jan 2026"
    count: number
}

export type JobStatusItem = {
    status: JobStatusValue
    count: number
}

export type ApplicationSourceItem = {
    source: ApplicationSourceValue
    count: number
}

export type RecruiterDashboardData = {
    summary: DashboardSummary
    application_status_breakdown: ApplicationStatusItem[]
    top_jobs_by_applications: TopJobItem[]
    applications_over_time: MonthlyApplicationItem[]
    job_status_distribution: JobStatusItem[]
    application_source_breakdown: ApplicationSourceItem[]
}
