"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/auth.lib";
import { isAuthReady } from "@/lib/authReady";

export function useRequireRole(requiredRole: "RECRUITER" | "JOB_SEEKER") {
    const router = useRouter();

    useEffect(() => {
        async function checkRole() {
            if (!isAuthReady()) {
                return;
            }
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
