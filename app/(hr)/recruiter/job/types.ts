export type JobStatus = "DRAFT" | "ACTIVE" | "CLOSED";
export type JDType = "TEXT" | "FILE";

export type Job = {
    id: string;
    title: string;
    status: JobStatus;
    jdType: JDType;
    jdText?: string;
    jdFileName?: string;
    resumeCount: number;
    createdAt: string;
};
