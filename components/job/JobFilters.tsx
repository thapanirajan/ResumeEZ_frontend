"use client";

import { useState } from "react";

export default function JobFilter() {
    const [skillInput, setSkillInput] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [keyword, setKeyword] = useState("");
    const [jobType, setJobType] = useState("ALL");

    const addSkill = () => {
        if (!skillInput.trim()) return;
        if (skills.includes(skillInput.trim())) return;

        setSkills([...skills, skillInput.trim()]);
        setSkillInput("");
    };

    const removeSkill = (skill: string) => {
        setSkills(skills.filter((s) => s !== skill));
    };

    const clearAll = () => {
        setKeyword("");
        setSkillInput("");
        setSkills([]);
        setJobType("ALL");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="font-bold text-xl text-slate-900">Filters</div>
                <button
                    type="button"
                    onClick={clearAll}
                    className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                    Clear All
                </button>
            </div>

            {/* Keyword */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Keyword</p>
                <input
                    type="text"
                    placeholder="Design, React, etc"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                />
            </div>

            {/* Skill Tags */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Skills</p>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add skill"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addSkill();
                            }
                        }}
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                    />
                    <button
                        type="button"
                        onClick={addSkill}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                    >
                        +
                    </button>
                </div>

                {/* Tag List */}
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <div
                            key={skill}
                            className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                        >
                            {skill}
                            <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* JOB TYPE */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Job Type</p>

                {[
                    "ALL",
                    "FULL_TIME",
                    "PART_TIME",
                    "INTERNSHIP",
                    "CONTRACT",
                    "REMOTE",
                ].map((type) => (
                    <label
                        key={type}
                        className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none"
                    >
                        <input
                            type="radio"
                            name="jobType"
                            value={type}
                            checked={jobType === type}
                            onChange={() => setJobType(type)}
                            className="h-4 w-4 accent-primary"
                        />
                        {type.replace("_", " ")}
                    </label>
                ))}
            </div>
        </div>
    );
}
