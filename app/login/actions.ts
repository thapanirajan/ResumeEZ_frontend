"use server"

import { authenticateEmail, verifyOtp } from "@/lib/auth.lib"

export async function authenticateEmailAction(email: string) {
    await authenticateEmail(email);
    return { success: true }
}


export async function verifyOtpAction(email: string, otp: string) {
    const result = await verifyOtp(email, otp);
    return result;
}