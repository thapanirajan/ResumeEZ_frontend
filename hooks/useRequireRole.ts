"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/auth.lib";

export function useRequireRole(requiredRole: "RECRUITER" | "JOB_SEEKER") {
    const router = useRouter();

    useEffect(() => {
        async function checkRole() {
            try {
                const me = await getMe();

                if (me.role !== requiredRole) {
                    router.replace(
                        requiredRole === "RECRUITER" ? "/candidate" : "/recruiter"
                    );
                }
            } catch {
                router.replace("/login");
            }
        }

        checkRole();
    }, [requiredRole, router]);
}
