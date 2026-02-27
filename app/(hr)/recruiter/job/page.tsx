import { serverFetch } from "@/lib/serverFetch";
import { JobResponse } from "@/types/job";
import JobPageCient from "./JobPageClient";


export default async function RecruiterJobPage() {
    let jobs: JobResponse[] = []
    try {
        jobs = await serverFetch<JobResponse[]>("/api/jobs/recruiter/me")
        console.log("-------------JOBS--------------")
        console.log(jobs)
    } catch (e) {
        console.error("[RecruiterJobPage] failed to fetch jobs:", e)
    }

    return <JobPageCient jobs={jobs} />
}