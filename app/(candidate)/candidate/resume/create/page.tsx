import { Suspense } from "react";
import ResumeBuilder from "@/components/resume/ResumeBuilder";

export default function CreateResumePage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center text-sm text-slate-500">Loading…</div>}>
            <ResumeBuilder />
        </Suspense>
    );
}
