"use server"

import { serverFetch } from "@/lib/serverFetch"
import { RecruiterDashboardData } from "@/types/recruiter_dashboard"

export async function getDashboardDataAction(): Promise<RecruiterDashboardData> {
    return serverFetch<RecruiterDashboardData>("/api/recruiter/dashboard")
}
