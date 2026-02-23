"use client"

import { useQuery } from "@tanstack/react-query"
import { getMe } from "@/lib/auth.lib"
import { queryKeys } from "@/lib/queryKeys"

export type User = {
    id: string;
    email: string;
    role: "JOB_SEEKER" | "RECRUITER"
}

export function useAuth() {
    const { data: user, isLoading: loading } = useQuery<User | null>({
        queryKey: queryKeys.user,
        queryFn: getMe,
        retry: false,
    })

    return { user: user ?? null, loading }
}
