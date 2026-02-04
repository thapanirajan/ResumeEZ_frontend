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

function renderBullets(text?: string) {
    if (!text) return null;

    return text
        .split("\n")
        .filter(Boolean)
        .map((line, i) => (
            <li key={i}>{line.replace(/^•\s*/, "")}</li>
        ));
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
                            <span className="underline">{resume.linkedin}</span>
                        </>
                    )}
                    {resume.github && resume.linkedin && " | "}
                    {resume.github && (
                        <>
                            GitHub:{" "}
                            <span className="underline">{resume.github}</span>
                        </>
                    )}
                </p>
            </header>

            {/* ================= SUMMARY ================= */}
            {resume.summary && (
                <>
                    <Section title="Summary">
                        <p>{resume.summary}</p>
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
                                <ul className="ml-5 list-disc">
                                    {renderBullets(exp.description)}
                                </ul>
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
                            {edu.honors && <p>{edu.honors}</p>}
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
            <h2 className="mt-4 font-bold uppercase">{title}</h2>
            <hr className="my-2" />
            {children}
        </>
    );
}
