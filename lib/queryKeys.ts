/**
 * TanStack Query keys — used only in CLIENT components (dashboards, interactive UI).
 *
 * Server Components and Server Actions do NOT use these.
 * They fetch directly via `serverFetch` from @/lib/serverFetch.
 */

export const queryKeys = {
    user: ["user"] as const,

    resumes: {
        all: ["resumes"] as const,
        detail: (id: string) => ["resumes", id] as const,
    },

    jobs: {
        all: ["jobs"] as const,
        detail: (id: string) => ["jobs", id] as const,
    },

    profile: ["profile"] as const,

    skillGap: {
        all: ["skillGap"] as const,
        result: (resumeId: string) => ["skillGap", resumeId] as const,
    },
}
