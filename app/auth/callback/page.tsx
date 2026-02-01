"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getMe } from "@/lib/auth.lib";
import { setAccessToken } from "@/lib/authtoken";
import { setAuthReady } from "@/lib/authReady";

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();


    useEffect(() => {
        const init = async () => {
            try {
                const token = searchParams.get("token");

                if (token) {
                    setAccessToken(token);
                }

                setAuthReady(); 

                const me = await getMe();

                if (!me.role) {
                    router.replace("/login/select-role");
                } else if (me.role === "JOB_SEEKER") {
                    router.replace("/candidate");
                } else {
                    router.replace("/recruiter");
                }
            } catch {
                router.replace("/login");
            }
        };

        init();
    }, []);

    return <p className="text-center mt-10">Signing you in...</p>;
}
