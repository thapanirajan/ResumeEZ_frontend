"use server"

import { authenticateEmail, setUserRole, UserRole, verifyOtp } from "@/lib/auth.lib"

export async function authenticateEmailAction(email: string) {
    await authenticateEmail(email);
    return { success: true }
}



