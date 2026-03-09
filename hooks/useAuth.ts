"use client"

import { useEffect, useState } from "react"
import { getMe } from "@/lib/auth.lib"

export type User = {
    id: string;
    email: string;
    role: "JOB_SEEKER" | "RECRUITER"
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMe()
            .then((data) => setUser(data ?? null))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    return { user, loading }
}
