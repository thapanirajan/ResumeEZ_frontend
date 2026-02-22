import { ResumeData } from "@/app/(candidate)/candidate/resume/type";



function formatDate(value?: string) {
    if (!value) return "";
    if (value === "Present") return "Present";

    const [year, month] = value.split("-");
    if (!year || !month) return value;

    return new Date(Number(year), Number(month) - 1).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
    });
}


export default function AtsResumePreview({
    resume,
}: {
    resume: ResumeData;
}) {
    return (
        <div className="font-sans text-sm leading-relaxed text-black">
            {/* ================= HEADER ================= */}
            <header className="mb-4">
                <h1 className="text-xl font-bold">{resume.name}</h1>

                {resume.title && <p>{resume.title}</p>}

                <p>
                    {[resume.email, resume.phone, resume.location]
                        .filter(Boolean)
                        .join(" | ")}
                </p>

                <p>
                    {resume.linkedin && (
                        <>
                            LinkedIn:{" "}
                            <a href={resume.linkedin} className="underline" target="_blank" rel="noreferrer">{resume.linkedin}</a>
                        </>
                    )}
                    {resume.github && resume.linkedin && " | "}
                    {resume.github && (
                        <>
                            GitHub:{" "}
                            <a href={resume.github} className="underline" target="_blank" rel="noreferrer">{resume.github}</a>
                        </>
                    )}
                </p>
            </header>

            {/* ================= SUMMARY ================= */}
            {resume.summary && (
                <>
                    <Section title="Summary">
                        <p className="text-justify">{resume.summary}</p>
                    </Section>
                </>
            )}

            {/* ================= EXPERIENCE ================= */}
            {resume.experience.length > 0 && (
                <Section title="Experience">
                    {resume.experience.map((exp, i) => (
                        <div key={i} className="mb-3">
                            <p className="font-semibold">
                                {exp.role}
                                {exp.company && ` – ${exp.company}`}
                            </p>

                            {(exp.startDate || exp.endDate) && (
                                <p className="italic">
                                    {formatDate(exp.startDate)} –{" "}
                                    {formatDate(exp.endDate)}
                                </p>
                            )}

                            {exp.description && (
                                <p className="text-justify">{exp.description}</p>
                            )}
                        </div>
                    ))}
                </Section>
            )}

            {/* ================= EDUCATION ================= */}
            {resume.education.length > 0 && (
                <Section title="Education">
                    {resume.education.map((edu, i) => (
                        <div key={i} className="mb-3">
                            <p className="font-semibold">
                                {edu.degree}
                                {edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}
                            </p>

                            <p>{edu.institution}</p>

                            {(edu.startDate || edu.endDate) && (
                                <p className="italic">
                                    {formatDate(edu.startDate)} –{" "}
                                    {formatDate(edu.endDate)}
                                </p>
                            )}

                            {edu.gpa && <p>GPA: {edu.gpa}</p>}
                            {edu.honors && <p className="text-justify">{edu.honors}</p>}
                        </div>
                    ))}
                </Section>
            )}
        </div>
    );
}

/* -------------------------------------------------- */
/* SECTION */
/* -------------------------------------------------- */

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <>
            <h2 className="mb-1 mt-4 font-bold uppercase">{title}</h2>
            <hr className="my-2" />
            {children}
        </>
    );
}
