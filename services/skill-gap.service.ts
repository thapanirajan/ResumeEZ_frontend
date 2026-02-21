import api from "@/util/api";

// ── Response types — mirror the backend Pydantic schemas exactly ──────────────

export type MatchedSkillItem = {
    name: string;
    canonical_id: string;
    match_type: "exact" | "fuzzy";
    confidence: number;      // 0.0 – 1.0
    category: string;
    years: number;           // years of experience found in resume
    weighted_score: number;
};

export type MissingSkillItem = {
    name: string;
    canonical_id: string;
    category: string;
    computed_weight: number;
    priority_score: number;  // higher = more important to learn
    section: "required" | "preferred" | "general";
};

export type ExtraSkillItem = {
    name: string;
    canonical_id: string;
    category: string;
};

export type RoadmapSkillItem = {
    name: string;
    canonical_id: string;
    category: string;
    domain: string | null;
    is_prerequisite: boolean;
    priority_score: number;
    subtopics: string[];
};

export type RoadmapPhases = {
    phase_1_core: RoadmapSkillItem[];      // prerequisites to learn first
    phase_2_primary: RoadmapSkillItem[];   // main missing high-priority skills
    phase_3_advanced: RoadmapSkillItem[];  // lower-priority / optional
};

export type SkillGapResponse = {
    analysis_id: string;
    resume_id: string;
    match_percentage: number;        // 0-100
    total_jd_skills: number;
    hard_skill_match: number | null; // technical skill match %
    soft_skill_match: number | null; // soft skill match %
    matched_skills: MatchedSkillItem[];
    missing_skills: MissingSkillItem[];  // already sorted by priority_score desc
    extra_skills: ExtraSkillItem[];
    gap_report: string;              // deterministic human-readable summary
    roadmap: RoadmapPhases;
    ontology_version: string;
};

// ── API call ──────────────────────────────────────────────────────────────────

export const skillGapApi = {
    analyze: async (
        resume_id: string,
        jd_text: string
    ): Promise<SkillGapResponse> => {
        const response = await api.post<SkillGapResponse>(
            "/api/skill-gap/analyze",
            { resume_id, jd_text }
        );
        return response.data;
    },
};

// ── Session storage helpers ───────────────────────────────────────────────────

const SESSION_KEY = "skillGapResult";

export function saveAnalysisResult(result: SkillGapResponse): void {
    if (typeof window !== "undefined") {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(result));
    }
}

export function loadAnalysisResult(): SkillGapResponse | null {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    try {
        return JSON.parse(stored) as SkillGapResponse;
    } catch {
        return null;
    }
}

export function clearAnalysisResult(): void {
    if (typeof window !== "undefined") {
        sessionStorage.removeItem(SESSION_KEY);
    }
}
