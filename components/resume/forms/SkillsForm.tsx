import { ResumeData, SkillCategory } from "@/app/(candidate)/candidate/resume/type";

export default function SkillsForm({
    resume,
    setResume,
}: {
    resume: ResumeData;
    setResume: (r: ResumeData) => void;
}) {
    const skills = resume.skills ?? [];

    const addCategory = () => {
        setResume({
            ...resume,
            skills: [...skills, { category: "", items: "" }],
        });
    };

    const updateCategory = (index: number, field: keyof SkillCategory, value: string) => {
        const updated = [...skills];
        updated[index] = { ...updated[index], [field]: value };
        setResume({ ...resume, skills: updated });
    };

    const removeCategory = (index: number) => {
        setResume({
            ...resume,
            skills: skills.filter((_, i) => i !== index),
        });
    };

    return (
        <section className="space-y-6">
            <header>
                <h2 className="text-lg font-semibold text-slate-900">Skills</h2>
                <p className="text-sm text-slate-500">
                    Group your skills by category (e.g. Languages, Frameworks, Tools).
                </p>
            </header>

            <div className="space-y-4">
                {skills.map((skill, index) => (
                    <div key={index} className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-500">
                                Category {index + 1}
                            </span>
                            <button
                                onClick={() => removeCategory(index)}
                                className="text-sm text-red-600 hover:underline"
                            >
                                Remove
                            </button>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">
                                Category Name
                            </label>
                            <input
                                value={skill.category}
                                onChange={(e) => updateCategory(index, "category", e.target.value)}
                                placeholder="e.g. Programming Languages"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">
                                Skills
                            </label>
                            <input
                                value={skill.items}
                                onChange={(e) => updateCategory(index, "items", e.target.value)}
                                placeholder="e.g. JavaScript, TypeScript, Python"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
                            />
                            <p className="text-xs text-slate-400">Separate skills with commas</p>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={addCategory}
                className="rounded-lg border px-4 py-2 text-sm"
            >
                + Add skill category
            </button>
        </section>
    );
}
