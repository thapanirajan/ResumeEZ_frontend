import { useState } from "react";
import { ResumeData } from "@/app/(candidate)/candidate/resume/type";

const MAX_CHARS = 600;
const MIN_CHARS = 250;

export default function SummaryForm({
    resume,
    setResume,
}: {
    resume: ResumeData;
    setResume: (r: ResumeData) => void;
}) {
    const [isImproving, setIsImproving] = useState(false);
    const charCount = resume.summary.length;

    async function improveWithAI() {
        if (!resume.summary.trim()) return;

        try {
            setIsImproving(true);

            // 🔹 Replace this with your real AI API call
            const improvedSummary = await fakeAiImprove(resume.summary);

            setResume({
                ...resume,
                summary: improvedSummary,
            });
        } finally {
            setIsImproving(false);
        }
    }

    return (
        <section className="space-y-6">
            {/* HEADER */}
            <header className="space-y-1">
                <h2 className="text-lg font-semibold text-slate-900">
                    Professional Summary
                </h2>
                <p className="text-sm text-slate-500">
                    A concise overview of your experience, strengths, and impact.
                </p>
            </header>

            {/* GUIDANCE */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-medium text-slate-700 mb-1">
                    Best practices:
                </p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Start with your role or experience level</li>
                    <li>Mention 2–3 core skills</li>
                    <li>Highlight impact or results</li>
                </ul>
            </div>

            {/* TEXTAREA */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                    Summary
                </label>

                <textarea
                    rows={7}
                    value={resume.summary}
                    onChange={(e) =>
                        setResume({ ...resume, summary: e.target.value })
                    }
                    placeholder="Example: Software engineer with 2+ years of experience building scalable web applications using React and Node.js..."
                    className="
            w-full resize-none rounded-lg border border-slate-300 bg-white p-3
            text-sm text-slate-900
            focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20
          "
                />

                {/* FOOTER */}
                <div className="flex items-center justify-between text-xs">
                    <p
                        className={`${charCount < MIN_CHARS
                                ? "text-amber-600"
                                : charCount > MAX_CHARS
                                    ? "text-red-600"
                                    : "text-slate-500"
                            }`}
                    >
                        {charCount < MIN_CHARS
                            ? "Try to be a bit more descriptive"
                            : charCount > MAX_CHARS
                                ? "Consider shortening for clarity"
                                : "Good length"}
                    </p>

                    <span className="text-slate-400">
                        {charCount}/{MAX_CHARS}
                    </span>
                </div>
            </div>

            {/* AI ACTION */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                    AI can refine wording while keeping your meaning intact.
                </p>

                <button
                    onClick={improveWithAI}
                    disabled={isImproving || !resume.summary.trim()}
                    className="
            rounded-lg bg-[#1e3a8a] px-4 py-2 text-sm font-medium text-white
            disabled:opacity-50 disabled:cursor-not-allowed
          "
                >
                    {isImproving ? "Improving..." : "Improve with AI"}
                </button>
            </div>
        </section>
    );
}


async function fakeAiImprove(text: string): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(
                text
                    .replace(/\s+/g, " ")
                    .replace(
                        /^/,
                        "Results-driven professional with experience in "
                    )
            );
        }, 1200);
    });
}
