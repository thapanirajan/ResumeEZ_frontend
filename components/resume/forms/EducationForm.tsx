import { ResumeData } from "@/app/(candidate)/candidate/resume/type";
import {
    DndContext,
    closestCenter,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";



export default function EducationForm({
    resume,
    setResume,
}: {
    resume: ResumeData;
    setResume: (r: ResumeData) => void;
}) {
    const addEducation = () => {
        setResume({
            ...resume,
            education: [
                ...resume.education,
                {
                    institution: "",
                    degree: "",
                    fieldOfStudy: "",
                    startDate: "",
                    endDate: "",
                    gpa: "",
                    honors: "",
                },
            ],
        });
    };

    const updateEducation = (
        index: number,
        field: string,
        value: string
    ) => {
        const updated = [...resume.education];
        updated[index] = { ...updated[index], [field]: value };
        setResume({ ...resume, education: updated });
    };

    const removeEducation = (index: number) => {
        setResume({
            ...resume,
            education: resume.education.filter((_, i) => i !== index),
        });
    };

    /* ---------------- AUTO SORT ---------------- */

    const autoSortByDate = () => {
        const sorted = [...resume.education].sort(
            (a, b) =>
                new Date(b.startDate || "1970").getTime() -
                new Date(a.startDate || "1970").getTime()
        );
        setResume({ ...resume, education: sorted });
    };

    /* ---------------- DRAG END ---------------- */

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = resume.education.findIndex(
            (_, i) => i.toString() === active.id
        );
        const newIndex = resume.education.findIndex(
            (_, i) => i.toString() === over.id
        );

        const reordered = [...resume.education];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);

        setResume({ ...resume, education: reordered });
    };

    return (
        <section className="space-y-8">
            {/* HEADER */}
            <header className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Education
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
                    items={resume.education.map((_, i) => i.toString())}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-6">
                        {resume.education.map((edu, index) => (
                            <SortableEducationCard
                                key={index}
                                id={index.toString()}
                            >
                                {({ setActivatorNodeRef, listeners, attributes }) => (
                                    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                                        {/* HEADER ROW */}
                                        <div className="flex items-center justify-between">
                                            <button
                                                ref={setActivatorNodeRef}
                                                {...listeners}
                                                {...attributes}
                                                type="button"
                                                className="cursor-grab text-xs text-slate-400 hover:text-slate-600"
                                            >
                                                ⋮⋮ Drag
                                            </button>

                                            <button
                                                onClick={() => removeEducation(index)}
                                                className="text-sm text-red-600 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <Field
                                            label="Institution"
                                            placeholder="e.g. Tribhuvan University"
                                            value={edu.institution}
                                            onChange={(v) =>
                                                updateEducation(index, "institution", v)
                                            }
                                        />

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <Field
                                                label="Degree"
                                                placeholder="e.g. Bachelor of Computer Science (BSc CSIT)"
                                                value={edu.degree}
                                                onChange={(v) =>
                                                    updateEducation(index, "degree", v)
                                                }
                                            />
                                            <Field
                                                label="Field of Study"
                                                placeholder="e.g. Computer Science & Information Technology"
                                                value={edu.fieldOfStudy}
                                                onChange={(v) =>
                                                    updateEducation(index, "fieldOfStudy", v)
                                                }
                                            />
                                        </div>

                                        {/* DATES */}
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <DateField
                                                label="Start Date"
                                                value={edu.startDate}
                                                onChange={(v) =>
                                                    updateEducation(index, "startDate", v)
                                                }
                                            />
                                            <DateField
                                                label="End Date"
                                                value={edu.endDate}
                                                onChange={(v) =>
                                                    updateEducation(index, "endDate", v)
                                                }
                                                allowPresent
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <Field
                                                label="GPA (optional)"
                                                value={edu.gpa}
                                                onChange={(v) =>
                                                    updateEducation(index, "gpa", v)
                                                }
                                            />
                                            <Field
                                                label="Honors (optional)"
                                                value={edu.honors}
                                                onChange={(v) =>
                                                    updateEducation(index, "honors", v)
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </SortableEducationCard>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* ADD */}
            <button
                onClick={addEducation}
                className="rounded-lg border px-4 py-2 text-sm"
            >
                + Add another education
            </button>
        </section>
    );
}



function SortableEducationCard({
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
        setNodeRef,
        setActivatorNodeRef,
        listeners,
        attributes,
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


function Field({ label, value, placeholder, onChange }: any) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium">{label}</label>
            <input
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-[#1e3a8a]/20"
            />
        </div>
    );
}

function DateField({
    label,
    value,
    onChange,
    allowPresent,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    allowPresent?: boolean;
}) {
    const isPresent = value === "Present";

    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium">{label}</label>

            <input
                type="month"
                disabled={isPresent}
                value={isPresent ? "" : value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border p-2 disabled:bg-slate-100"
            />

            {allowPresent && (
                <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                        type="checkbox"
                        checked={isPresent}
                        onChange={(e) =>
                            onChange(e.target.checked ? "Present" : "")
                        }
                        className="accent-[#1e3a8a]"
                    />
                    Currently studying
                </label>
            )}
        </div>
    );
}
