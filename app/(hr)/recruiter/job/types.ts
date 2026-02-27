export enum EmploymentType {
    FULL_TIME = "FULL_TIME",
    PART_TIME = "PART_TIME",
    INTERNSHIP = "INTERNSHIP",
    CONTRACT = "CONTRACT",
    REMOTE = "REMOTE",
}

export enum JobStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    DRAFT = "DRAFT",
}

export interface Job {
    id: string;
    recruiter_id: string;
    title: string;
    description: string;
    location?: string | null;
    employment_type: EmploymentType;
    experience_required?: number | null;
    salary_min?: number | null;
    salary_max?: number | null;
    application_deadline?: string | null;
    status: JobStatus;
    created_at: string;
    updated_at: string;
}