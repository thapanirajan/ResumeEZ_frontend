"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { getProfile, updateProfile, UserProfileData, UserRole } from "@/lib/auth.lib";
import { toast } from "sonner";

type Props = {
    expectedRole: UserRole;
    title: string;
    subtitle: string;
};

export default function ProfileSettingsPage({ expectedRole, title, subtitle }: Props) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<UserProfileData | null>(null);

    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [currentRole, setCurrentRole] = useState("");
    const [experienceYears, setExperienceYears] = useState("");

    const isCandidate = expectedRole === "JOB_SEEKER";

    const roleLabel = useMemo(() => {
        return expectedRole === "JOB_SEEKER" ? "Job Seeker" : "Recruiter";
    }, [expectedRole]);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);

            try {
                const data = await getProfile();
                setProfile(data);

                if (data.role === "JOB_SEEKER" && data.candidate_profile) {
                    setUsername(data.candidate_profile.username ?? "");
                    setFullName(data.candidate_profile.full_name ?? "");
                    setCurrentRole(data.candidate_profile.current_role ?? "");
                    setExperienceYears(
                        data.candidate_profile.experience_years != null
                            ? String(data.candidate_profile.experience_years)
                            : "",
                    );
                }

                if (data.role === "RECRUITER" && data.recruiter_profile) {
                    setUsername(data.recruiter_profile.username ?? "");
                    setFullName(data.recruiter_profile.full_name ?? "");
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to load profile";
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            if (isCandidate && experienceYears.trim() !== "") {
                const parsedYears = Number(experienceYears);
                if (!Number.isInteger(parsedYears) || parsedYears < 0) {
                    throw new Error("Experience years must be a non-negative whole number.");
                }
            }

            const payload: Record<string, string | number | null> = {
                username: username.trim(),
                full_name: fullName.trim(),
            };

            if (isCandidate) {
                payload.current_role = currentRole.trim();
                payload.experience_years =
                    experienceYears.trim() === "" ? null : Number(experienceYears);
            }

            const updated = await updateProfile(payload);
            toast.success("Profile saved successfully.");
            setProfile(updated);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to update profile";
            setError(message);
            toast.error(message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="rounded-2xl border border-gray-200 bg-white p-6">Loading profile...</div>;
    }

    if (!profile) {
        return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">Profile not found.</div>;
    }

    if (profile.role !== expectedRole) {
        return (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
                You are logged in as `{profile.role ?? "UNKNOWN"}`. This page is for `{expectedRole}` only.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="space-y-1">
                <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-600">{subtitle}</p>
            </header>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
                        <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Account Type</p>
                        <p className="mt-1 text-sm text-gray-900">{roleLabel}</p>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label className="space-y-1">
                            <span className="text-sm text-gray-700">Username</span>
                            <input
                                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                            />
                        </label>

                        <label className="space-y-1">
                            <span className="text-sm text-gray-700">Full name</span>
                            <input
                                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter full name"
                            />
                        </label>
                    </div>

                    {isCandidate && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <label className="space-y-1">
                                <span className="text-sm text-gray-700">Current role</span>
                                <input
                                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
                                    value={currentRole}
                                    onChange={(e) => setCurrentRole(e.target.value)}
                                    placeholder="e.g. Backend Developer"
                                />
                            </label>

                            <label className="space-y-1">
                                <span className="text-sm text-gray-700">Experience (years)</span>
                                <input
                                    type="number"
                                    min={0}
                                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
                                    value={experienceYears}
                                    onChange={(e) => setExperienceYears(e.target.value)}
                                    placeholder="e.g. 2"
                                />
                            </label>
                        </div>
                    )}

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-primary px-4 py-2 text-sm font-medium cursor-pointer text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? "Saving..." : "Save changes"}
                    </button>
                </form>
            </section>
        </div>
    );
}
