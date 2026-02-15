

export const BASE_URL = "http://localhost:8000"
export type UserRole = "JOB_SEEKER" | "RECRUITER";

export type CandidateProfile = {
    username: string | null;
    full_name: string | null;
    current_role: string | null;
    experience_years: number | null;
};

export type RecruiterProfile = {
    username: string | null;
    full_name: string | null;
};

export type UserProfileData = {
    id: string;
    email: string;
    role: UserRole | null;
    candidate_profile: CandidateProfile | null;
    recruiter_profile: RecruiterProfile | null;
};

export type UserProfilePayload = {
    username?: string;
    full_name?: string;
    current_role?: string;
    experience_years?: number | null;
};

type ApiErrorShape = {
    message?: string;
    detail?: string | { message?: string } | Array<{ msg?: string }>;
    error?: string;
};

function parseApiErrorMessage(raw: string, fallback: string): string {
    if (!raw) return fallback;

    try {
        const parsed = JSON.parse(raw) as ApiErrorShape;

        if (typeof parsed.message === "string" && parsed.message.trim()) {
            return parsed.message;
        }

        if (typeof parsed.detail === "string" && parsed.detail.trim()) {
            return parsed.detail;
        }

        if (
            parsed.detail &&
            typeof parsed.detail === "object" &&
            !Array.isArray(parsed.detail) &&
            typeof parsed.detail.message === "string" &&
            parsed.detail.message.trim()
        ) {
            return parsed.detail.message;
        }

        if (Array.isArray(parsed.detail)) {
            const combined = parsed.detail
                .map((item) => item?.msg)
                .filter((msg): msg is string => typeof msg === "string" && msg.trim().length > 0)
                .join(", ");
            if (combined) return combined;
        }

        if (typeof parsed.error === "string" && parsed.error.trim()) {
            return parsed.error;
        }
    } catch {
        if (raw.trim()) return raw.trim();
    }

    return fallback;
}

async function throwApiError(res: Response, fallback: string): Promise<never> {
    const raw = await res.text();
    const message = parseApiErrorMessage(raw, fallback);
    throw new Error(message);
}

export async function authenticateEmail(email: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000)
    try {
        const res = await fetch(`${BASE_URL}/api/user/auth/authenticate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
            cache: "no-store",
        })
        if (!res.ok) {
            let message = "Failed to authenticate";
            try {

                const data = await res.json();
                message = data.message ?? message
            } catch { }
            throw new Error(message)
        }

        return res.json()
    } finally {
        clearTimeout(timeout)
    }

}

export async function verifyOtp(email: string, otp: string) {
    const res = await fetch(`${BASE_URL}/api/user/auth/verify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            otp_code: otp,
        }),
        credentials: "include"
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Invalid or expired OTP");
    }

    return res.json();
}

export async function setUserRole(role: UserRole) {
    const res = await fetch(`${BASE_URL}/api/user/auth/set-role`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            role,
        }),
        credentials: "include",

    });


    if (!res.ok) {
        let message = "Failed to set role";

        if (res.statusText.includes("Unauthorized")) {
            message = "Unauthorized"
        }

        try {
            const data = await res.json();
            message = data.message ?? message;
        } catch {
            // 
        }

        throw new Error(message);
    }

    return res.json();
}

export async function getMe() {

    const res = await fetch(`${BASE_URL}/api/user/me`, {
        credentials: "include",
    });

    if (!res.ok) {
        await throwApiError(res, "Not authenticated");
    }

    return res.json();
}

export async function getProfile(): Promise<UserProfileData> {
    const res = await fetch(`${BASE_URL}/api/user/profile`, {
        credentials: "include",
        cache: "no-store",
    });

    if (!res.ok) {
        await throwApiError(res, "Failed to fetch profile");
    }

    const result = await res.json();
    return result.data as UserProfileData;
}

export async function updateProfile(payload: UserProfilePayload): Promise<UserProfileData> {
    const res = await fetch(`${BASE_URL}/api/user/profile`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        await throwApiError(res, "Failed to update profile");
    }

    const result = await res.json();
    return result.data as UserProfileData;
}

export async function handleLogout() {
    await fetch(`${BASE_URL}/api/user/logout`, {
        method: "POST",
        credentials: "include"
    })
    window.location.href = "/login";
}
