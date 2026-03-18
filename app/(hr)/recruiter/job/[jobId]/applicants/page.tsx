import {
    getJobDetailsAction,
    getJobApplicationsAction,
    getExternalApplicationsAction,
} from "../../actions"
import ApplicantsPageClient from "./ApplicantsPageClient"

interface Props {
    params: Promise<{ jobId: string }>
}

export default async function ApplicantsPage({ params }: Props) {
    const { jobId } = await params

    const [job, applications, externalApplications] = await Promise.all([
        getJobDetailsAction(jobId).catch(() => null),
        getJobApplicationsAction(jobId).catch(() => []),
        getExternalApplicationsAction(jobId).catch(() => []),
    ])

    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Job not found or failed to load.
            </div>
        )
    }

    return (
        <ApplicantsPageClient
            job={job}
            initialApplications={applications}
            initialExternalApplications={externalApplications}
        />
    )
}
