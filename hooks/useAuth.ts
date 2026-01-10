"use client"

import { getMe } from "@/lib/auth.lib";
import { useEffect, useState } from "react"

export type User = {
    id: string;
    email: string;
    role: "JOB_SEEKER" | "RECRUITER"
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const me = await getMe();
                setUser(me);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    return { user, loading }
}