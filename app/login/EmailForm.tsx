"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authenticateEmailAction } from "./actions";
import Logo from "@/components/landing/Logo";
import { BASE_URL } from "@/lib/auth.lib";

export default function EmailForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            await authenticateEmailAction(email);
            setTimeout(() => {
                setLoading(false);
                router.push(`/login/verify?email=${encodeURIComponent(email)}`);
            }, 1000);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center  px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-[#E5E7EB]">
                {/* Logo */}
                <div className="flex justify-center relative group cursor-pointer mb-6">
                    <Logo />
                    {/* Premium Tooltip */}
                    <span className="
    absolute bottom-full left-1/2 -translate-x-1/2 mb-3
    opacity-0 scale-90
    group-hover:opacity-100 group-hover:scale-100
    transition-all duration-200 ease-out
    bg-[#1E3A8A] text-white text-xs font-medium
    rounded-md px-3 py-1 whitespace-nowrap shadow-xl
    pointer-events-none
    after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-t-[#1E3A8A] after:border-x-transparent after:border-b-transparent
  ">
                        Go back to home page
                    </span>
                </div>

                <h1 className="text-2xl font-bold text-[#0F172A] text-center mb-2">
                    Welcome to ResumeEZ
                </h1>
                <p className="text-sm text-[#475569] text-center mb-6">
                    Enter your email to continue. We&rsquo;ll send you a secure login code
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-sm font-semibold text-[#0F172A]">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 w-full border border-[#CBD5E1] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-200"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1E3A8A] text-white py-2.5 rounded-lg font-semibold 
                        shadow cursor-pointer
                        hover:bg-[#172E6B] transition-all duration-200"
                    >
                        {loading ? "Sending code..." : "Continue"}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-4">
                    <hr className="grow border-t border-[#CBD5E1]" />
                    <span className="mx-3 text-sm text-[#6B7280]">or</span>
                    <hr className="grow border-t border-[#CBD5E1]" />
                </div>

                {/* Continue with Google */}
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 
                    border border-[#CBD5E1] 
                    rounded-lg py-2.5 font-semibold text-[#1E3A8A] 
                    hover:bg-[#E0E7FF] transition-all duration-200
                    cursor-pointer"
                    onClick={() => {
                        window.location.href = `${BASE_URL}/api/user/auth/google/login`;
                    }}
                >
                    Continue with Google
                </button>
            </div>
        </div>
    );
}
