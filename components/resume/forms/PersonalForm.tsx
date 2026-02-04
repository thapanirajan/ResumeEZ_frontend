import { ResumeData } from "@/app/(candidate)/candidate/resume/type";

export default function PersonalForm({
    resume,
    setResume,
}: {
    resume: ResumeData;
    setResume: (r: ResumeData) => void;
}) {
    return (
        <section className="space-y-8">
            {/* SECTION HEADER */}
            <header>
                <h2 className="text-lg font-semibold text-slate-900">
                    Personal Information
                </h2>
                <p className="text-sm text-slate-500">
                    This information appears at the top of your resume.
                </p>
            </header>

            {/* IDENTITY */}
            <div className="space-y-4">
                <Field
                    label="Full Name"
                    value={resume.name}
                    placeholder="e.g. Ayush Sharma"
                    helper="Use the name recruiters know you by."
                    onChange={(v) => setResume({ ...resume, name: v })}
                />

                <Field
                    label="Professional Title"
                    value={resume.title}
                    placeholder="e.g. Frontend Developer"
                    helper="Your current or target role."
                    onChange={(v) => setResume({ ...resume, title: v })}
                />
            </div>

            {/* CONTACT */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                    label="Email"
                    value={resume.email}
                    placeholder="you@email.com"
                    type="email"
                    onChange={(v) => setResume({ ...resume, email: v })}
                />

                <Field
                    label="Phone"
                    value={resume.phone}
                    placeholder="+977 98XXXXXXXX"
                    type="tel"
                    onChange={(v) => setResume({ ...resume, phone: v })}
                />
            </div>

            {/* LOCATION */}
            <Field
                label="Location"
                value={resume.location}
                placeholder="Kathmandu, Nepal"
                helper="City and country is enough."
                onChange={(v) => setResume({ ...resume, location: v })}
            />
        </section>
    );
}
type FieldProps = {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    helper?: string;
    type?: string;
};

function Field({
    label,
    value,
    onChange,
    placeholder,
    helper,
    type = "text",
}: FieldProps) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
                {label}
            </label>

            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="
          w-full rounded-lg border border-slate-300 bg-white px-3 py-2
          text-sm text-slate-900
          focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20
        "
            />

            {helper && (
                <p className="text-xs text-slate-500">
                    {helper}
                </p>
            )}
        </div>
    );
}
