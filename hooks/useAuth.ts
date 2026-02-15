"use client"

import { getMe } from "@/lib/auth.lib";
import { useEffect, useState } from "react"

export type User = {
    id: string;
    email: string;
    role: "JOB_SEEKER" | "RECRUITER"
}

let cachedUser: User | null | undefined = undefined;
let inFlightRequest: Promise<User | null> | null = null;

async function fetchUserOnce(): Promise<User | null> {
    if (cachedUser !== undefined) return cachedUser;
    if (inFlightRequest) return inFlightRequest;

    inFlightRequest = (async () => {
        try {
            const me = await getMe();
            cachedUser = me;
            return me;
        } catch {
            cachedUser = null;
            return null;
        } finally {
            inFlightRequest = null;
        }
    })();

    return inFlightRequest;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(
        cachedUser === undefined ? null : cachedUser
    );
    const [loading, setLoading] = useState(cachedUser === undefined);

    useEffect(() => {
        let isMounted = true;

        async function loadUser() {
            const me = await fetchUserOnce();
            if (isMounted) {
                setUser(me);
                setLoading(false);
            }
        }

        loadUser();

        return () => {
            isMounted = false;
        };
    }, []);

    return { user, loading }
}
