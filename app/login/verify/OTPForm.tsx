"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/landing/Logo";
import { getMe, verifyOtp } from "@/lib/auth.lib";
import { UserRole } from '../../../lib/auth.lib';

export default function OTPForm({ email }: { email: string }) {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(120);
    const [resendDisabled, setResendDisabled] = useState(true);
    const inputsRef = useRef<HTMLInputElement[]>([]);
    const router = useRouter();

    // Countdown effect
    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);      // stop interval
                    setResendDisabled(false);     // enable resend safely here
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);


    function formatTime(sec: number) {
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    function handleChange(value: string, index: number) {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    }

    async function handleVerify() {
        setLoading(true);

        const code = otp.join("");
        if (code.length !== 6) {
            setLoading(false);
            return;
        }

        try {
            const userData = await verifyOtp(email, code);
            console.log(userData)

            const me = await getMe();

            console.log(me)

            if (!me.role) {
                router.push("/login/select-role")
            } else if (me.role === "JOB_SEEKER") {
                router.push("/candidate")
            } else if (me.role === "RECRUITER") {
                router.push("/recruiter")
            }
        } catch (err) {
            console.log(err)
            setLoading(false);
        }
    }

    async function handleResend() {
        if (resendDisabled) return;
        setTimer(120);
        setResendDisabled(true);

        // Call resend OTP action
        // try {
        //     await verifyOtpAction(email, "resend"); // Adjust according to your API
        // } catch (err) {
        //     console.log(err);
        // }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center  px-4">
            {/* Logo */}

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-[#E5E7EB]">
                <div className="flex justify-center mb-6 cursor-pointer" onClick={() => router.push("/")}>
                    <Logo />
                </div>
                <h1 className="text-2xl font-bold text-[#0F172A] text-center mb-2">
                    ✉️ Check your email
                </h1>
                <p className="text-sm text-[#475569] text-center mb-6">
                    We sent a 6-digit code to <b>{email}</b>
                </p>

                {/* OTP Inputs */}
                <div className="flex justify-between gap-2 mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => {
                                if (el) inputsRef.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, index)}
                            className="w-14 h-14 text-center text-lg border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-200"
                        />
                    ))}
                </div>

                <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full bg-[#1E3A8A] text-white py-2.5 rounded-lg font-semibold shadow hover:bg-[#172E6B] transition-all duration-200"
                >
                    {loading ? "Verifying..." : "Verify & Continue"}
                </button>

                {/* Countdown & Resend */}
                <p className="mt-4 text-center text-sm text-[#475569]">
                    Didn’t receive the code?{" "}
                    <span
                        onClick={handleResend}
                        className={`underline cursor-pointer ${resendDisabled ? "text-gray-400 cursor-not-allowed" : "text-[#1E3A8A] hover:text-[#172E6B]"
                            }`}
                    >
                        Resend
                    </span>
                    {resendDisabled && <span className="ml-2 text-gray-400">({formatTime(timer)})</span>}
                </p>
            </div>
        </div>
    );
}
