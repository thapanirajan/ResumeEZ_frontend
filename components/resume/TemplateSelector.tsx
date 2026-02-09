import { ResumeTemplate, TEMPLATE_LABELS } from "./templates";

export default function TemplateSelector({
    value,
    onChange,
}: {
    value: ResumeTemplate;
    onChange: (t: ResumeTemplate) => void;
}) {
    return (
        <div className="space-y-2">
            <h3 className="text-sm font-medium">Template</h3>
            <div className="flex gap-2">
                {(Object.keys(TEMPLATE_LABELS) as ResumeTemplate[]).map(
                    (t) => (
                        <button
                            key={t}
                            onClick={() => onChange(t)}
                            className={`
                                rounded-lg px-3 py-1.5 text-sm 
                                ${value === t
                                    ? "bg-[#1e3a8a] text-white"
                                    : "border text-slate-700"
                                }
                            `}
                        >
                            {TEMPLATE_LABELS[t]}
                        </button>
                    )
                )}
            </div>
        </div>
    );
}
