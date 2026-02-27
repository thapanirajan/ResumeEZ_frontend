"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { EmploymentType } from "@/types/job";

const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
    { value: "FULL_TIME", label: "Full Time" },
    { value: "PART_TIME", label: "Part Time" },
    { value: "INTERNSHIP", label: "Internship" },
    { value: "CONTRACT", label: "Contract" },
    { value: "REMOTE", label: "Remote" },
];

const SORT_OPTIONS = [
    { value: "created_at", label: "Date Posted" },
    { value: "salary_min", label: "Min Salary" },
    { value: "salary_max", label: "Max Salary" },
    { value: "experience_required", label: "Experience" },
];

export default function JobFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [title, setTitle] = useState(searchParams.get("title") ?? "");
    const [location, setLocation] = useState(searchParams.get("location") ?? "");
    const [employmentTypes, setEmploymentTypes] = useState<EmploymentType[]>(
        searchParams.getAll("employment_types") as EmploymentType[]
    );
    const [minSalary, setMinSalary] = useState(searchParams.get("min_salary") ?? "");
    const [maxSalary, setMaxSalary] = useState(searchParams.get("max_salary") ?? "");
    const [minExperience, setMinExperience] = useState(searchParams.get("min_experience") ?? "");
    const [maxExperience, setMaxExperience] = useState(searchParams.get("max_experience") ?? "");
    const [sortBy, setSortBy] = useState(searchParams.get("sort_by") ?? "created_at");
    const [order, setOrder] = useState(searchParams.get("order") ?? "desc");

    const toggleEmploymentType = (type: EmploymentType) => {
        setEmploymentTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    const applyFilters = () => {
        const params = new URLSearchParams();

        if (title.trim().length >= 3) params.set("title", title.trim());
        if (location.trim().length >= 2) params.set("location", location.trim());
        employmentTypes.forEach((t) => params.append("employment_types", t));
        if (minSalary) params.set("min_salary", minSalary);
        if (maxSalary) params.set("max_salary", maxSalary);
        if (minExperience) params.set("min_experience", minExperience);
        if (maxExperience) params.set("max_experience", maxExperience);
        if (sortBy !== "created_at") params.set("sort_by", sortBy);
        if (order !== "desc") params.set("order", order);

        router.push(`${pathname}?${params.toString()}`);
    };

    const clearAll = () => {
        setTitle("");
        setLocation("");
        setEmploymentTypes([]);
        setMinSalary("");
        setMaxSalary("");
        setMinExperience("");
        setMaxExperience("");
        setSortBy("created_at");
        setOrder("desc");
        router.push(pathname);
    };

    const hasActiveFilters =
        title.trim().length >= 3 ||
        location.trim().length >= 2 ||
        employmentTypes.length > 0 ||
        minSalary ||
        maxSalary ||
        minExperience ||
        maxExperience;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="font-bold text-xl text-slate-900">Filters</div>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearAll}
                        className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Title / Keyword */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Job Title</p>
                <input
                    type="text"
                    placeholder="e.g. Software Engineer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                />
                {title.trim().length > 0 && title.trim().length < 3 && (
                    <p className="text-xs text-amber-500">Enter at least 3 characters</p>
                )}
            </div>

            {/* Location */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Location</p>
                <input
                    type="text"
                    placeholder="e.g. Kathmandu, Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                />
            </div>

            {/* Job Type */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Job Type</p>
                <div className="space-y-2">
                    {EMPLOYMENT_TYPES.map(({ value, label }) => (
                        <label
                            key={value}
                            className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer select-none"
                        >
                            <input
                                type="checkbox"
                                checked={employmentTypes.includes(value)}
                                onChange={() => toggleEmploymentType(value)}
                                className="h-4 w-4 rounded border-slate-300 accent-primary"
                            />
                            {label}
                        </label>
                    ))}
                </div>
            </div>

            {/* Salary Range */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Salary Range</p>
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        min={0}
                        placeholder="Min"
                        value={minSalary}
                        onChange={(e) => setMinSalary(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                    />
                    <span className="text-slate-400 text-sm shrink-0">–</span>
                    <input
                        type="number"
                        min={0}
                        placeholder="Max"
                        value={maxSalary}
                        onChange={(e) => setMaxSalary(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                    />
                </div>
            </div>

            {/* Experience Range */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Experience (years)</p>
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        min={0}
                        placeholder="Min"
                        value={minExperience}
                        onChange={(e) => setMinExperience(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                    />
                    <span className="text-slate-400 text-sm shrink-0">–</span>
                    <input
                        type="number"
                        min={0}
                        placeholder="Max"
                        value={maxExperience}
                        onChange={(e) => setMaxExperience(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                    />
                </div>
            </div>

            {/* Sort */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Sort By</p>
                <div className="flex gap-2">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                    >
                        {SORT_OPTIONS.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={() => setOrder((o) => (o === "asc" ? "desc" : "asc"))}
                        title={order === "asc" ? "Ascending" : "Descending"}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        {order === "asc" ? "↑" : "↓"}
                    </button>
                </div>
            </div>

            {/* Apply */}
            <button
                type="button"
                onClick={applyFilters}
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 active:bg-primary/80 transition-colors"
            >
                Apply Filters
            </button>
        </div>
    );
}
