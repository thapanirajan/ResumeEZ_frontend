'use client';

import { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { Job } from "./types";
import JobModal from "@/components/Recruiter/JobModal";
import JobTable from "@/components/Recruiter/JobTable";
import JobFilters from "@/components/Recruiter/JobFilters";


const MOCK_JOBS: Job[] = [
    {
        id: uuid(),
        title: "Frontend Developer",
        status: "ACTIVE",
        jdType: "TEXT",
        jdText: "React, Next.js, Tailwind",
        resumeCount: 12,
        createdAt: "2026-01-08",
    },
    {
        id: uuid(),
        title: "Data Analyst",
        status: "DRAFT",
        jdType: "FILE",
        jdFileName: "data_analyst_jd.pdf",
        resumeCount: 0,
        createdAt: "2026-01-06",
    },
];

export default function JobPageClient() {
    const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
    const [modal, setModal] = useState<null | "create" | "view" | "edit" | "delete">(null);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [jdFilter, setJdFilter] = useState("");

    /* ───────────── FILTER LOGIC ───────────── */

    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            return (
                job.title.toLowerCase().includes(search.toLowerCase()) &&
                (statusFilter ? job.status === statusFilter : true) &&
                (jdFilter ? job.jdType === jdFilter : true)
            );
        });
    }, [jobs, search, statusFilter, jdFilter]);

    /* ───────────── CRUD (MOCK) ───────────── */

    function createJob(data: Partial<Job>) {
        setJobs((prev) => [
            {
                id: uuid(),
                title: data.title!,
                status: data.status!,
                jdType: data.jdType!,
                jdText: data.jdText,
                jdFileName: data.jdFileName,
                resumeCount: 0,
                createdAt: new Date().toISOString().split("T")[0],
            },
            ...prev,
        ]);
        closeModal();
    }

    function updateJob(id: string, data: Partial<Job>) {
        setJobs((prev) =>
            prev.map((job) =>
                job.id === id ? { ...job, ...data } : job
            )
        );
        closeModal();
    }

    function deleteJob(id: string) {
        setJobs((prev) => prev.filter((job) => job.id !== id));
        closeModal();
    }

    function openModal(type: any, job?: Job) {
        setSelectedJob(job || null);
        setModal(type);
    }

    function closeModal() {
        setSelectedJob(null);
        setModal(null);
    }

    /* ───────────── UI ───────────── */

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Job Management</h1>
                    <p className="text-sm text-gray-500">
                        Create and manage job postings
                    </p>
                </div>
                <button
                    onClick={() => openModal("create")}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    + Create Job
                </button>
            </div>

            <JobFilters
                search={search}
                setSearch={setSearch}
                status={statusFilter}
                setStatus={setStatusFilter}
                jdType={jdFilter}
                setJdType={setJdFilter}
            />

            <JobTable
                jobs={filteredJobs}
                onView={(job) => openModal("view", job)}
                onEdit={(job) => openModal("edit", job)}
                onDelete={(job) => openModal("delete", job)}
            />

            {modal && (
                <JobModal
                    type={modal}
                    job={selectedJob}
                    onClose={closeModal}
                    onCreate={createJob}
                    onUpdate={updateJob}
                    onDelete={deleteJob}
                />
            )}
        </div>
    );
}
