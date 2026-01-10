"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/landing/Logo";
import toast from "react-hot-toast";
import { setUserRole } from "@/lib/auth.lib";

export default function SelectRolePage() {
    const [role, setRole] = useState<"JOB_SEEKER" | "RECRUITER">("JOB_SEEKER");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const loadingToast = toast.loading("Setting up your account...");

        try {
            await setUserRole(role);

            toast.success("Role selected successfully", {
                id: loadingToast,
            });

            if (role === "JOB_SEEKER") {
                router.push("/candidate");
            } else {
                router.push("/recruiter");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to set role", {
                id: loadingToast,
            });
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-[#E5E7EB]">
                <div className="flex justify-center mb-6 cursor-pointer" onClick={() => router.push("/")}>
                    <Logo />
                </div>

                <h1 className="text-2xl font-bold text-[#0F172A] text-center mb-4">
                    Select Your Role
                </h1>
                <p className="text-sm text-[#475569] text-center mb-6">
                    Choose your role to personalize your experience.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-sm font-semibold text-[#0F172A] mb-2 block">
                            Role
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as "JOB_SEEKER" | "RECRUITER")}
                            className="mt-2 w-full border border-[#CBD5E1] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-200"
                        >
                            <option value="JOB_SEEKER">Job Seeker</option>
                            <option value="RECRUITER">Recruiter</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1E3A8A] text-white py-2.5 rounded-lg font-semibold shadow cursor-pointer hover:bg-[#172E6B] transition-all duration-200"
                    >
                        {loading ? "Saving..." : "Continue"}
                    </button>
                </form>
            </div>
        </div>
    );
}
