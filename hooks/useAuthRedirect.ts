"use client"

import { useAuth } from "./useAuth"

export function useAuthRedirect() {
    const { user, loading } = useAuth()

    const href = (candidateHref: string, recruiterHref: string, fallback = "/login") => {
        if (loading || !user) return fallback
        return user.role === "JOB_SEEKER" ? candidateHref : recruiterHref
    }

    return { href, user, loading }
}
