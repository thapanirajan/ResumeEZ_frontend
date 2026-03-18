import RecruiterDashboard from "./RecruiterDashboardClient"
import { getDashboardDataAction } from "./actions"
import { RecruiterDashboardData } from "@/types/recruiter_dashboard"

export default async function RecruiterDashboardPage() {
    let data: RecruiterDashboardData | null = null
    let error: string | null = null
    try {
        data = await getDashboardDataAction()
    } catch (e) {
        error = e instanceof Error ? e.message : "Failed to load dashboard data"
        console.error("[RecruiterDashboardPage]", error)
    }

    return <RecruiterDashboard data={data} error={error} />
}
