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

// ── AI Analysis Types ────────────────────────────────────────────────────────

export type MatchType = "exact" | "fuzzy" | "semantic"
export type SkillSection = "required" | "preferred" | "general"

export type MatchedSkillItem = {
    name: string
    canonical_id: string
    match_type: MatchType
    confidence: number
    category: string
    years: number
    weighted_score: number
}

export type MissingSkillItem = {
    name: string
    canonical_id: string
    category: string
    computed_weight: number
    priority_score: number
    section: SkillSection
}

export type ExtraSkillItem = {
    name: string
    canonical_id: string
    category: string
}

export type ApplicationAnalysis = {
    ats_score: number
    skills_score: number
    experience_score: number
    education_score: number
    matched_skills: MatchedSkillItem[]
    missing_skills: MissingSkillItem[]
    extra_skills: ExtraSkillItem[]
    gap_report: string
    reasoning: string
}
