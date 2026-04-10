"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * This page has been consolidated into the upload page (History tab).
 * Redirect any existing links to the new location.
 */
export default function SkillGapHistoryRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/candidate/upload");
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="flex items-center gap-3 text-sm text-slate-500">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#1e3a8a]" />
                Redirecting…
            </div>
        </div>
    );
}
