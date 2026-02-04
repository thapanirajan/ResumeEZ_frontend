import { ResumeData } from "@/app/(candidate)/candidate/resume/type";
import { useState } from "react";
import {
    DndContext,
    closestCenter,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ExperienceForm({
    resume,
    setResume,
}: {
    resume: ResumeData;
    setResume: (r: ResumeData) => void;
}) {
    const [aiLoadingIndex, setAiLoadingIndex] = useState<number | null>(null);

    const addExperience = () => {
        setResume({
            ...resume,
            experience: [
                ...resume.experience,
                {
                    company: "",
                    role: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                },
            ],
        });
    };

    const updateExperience = (
        index: number,
        field: string,
        value: string
    ) => {
        const updated = [...resume.experience];
        updated[index] = { ...updated[index], [field]: value };
        setResume({ ...resume, experience: updated });
    };

    const removeExperience = (index: number) => {
        setResume({
            ...resume,
            experience: resume.experience.filter((_, i) => i !== index),
        });
    };

    /* ---------------- DRAG HANDLER ---------------- */

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = resume.experience.findIndex(
            (_, i) => i.toString() === active.id
        );
        const newIndex = resume.experience.findIndex(
            (_, i) => i.toString() === over.id
        );

        const reordered = [...resume.experience];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);

        setResume({ ...resume, experience: reordered });
    };

    /* ---------------- AUTO SORT ---------------- */

    const autoSortByDate = () => {
        const sorted = [...resume.experience].sort(
            (a, b) =>
                new Date(b.startDate || "1970").getTime() -
                new Date(a.startDate || "1970").getTime()
        );
        setResume({ ...resume, experience: sorted });
    };

    /* ---------------- AI ENHANCE ---------------- */

    const enhanceWithAI = async (index: number) => {
        const text = resume.experience[index].description;
        if (!text.trim()) return;

        setAiLoadingIndex(index);

        // 🔹 Replace with real API later
        const improved = await fakeAI(text);

        updateExperience(index, "description", improved);
        setAiLoadingIndex(null);
    };

    return (
        <section className="space-y-8">
            {/* HEADER */}
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Professional Experience
                    </h2>
                    <p className="text-sm text-slate-500">
                        Drag to reorder or auto-sort by date.
                    </p>
                </div>

                <button
                    onClick={autoSortByDate}
                    className="text-sm font-medium text-[#1e3a8a] hover:underline"
                >
                    Auto-sort by date
                </button>
            </header>

            {/* DRAGGABLE LIST */}
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={resume.experience.map((_, i) => i.toString())}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-6">
                        {resume.experience.map((exp, index) => (
                            <SortableCard key={index} id={index.toString()}>
                                {({ setActivatorNodeRef, listeners, attributes }) => (
                                    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">

                                        {/* HEADER */}
                                        <div className="flex items-center justify-between">
                                            {/* DRAG HANDLE */}
                                            <button
                                                ref={setActivatorNodeRef}
                                                {...listeners}
                                                {...attributes}
                                                type="button"
                                                className="
            cursor-grab text-slate-400 hover:text-slate-600
            text-sm font-medium
          "
                                            >
                                                ⋮⋮ Drag
                                            </button>

                                            <button
                                                onClick={() => removeExperience(index)}
                                                className="text-sm text-red-600 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        {/* INPUTS (NOW WORKING) */}
                                        <Field
                                            label="Job Title"
                                            value={exp.role}
                                            onChange={(v) => updateExperience(index, "role", v)}
                                        />

                                        <Field
                                            label="Company"
                                            value={exp.company}
                                            onChange={(v) => updateExperience(index, "company", v)}
                                        />

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {/* START DATE */}
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-slate-700">
                                                    Start Date
                                                </label>
                                                <input
                                                    type="month"
                                                    value={exp.startDate}
                                                    onChange={(e) =>
                                                        updateExperience(index, "startDate", e.target.value)
                                                    }
                                                    className="
        w-full rounded-lg border border-slate-300 bg-white px-3 py-2
        text-sm text-slate-900
        focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20
      "
                                                />
                                            </div>

                                            {/* END DATE */}
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-slate-700">
                                                    End Date
                                                </label>

                                                <input
                                                    type="month"
                                                    value={exp.endDate === "Present" ? "" : exp.endDate}
                                                    disabled={exp.endDate === "Present"}
                                                    onChange={(e) =>
                                                        updateExperience(index, "endDate", e.target.value)
                                                    }
                                                    className="
        w-full rounded-lg border border-slate-300 bg-white px-3 py-2
        text-sm text-slate-900
        disabled:bg-slate-100 disabled:text-slate-400
        focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20
      "
                                                />

                                                {/* PRESENT CHECKBOX */}
                                                <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                                    <input
                                                        type="checkbox"
                                                        checked={exp.endDate === "Present"}
                                                        onChange={(e) =>
                                                            updateExperience(
                                                                index,
                                                                "endDate",
                                                                e.target.checked ? "Present" : ""
                                                            )
                                                        }
                                                        className="accent-[#1e3a8a]"
                                                    />
                                                    I currently work here
                                                </label>
                                            </div>
                                        </div>


                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">
                                                Responsibilities & Achievements
                                            </label>

                                            <textarea
                                                rows={4}
                                                value={exp.description}
                                                onChange={(e) =>
                                                    updateExperience(index, "description", e.target.value)
                                                }
                                                className="
            w-full rounded-lg border border-slate-300 p-3
            focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20
          "
                                            />

                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-500">
                                                    Use bullet points. Quantify impact.
                                                </span>

                                                <button
                                                    onClick={() => enhanceWithAI(index)}
                                                    className="text-[#1e3a8a] font-medium"
                                                >
                                                    Enhance with AI
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </SortableCard>

                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* ADD */}
            <button
                onClick={addExperience}
                className="rounded-lg border px-4 py-2 text-sm"
            >
                + Add another role
            </button>
        </section>
    );
}

/* ---------------- SORTABLE CARD ---------------- */
function SortableCard({
    id,
    children,
}: {
    id: string;
    children: (props: {
        setActivatorNodeRef: (el: HTMLElement | null) => void;
        listeners: any;
        attributes: any;
    }) => React.ReactNode;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
        >
            {children({ setActivatorNodeRef, listeners, attributes })}
        </div>
    );
}


/* ---------------- FIELD ---------------- */

function Field({ label, value, onChange }: any) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium">{label}</label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded border p-2"
            />
        </div>
    );
}

/* ---------------- MOCK AI ---------------- */

async function fakeAI(text: string): Promise<string> {
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve(
                text
                    .split("\n")
                    .map((line) =>
                        line.startsWith("•") ? line : `• ${line}`
                    )
                    .join("\n")
            );
        }, 1200)
    );
}
