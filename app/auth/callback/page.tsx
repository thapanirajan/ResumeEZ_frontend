"use client";

import { useEffect } from "react";
import { useRouter} from "next/navigation";
import { getMe } from "@/lib/auth.lib";
import { setAuthReady } from "@/lib/authReady";

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            try {

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
