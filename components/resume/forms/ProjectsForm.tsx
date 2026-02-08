import { ResumeData } from "@/app/(candidate)/candidate/resume/type";

export default function ProjectsForm({
    resume,
    setResume,
}: {
    resume: ResumeData;
    setResume: (r: ResumeData) => void;
}) {
    const addProject = () => {
        setResume({
            ...resume,
            projects: [
                ...resume.projects,
                {
                    name: "",
                    role: "",
                    techStack: "",
                    description: "",
                    liveUrl: "",
                    githubUrl: "",
                },
            ],
        });
    };

    const updateProject = (
        index: number,
        field: string,
        value: string
    ) => {
        const updated = [...resume.projects];
        updated[index] = { ...updated[index], [field]: value };
        setResume({ ...resume, projects: updated });
    };

    const removeProject = (index: number) => {
        setResume({
            ...resume,
            projects: resume.projects.filter((_, i) => i !== index),
        });
    };

    return (
        <section className="space-y-8">
            <header>
                <h2 className="text-lg font-semibold text-slate-900">
                    Projects
                </h2>
                <p className="text-sm text-slate-500">
                    Showcase your most relevant technical or academic projects.
                </p>
            </header>

            <div className="space-y-6">
                {resume.projects.map((project, index) => (
                    <div
                        key={index}
                        className="rounded-xl border border-slate-200 bg-white p-5 space-y-4"
                    >
                        <div className="flex justify-between">
                            <p className="text-sm font-medium text-slate-700">
                                Project {index + 1}
                            </p>
                            <button
                                onClick={() => removeProject(index)}
                                className="text-sm text-red-600 hover:underline"
                            >
                                Remove
                            </button>
                        </div>

                        <Field
                            label="Project Name"
                            placeholder="e.g. Resume Builder App"
                            value={project.name}
                            onChange={(v) =>
                                updateProject(index, "name", v)
                            }
                        />

                        <Field
                            label="Your Role (optional)"
                            placeholder="e.g. Full Stack Developer"
                            value={project.role || ""}
                            onChange={(v) =>
                                updateProject(index, "role", v)
                            }
                        />

                        <Field
                            label="Tech Stack"
                            placeholder="e.g. Next.js, Node.js, PostgreSQL"
                            value={project.techStack}
                            onChange={(v) =>
                                updateProject(index, "techStack", v)
                            }
                        />

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">
                                Description / Responsibilities
                            </label>
                            <textarea
                                rows={4}
                                value={project.description}
                                onChange={(e) =>
                                    updateProject(
                                        index,
                                        "description",
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field
                                label="Live URL (optional)"
                                placeholder="https://example.com"
                                value={project.liveUrl || ""}
                                onChange={(v) =>
                                    updateProject(index, "liveUrl", v)
                                }
                            />

                            <Field
                                label="GitHub Repo (optional)"
                                placeholder="https://github.com/username/repo"
                                value={project.githubUrl || ""}
                                onChange={(v) =>
                                    updateProject(index, "githubUrl", v)
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={addProject}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-50"
            >
                + Add Project
            </button>
        </section>
    );
}


function Field({
    label,
    value,
    placeholder,
    onChange,
}: {
    label: string;
    value: string;
    placeholder?: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
                {label}
            </label>
            <input
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20"
            />
        </div>
    );
}
