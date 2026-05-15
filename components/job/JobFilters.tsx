"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { EmploymentType } from "@/types/job";

const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
    { value: "FULL_TIME",   label: "Full Time" },
    { value: "PART_TIME",   label: "Part Time" },
    { value: "INTERNSHIP",  label: "Internship" },
    { value: "CONTRACT",    label: "Contract" },
    { value: "REMOTE",      label: "Remote" },
];

type Props = {
    onApply?: () => void
}

function FilterSection({
    label,
    children,
    defaultOpen = true,
}: {
    label: string
    children: React.ReactNode
    defaultOpen?: boolean
}) {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div className="border-b border-slate-100 pb-4">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between py-1 text-left"
            >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {label}
                </span>
                <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-200 ${
                    open ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
                }`}
            >
                {children}
            </div>
        </div>
    )
}

const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition"

export default function JobFilter({ onApply }: Props) {
    const router      = useRouter();
    const pathname    = usePathname();
    const searchParams = useSearchParams();

    const [title, setTitle]                 = useState(searchParams.get("title") ?? "");
    const [location, setLocation]           = useState(searchParams.get("location") ?? "");
    const [employmentTypes, setEmploymentTypes] = useState<EmploymentType[]>(
        searchParams.getAll("employment_types") as EmploymentType[]
    );
    const [minSalary, setMinSalary]         = useState(searchParams.get("min_salary") ?? "");
    const [maxSalary, setMaxSalary]         = useState(searchParams.get("max_salary") ?? "");
    const [minExperience, setMinExperience] = useState(searchParams.get("min_experience") ?? "");
    const [maxExperience, setMaxExperience] = useState(searchParams.get("max_experience") ?? "");

    // Keep local state in sync when URL changes externally (e.g. tag removal from the active-tags bar)
    useEffect(() => {
        setTitle(searchParams.get("title") ?? "");
        setLocation(searchParams.get("location") ?? "");
        setEmploymentTypes(searchParams.getAll("employment_types") as EmploymentType[]);
        setMinSalary(searchParams.get("min_salary") ?? "");
        setMaxSalary(searchParams.get("max_salary") ?? "");
        setMinExperience(searchParams.get("min_experience") ?? "");
        setMaxExperience(searchParams.get("max_experience") ?? "");
    }, [searchParams]);

    const toggleEmploymentType = (type: EmploymentType) => {
        setEmploymentTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (title.trim().length >= 3)           params.set("title", title.trim());
        if (location.trim().length >= 2)        params.set("location", location.trim());
        employmentTypes.forEach((t) =>          params.append("employment_types", t));
        if (minSalary)                          params.set("min_salary", minSalary);
        if (maxSalary)                          params.set("max_salary", maxSalary);
        if (minExperience)                      params.set("min_experience", minExperience);
        if (maxExperience)                      params.set("max_experience", maxExperience);
        router.push(`${pathname}?${params.toString()}`);
        onApply?.();
    };

    const clearAll = () => {
        setTitle(""); setLocation(""); setEmploymentTypes([]);
        setMinSalary(""); setMaxSalary(""); setMinExperience(""); setMaxExperience("");
        router.push(pathname);
        onApply?.();
    };

    const activeCount =
        (title.trim().length >= 3 ? 1 : 0) +
        (location.trim().length >= 2 ? 1 : 0) +
        employmentTypes.length +
        (minSalary ? 1 : 0) + (maxSalary ? 1 : 0) +
        (minExperience ? 1 : 0) + (maxExperience ? 1 : 0);

    const hasActiveFilters = activeCount > 0;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">Filters</span>
                    {hasActiveFilters && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white">
                            {activeCount}
                        </span>
                    )}
                </div>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearAll}
                        className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Location */}
            <FilterSection label="Location">
                <input
                    type="text"
                    placeholder="e.g. Kathmandu, Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                    className={inputClass}
                    aria-label="Filter by location"
                />
            </FilterSection>

            {/* Job Type */}
            <FilterSection label="Job Type">
                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                    {EMPLOYMENT_TYPES.map(({ value, label }) => (
                        <label
                            key={value}
                            className="flex items-center gap-2 cursor-pointer select-none group"
                        >
                            <input
                                type="checkbox"
                                checked={employmentTypes.includes(value)}
                                onChange={() => toggleEmploymentType(value)}
                                className="h-4 w-4 rounded border-slate-300 accent-primary shrink-0"
                                aria-label={`Filter by ${label}`}
                            />
                            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                                {label}
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Salary Range */}
            <FilterSection label="Salary Range (USD)">
                <div className="flex gap-2 items-center">
                    <input
                        type="number" min={0} placeholder="Min"
                        value={minSalary}
                        onChange={(e) => setMinSalary(e.target.value)}
                        className={inputClass}
                        aria-label="Minimum salary"
                    />
                    <span className="text-slate-300 text-sm shrink-0">–</span>
                    <input
                        type="number" min={0} placeholder="Max"
                        value={maxSalary}
                        onChange={(e) => setMaxSalary(e.target.value)}
                        className={inputClass}
                        aria-label="Maximum salary"
                    />
                </div>
            </FilterSection>

            {/* Experience */}
            <FilterSection label="Experience (years)">
                <div className="flex gap-2 items-center">
                    <input
                        type="number" min={0} placeholder="Min"
                        value={minExperience}
                        onChange={(e) => setMinExperience(e.target.value)}
                        className={inputClass}
                        aria-label="Minimum experience"
                    />
                    <span className="text-slate-300 text-sm shrink-0">–</span>
                    <input
                        type="number" min={0} placeholder="Max"
                        value={maxExperience}
                        onChange={(e) => setMaxExperience(e.target.value)}
                        className={inputClass}
                        aria-label="Maximum experience"
                    />
                </div>
            </FilterSection>

            {/* Apply button */}
            <button
                type="button"
                onClick={applyFilters}
                className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 active:bg-primary/80 transition-colors"
            >
                Apply Filters
            </button>
        </div>
    );
}
