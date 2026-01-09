

export const BASE_URL = "http://localhost:8000"

export async function authenticateEmail(email: string) {
    const res = await fetch(`${BASE_URL}/api/user/auth/authenticate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        cache: "no-store",
    })
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to authenticate");
    }

    return res.json()
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
        cache: "no-store",
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Invalid or expired OTP");
    }

    return res.json(); 
}