"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { getProfile, updateProfile, UserProfileData, UserRole } from "@/lib/auth.lib";
import { toast } from "sonner";

type Props = {
    expectedRole: UserRole;
    title: string;
    subtitle: string;
};

const COMPANY_SIZE_OPTIONS = [
    "1–10",
    "11–50",
    "51–200",
    "201–500",
    "501–1000",
    "1000+",
];

const INDUSTRY_OPTIONS = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Retail",
    "Manufacturing",
    "Media & Entertainment",
    "Government",
    "Non-profit",
    "Other",
];

export default function ProfileSettingsPage({ expectedRole, title, subtitle }: Props) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfileData | null>(null);

    // ── Shared ──────────────────────────────────────────────────────
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [location, setLocation] = useState("");

    // ── Candidate ───────────────────────────────────────────────────
    const [currentRole, setCurrentRole] = useState("");
    const [experienceYears, setExperienceYears] = useState("");
    const [bio, setBio] = useState("");
    const [skillsInput, setSkillsInput] = useState("");   // comma-separated string
    const [isPublic, setIsPublic] = useState(true);

    // ── Recruiter ───────────────────────────────────────────────────
    const [companyName, setCompanyName] = useState("");
    const [companyWebsite, setCompanyWebsite] = useState("");
    const [companyLogo, setCompanyLogo] = useState("");
    const [industry, setIndustry] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [companyDescription, setCompanyDescription] = useState("");

    const isCandidate = expectedRole === "JOB_SEEKER";
    const roleLabel = useMemo(
        () => (expectedRole === "JOB_SEEKER" ? "Job Seeker" : "Recruiter"),
        [expectedRole],
    );

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await getProfile();
                setProfile(data);

                if (data.role === "JOB_SEEKER" && data.candidate_profile) {
                    const cp = data.candidate_profile;
                    setUsername(cp.username ?? "");
                    setFullName(cp.full_name ?? "");
                    setLocation(cp.location ?? "");
                    setCurrentRole(cp.current_role ?? "");
                    setExperienceYears(cp.experience_years != null ? String(cp.experience_years) : "");
                    setBio(cp.bio ?? "");
                    setSkillsInput(Array.isArray(cp.skills) ? cp.skills.join(", ") : "");
                    setIsPublic(cp.is_public ?? true);
                }

                if (data.role === "RECRUITER" && data.recruiter_profile) {
                    const rp = data.recruiter_profile;
                    setUsername(rp.username ?? "");
                    setFullName(rp.full_name ?? "");
                    setLocation(rp.location ?? "");
                    setCompanyName(rp.company_name ?? "");
                    setCompanyWebsite(rp.company_website ?? "");
                    setCompanyLogo(rp.company_logo ?? "");
                    setIndustry(rp.industry ?? "");
                    setCompanySize(rp.company_size ?? "");
                    setCompanyDescription(rp.company_description ?? "");
                }
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Failed to load profile";
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSaving(true);
        try {
            if (isCandidate && experienceYears.trim() !== "") {
                const y = Number(experienceYears);
                if (!Number.isInteger(y) || y < 0)
                    throw new Error("Experience years must be a non-negative whole number.");
            }

            const payload = isCandidate
                ? {
                    username: username.trim(),
                    full_name: fullName.trim(),
                    location: location.trim(),
                    current_role: currentRole.trim(),
                    experience_years: experienceYears.trim() === "" ? null : Number(experienceYears),
                    bio: bio.trim(),
                    skills: skillsInput
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    is_public: isPublic,
                }
                : {
                    username: username.trim(),
                    full_name: fullName.trim(),
                    location: location.trim(),
                    company_name: companyName.trim(),
                    company_website: companyWebsite.trim(),
                    company_logo: companyLogo.trim(),
                    industry: industry.trim(),
                    company_size: companySize,
                    company_description: companyDescription.trim(),
                };

            const updated = await updateProfile(payload);
            toast.success("Profile saved successfully.");
            setProfile(updated);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to update profile";
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 rounded-xl bg-slate-200" />
                ))}
            </div>
        );
    }

    if (!profile) {
        return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">Profile not found.</div>;
    }

    if (profile.role !== expectedRole) {
        return (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
                You are logged in as <strong>{profile.role ?? "UNKNOWN"}</strong>. This page is for <strong>{expectedRole}</strong> only.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="space-y-1">
                <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-600">{subtitle}</p>
            </header>

            <form onSubmit={onSubmit} className="space-y-6">

                {/* ── Account info (read-only) ─────────────────────── */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-semibold text-gray-800">Account</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Email</p>
                            <p className="text-sm text-gray-900">{profile.email}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Account type</p>
                            <p className="text-sm text-gray-900">{roleLabel}</p>
                        </div>
                    </div>
                </section>

                {/* ── Personal info ───────────────────────────────── */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-semibold text-gray-800">Personal information</h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Username">
                            <input
                                className={inputCls}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g. johndoe"
                            />
                        </Field>
                        <Field label="Full name">
                            <input
                                className={inputCls}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="e.g. John Doe"
                            />
                        </Field>
                        <Field label="Location">
                            <input
                                className={inputCls}
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. Kathmandu, Nepal"
                            />
                        </Field>
                    </div>
                </section>

                {/* ── Candidate: professional info ─────────────────── */}
                {isCandidate && (
                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                        <h2 className="text-base font-semibold text-gray-800">Professional details</h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Current role">
                                <input
                                    className={inputCls}
                                    value={currentRole}
                                    onChange={(e) => setCurrentRole(e.target.value)}
                                    placeholder="e.g. Backend Developer"
                                />
                            </Field>
                            <Field label="Experience (years)">
                                <input
                                    type="number"
                                    min={0}
                                    className={inputCls}
                                    value={experienceYears}
                                    onChange={(e) => setExperienceYears(e.target.value)}
                                    placeholder="e.g. 3"
                                />
                            </Field>
                        </div>

                        <Field label="Bio">
                            <textarea
                                rows={3}
                                className={inputCls}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Brief professional summary about yourself…"
                            />
                        </Field>

                        <Field label="Skills" hint="Comma-separated, e.g. Python, React, Docker">
                            <input
                                className={inputCls}
                                value={skillsInput}
                                onChange={(e) => setSkillsInput(e.target.value)}
                                placeholder="Python, React, Docker, PostgreSQL…"
                            />
                        </Field>

                        <div className="flex items-center gap-3">
                            <input
                                id="is_public"
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600"
                            />
                            <label htmlFor="is_public" className="text-sm text-gray-700">
                                Make my profile public (visible to recruiters)
                            </label>
                        </div>
                    </section>
                )}

                {/* ── Recruiter: company info ──────────────────────── */}
                {!isCandidate && (
                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                        <h2 className="text-base font-semibold text-gray-800">Company details</h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Company name">
                                <input
                                    className={inputCls}
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="e.g. Acme Corp"
                                />
                            </Field>
                            <Field label="Company website">
                                <input
                                    type="url"
                                    className={inputCls}
                                    value={companyWebsite}
                                    onChange={(e) => setCompanyWebsite(e.target.value)}
                                    placeholder="https://acme.com"
                                />
                            </Field>
                            <Field label="Industry">
                                <select
                                    className={inputCls}
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                >
                                    <option value="">Select industry…</option>
                                    {INDUSTRY_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Company size">
                                <select
                                    className={inputCls}
                                    value={companySize}
                                    onChange={(e) => setCompanySize(e.target.value)}
                                >
                                    <option value="">Select size…</option>
                                    {COMPANY_SIZE_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        <Field label="Company logo URL">
                            <input
                                type="url"
                                className={inputCls}
                                value={companyLogo}
                                onChange={(e) => setCompanyLogo(e.target.value)}
                                placeholder="https://acme.com/logo.png"
                            />
                        </Field>

                        <Field label="Company description">
                            <textarea
                                rows={4}
                                className={inputCls}
                                value={companyDescription}
                                onChange={(e) => setCompanyDescription(e.target.value)}
                                placeholder="What does your company do? Culture, mission, etc."
                            />
                        </Field>
                    </section>
                )}

                {/* ── Submit ──────────────────────────────────────── */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-[#1e3a8a] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#1e3a8a]/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? "Saving…" : "Save changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}

// ── Small helpers ────────────────────────────────────────────────────────────

const inputCls =
    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400";

function Field({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
                {label}
                {hint && <span className="ml-1 text-xs font-normal text-gray-400">({hint})</span>}
            </label>
            {children}
        </div>
    );
}
