import api from "@/util/api";
import { ResumeData } from "@/app/(candidate)/candidate/resume/type";

export type ResumeResponse = {
    id: string;
    candidate_id: string;
    title: string;
    resume_data: ResumeData;
    created_at: string;
    updated_at: string | null;
};

export const resumeApi = {
    createResume: async (title: string, resume_data: ResumeData) => {
        const response = await api.post<ResumeResponse>("/api/resume", {
            title,
            resume_data,
        });
        return response.data;
    },

    getResumes: async () => {
        const response = await api.get<ResumeResponse[]>("/api/resume");
        return response.data;
    },

    getResumeById: async (id: string) => {
        const response = await api.get<ResumeResponse>(`/api/resume/${id}`);
        return response.data;
    },

    updateResume: async (id: string, payload: { title?: string; resume_data?: ResumeData }) => {
        const response = await api.patch<{ success: boolean; message: string }>(`/api/resume/${id}`, payload);
        return response.data;
    },

    deleteResume: async (id: string) => {
        const response = await api.delete<{ success: boolean; message: string }>(`/api/resume/${id}`);
        return response.data;
    },
};
