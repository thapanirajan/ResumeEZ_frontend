"use server"

import { authenticateEmail, setUserRole, UserRole, verifyOtp } from "@/lib/auth.lib"

export async function authenticateEmailAction(email: string) {
    try {
        await authenticateEmail(email);
        return { success: true }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to send login code";
        return { success: false, error: message }
    }
}



