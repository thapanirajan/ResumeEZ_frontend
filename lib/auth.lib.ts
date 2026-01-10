

export const BASE_URL = "http://localhost:8000"
export type UserRole = "JOB_SEEKER" | "RECRUITER";

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
            otp,
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
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            role,
        }),
        credentials: "include"
    });

    console.log(res)

    // backend may return non-JSON on crash
    if (!res.ok) {
        let message = "Failed to set role";

        if (res.statusText.includes("Unauthorized")) {
            message = "Unauthorized"
        }

        try {
            const data = await res.json();
            message = data.message ?? message;
        } catch {
            // response was not JSON
        }

        throw new Error(message);
    }

    return res.json();
}

export async function getMe() {
    const res = await fetch(`${BASE_URL}/api/user/me`, {
        credentials: "include",
        cache: "no-store"
    })

    if (!res.ok) {
        throw new Error("Not authenticated")
    }

    return res.json()
}

export async function handleLogout() {
    await fetch(`${BASE_URL}/api/user/logout`, {
        method: "POST",
        credentials: "include"
    })
    window.location.href = "/login";
}