import { ResumeData } from "@/app/(candidate)/candidate/resume/type";

export default function LinksForm({
    resume,
    setResume,
}: {
    resume: ResumeData;
    setResume: (r: ResumeData) => void;
}) {
    return (
        <section className="space-y-8">
            {/* HEADER */}
            <header>
                <h2 className="text-lg font-semibold text-slate-900">
                    Online Presence
                </h2>
                <p className="text-sm text-slate-500">
                    Add links recruiters can use to learn more about your work.
                </p>
            </header>

            {/* LINKS */}
            <div className="space-y-5">
                <LinkField
                    label="LinkedIn Profile"
                    value={resume.linkedin}
                    placeholder="https://linkedin.com/in/yourname"
                    helper="Required for most professional roles."
                    onChange={(v) => setResume({ ...resume, linkedin: normalizeUrl(v) })}
                />

                <LinkField
                    label="GitHub Profile"
                    value={resume.github}
                    placeholder="https://github.com/yourusername"
                    helper="Important for engineering and technical roles."
                    onChange={(v) => setResume({ ...resume, github: normalizeUrl(v) })}
                />
            </div>
        </section>
    );
}


type LinkFieldProps = {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    helper?: string;
};

function LinkField({
    label,
    value,
    onChange,
    placeholder,
    helper,
}: LinkFieldProps) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
                {label}
            </label>

            <input
                type="url"
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


// Ensures ATS-safe, clickable URLs
function normalizeUrl(value: string) {
    if (!value) return value;
    if (value.startsWith("http://") || value.startsWith("https://")) {
        return value;
    }
    return `https://${value}`;
}
