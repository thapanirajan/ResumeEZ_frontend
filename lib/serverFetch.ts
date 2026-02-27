/**
 * Server-side fetch utility for Server Components and Server Actions.
 *
 * Reads the HTTP-only auth cookie from `next/headers` and forwards it
 * on every request — no token handling needed in component code.
 *
 * Usage in a Server Component:
 *   const resumes = await serverFetch<ResumeResponse[]>("/api/resume")
 *
 * Usage in a Server Action:
 *   await serverFetch(`/api/resume/${id}`, { method: "DELETE" })
 */

import { cookies } from "next/headers"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000"

type ApiErrorShape = {
    message?: string
    detail?: string | { message?: string } | Array<{ msg?: string }>
    error?: string | { message?: string; code?: string }
}

function parseErrorMessage(raw: string, fallback: string): string {
    try {
        const parsed = JSON.parse(raw) as ApiErrorShape

        if (typeof parsed.message === "string" && parsed.message.trim()) return parsed.message

        if (typeof parsed.detail === "string" && parsed.detail.trim()) return parsed.detail
        if (parsed.detail && typeof parsed.detail === "object" && !Array.isArray(parsed.detail)) {
            const msg = (parsed.detail as { message?: string }).message
            if (typeof msg === "string" && msg.trim()) return msg
        }
        if (Array.isArray(parsed.detail)) {
            const combined = parsed.detail
                .map((item) => item?.msg)
                .filter((m): m is string => typeof m === "string" && m.trim().length > 0)
                .join(", ")
            if (combined) return combined
        }

        if (parsed.error && typeof parsed.error === "object" && typeof parsed.error.message === "string") {
            return parsed.error.message.trim() || fallback
        }

        if (typeof parsed.error === "string" && parsed.error.trim()) return parsed.error
    } catch {
        if (raw.trim()) return raw.trim()
    }
    return fallback
}

/**
 * Returns the current authenticated user from the server, or null if not logged in.
 */
export async function getServerUser(): Promise<{ id: string; email: string; role: string } | null> {
    try {
        return await serverFetch("/api/user/me")
    } catch {
        return null
    }
}

export async function serverFetch<T = unknown>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const cookieStore = await cookies()

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString(),
            ...options?.headers,
        },
        cache: "no-store",
    })

    if (!res.ok) {
        const raw = await res.text()
        throw new Error(parseErrorMessage(raw, `Request failed (${res.status})`))
    }

    return res.json() as Promise<T>
}
