"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";
import { Logo } from "@/components/landing/Logo";
import { RegisterType } from "@/types/auth";
import { authApi } from "@/services/auth.service";
import { AxiosError } from "axios";

const SignupPage = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterType>();

    const password = watch("password");

    const onSubmit = async (data: RegisterType) => {
        try {
            await authApi.register(data);
            toast.success("Account created successfully 🎉");
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            toast.error(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="bg-[#f2f7fc] h-screen flex items-center justify-center">
            <div>
                <Logo />
                <div className="bg-[#ffffff] rounded p-8 border border-gray-200 shadow">
                    {/* Signup form */}
                    <div>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4 w-fit"
                        >
                            <h1 className="font-bold text-2xl">Signup</h1>
                            <br />

                            {/* Email */}
                            <label className="font-semibold">Email</label>
                            <br />
                            <input
                                type="text"
                                placeholder="example@gmail.com"
                                className="bg-[#f2f7fc] px-4 py-2 rounded outline-none w-[350px] mt-2 border border-gray-300"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: "Invalid email address",
                                    },
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                            <br />

                            {/* Password */}
                            <label>Password:</label>
                            <br />
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="bg-[#f2f7fc] px-4 py-2 rounded outline-none w-[350px] mt-2 border border-gray-300"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Minimum 6 characters",
                                    },
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                            <br />

                            {/* Confirm Password */}
                            <label>Confirm Password:</label>
                            <br />
                            <input
                                type="password"
                                placeholder="Re-enter your password"
                                className="bg-[#f2f7fc] px-4 py-2 rounded outline-none w-[350px] mt-2 border border-gray-300"
                                {...register("confirm_password", {
                                    required: "Confirm password is required",
                                    validate: (value) =>
                                        value === password || "Passwords do not match",
                                })}
                            />
                            {errors.confirm_password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.confirm_password.message}
                                </p>
                            )}
                            <br />

                            {/* Role */}
                            <label className="font-semibold">Role</label>
                            <br />
                            <select
                                className="bg-[#f2f7fc] px-4 py-2 rounded outline-none w-[350px] mt-2 border border-gray-300"
                                {...register("role", {
                                    required: "Role is required",
                                })}
                            >
                                <option value="">Select your role</option>
                                <option value="HR">HR</option>
                                <option value="USER">Job Seeker</option>
                            </select>
                            {errors.role && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.role.message}
                                </p>
                            )}
                            <br />

                            <button
                                disabled={isSubmitting}
                                className="text-white bg-[#245bff] w-full px-4 py-2 rounded-md mt-2 cursor-pointer"
                            >
                                {isSubmitting ? "Signing up..." : "Signup"}
                            </button>
                        </form>

                        {/* <div className="h-px w-full bg-gray-300 mt-6 mb-6"></div>

                        <button className="bg-[#f2f7fc] w-full px-4 py-2 rounded-md cursor-pointer border border-gray-300">
                            Continue with Google
                        </button> */}

                        <div className="text-center text-sm mt-4">
                            Already have account?{" "}
                            <span className="underline">
                                <Link href="/login">Login</Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
