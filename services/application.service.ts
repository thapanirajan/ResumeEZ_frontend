import api from "@/util/api"
import { ApplicationAnalysis } from "@/types/application"

export type ScoreResult = {
    scores: { application_id: string; score: number; analysis: ApplicationAnalysis | null }[]
    external_scores: { external_application_id: string; score: number; analysis: ApplicationAnalysis | null }[]
}

export const applicationApi = {
    /**
     * Calls the AI scoring pipeline for all applicants of a job.
     * Uses axios directly (no Next.js server layer) to avoid the 300s undici timeout.
     * The pipeline can take several minutes depending on the number of applicants.
     */
    scoreApplications: async (jobId: string): Promise<ScoreResult> => {
        const response = await api.get<ScoreResult>(
            `/api/applications/job/${jobId}/ai-scores`,
            { timeout: 10 * 60 * 1000 }, // 10 minutes
        )
        return response.data
    },
}
