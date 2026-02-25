"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/auth.lib";
import { setAuthReady } from "@/lib/authReady";
import { Lock } from "lucide-react";

export default function AuthCallbackPage() {
    const router = useRouter();
    const [showFallback, setShowFallback] = useState(false);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowFallback(true);
        }, 5000);

        const init = async () => {
            try {
                setAuthReady();
                const me = await getMe();

                // Mask email for trust UX
                if (me?.email) {
                    const [name, domain] = me.email.split("@");
                    const masked =
                        name.slice(0, 2) +
                        "••••" +
                        name.slice(-1) +
                        "@" +
                        domain;
                    setEmail(masked);
                }

                clearTimeout(timeout);

                if (!me.role) {
                    router.replace("/login/select-role");
                } else if (me.role === "JOB_SEEKER") {
                    router.replace("/candidate");
                } else {
                    router.replace("/recruiter");
                }
            } catch {
                clearTimeout(timeout);
                router.replace("/login");
            }
        };

        init();

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F1F3F4] px-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8 text-center transition-opacity duration-300 ease-in opacity-100">

                {/* Google Logo */}
                <img
                    src="/google-logo.svg"
                    alt="Google"
                    className="mx-auto w-10 h-10 mb-4"
                />

                {/* Circular Progress */}
                <div className="flex justify-center mb-4">
                    <div className="w-8 h-8 border-4 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
                </div>

                {/* Status Text */}
                <p className="text-gray-700 text-sm font-medium">
                    Signing you in securely…
                </p>

                {/* Masked Email */}
                {email && (
                    <p className="text-xs text-gray-500 mt-2">{email}</p>
                )}

                {/* Animated Dots */}
                <div className="flex justify-center gap-1 mt-3">
                    <span className="w-1.5 h-1.5 bg-[#1A73E8] rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[#1A73E8] rounded-full animate-bounce delay-150" />
                    <span className="w-1.5 h-1.5 bg-[#1A73E8] rounded-full animate-bounce delay-300" />
                </div>

                {/* Security reassurance */}
                <div className="flex items-center justify-center gap-1 mt-4 text-xs text-gray-400">
                    <Lock size={14} />
                    Protected by Google security
                </div>

                {/* Fallback message */}
                {showFallback && (
                    <p className="text-xs text-gray-400 mt-4">
                        This is taking longer than expected. Please wait…
                    </p>
                )}
            </div>
        </div>
    );
}