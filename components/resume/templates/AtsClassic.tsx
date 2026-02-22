import { ResumeData } from "@/app/(candidate)/candidate/resume/type";

export default function AtsClassic({ resume }: { resume: ResumeData }) {
    return (
        <div className="font-serif text-[14.5px] leading-[1.55] text-black">
            {/* ================= HEADER ================= */}
            <header className="mb-5 text-center">
                <h1 className="text-[22px] font-bold tracking-tight">
                    {resume.name}
                </h1>

                {resume.title && (
                    <p className="mt-0.5 text-[14px] font-medium">
                        {resume.title}
                    </p>
                )}

                <p className="mt-1 text-[12.5px]">
                    {[resume.email, resume.phone, resume.location]
                        .filter(Boolean)
                        .join(" • ")}
                </p>

                {(resume.linkedin || resume.github) && (
                    <p className="mt-0.5 text-[12.5px]">
                        {resume.linkedin && (
                            <>
                                LinkedIn:{" "}
                                <a href={resume.linkedin} target="_blank" rel="noreferrer">
                                    {resume.linkedin}
                                </a>
                            </>
                        )}
                        {resume.linkedin && resume.github && " • "}
                        {resume.github && (
                            <>
                                GitHub:{" "}
                                <a href={resume.github} target="_blank" rel="noreferrer">
                                    {resume.github}
                                </a>
                            </>
                        )}
                    </p>
                )}
            </header>

            {/* ================= SUMMARY ================= */}
            {resume.summary && (
                <Section title="Professional Summary">
                    <p className="text-justify">{resume.summary}</p>
                </Section>
            )}

            {/* ================= EXPERIENCE ================= */}
            {resume.experience?.length > 0 && (
                <Section title="Experience">
                    {resume.experience.map((e, i) => (
                        <div key={i} className="mb-3">
                            <div className="flex justify-between">
                                <p className="font-semibold">
                                    {e.role}
                                    {e.company && `, ${e.company}`}
                                </p>

                                {(e.startDate || e.endDate) && (
                                    <span className="text-[12px] italic">
                                        {e.startDate} – {e.endDate}
                                    </span>
                                )}
                            </div>

                            {e.description && (
                                <p className="mt-0.5 text-justify">
                                    {e.description}
                                </p>
                            )}
                        </div>
                    ))}
                </Section>
            )}

            {/* ================= PROJECTS ================= */}
            {resume.projects?.length > 0 && (
                <Section title="Projects">
                    {resume.projects.map((p, i) => (
                        <div key={i} className="mb-2">
                            <p className="font-semibold">
                                {p.name}
                                {p.role && ` — ${p.role}`}
                            </p>

                            {p.techStack && (
                                <p className="italic text-[12px]">
                                    {p.techStack}
                                </p>
                            )}

                            <p className="mt-0.5 text-justify">
                                {p.description}
                            </p>

                            {(p.liveUrl || p.githubUrl) && (
                                <p className="mt-0.5 text-[12px]">
                                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer">Live: {p.liveUrl}</a>}
                                    {p.liveUrl && p.githubUrl && " • "}
                                    {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer">GitHub: {p.githubUrl}</a>}
                                </p>
                            )}
                        </div>
                    ))}
                </Section>
            )}

            {/* ================= SKILLS ================= */}
            {resume.skills?.length > 0 && (
                <Section title="Skills">
                    <div className="space-y-1">
                        {resume.skills.map((s, i) => (
                            <p key={i}>
                                <span className="font-semibold">{s.category}:</span>{" "}
                                {s.items}
                            </p>
                        ))}
                    </div>
                </Section>
            )}

            {/* ================= EDUCATION ================= */}
            {resume.education?.length > 0 && (
                <Section title="Education">
                    {resume.education.map((e, i) => (
                        <div key={i} className="mb-2">
                            <div className="flex justify-between">
                                <p className="font-semibold">
                                    {e.degree}
                                    {e.fieldOfStudy && `, ${e.fieldOfStudy}`}
                                </p>

                                {(e.startDate || e.endDate) && (
                                    <span className="text-[12px] italic">
                                        {e.startDate} – {e.endDate}
                                    </span>
                                )}
                            </div>

                            <p>{e.institution}</p>

                            {e.gpa && (
                                <p className="text-[12.5px]">
                                    GPA: {e.gpa}
                                </p>
                            )}

                            {e.honors && (
                                <p className="text-[12.5px] text-justify">
                                    {e.honors}
                                </p>
                            )}
                        </div>
                    ))}
                </Section>
            )}
        </div>
    );
}

/* ================= SECTION ================= */

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="mb-4">
            <h2 className="mb-1 border-b border-black pb-1 text-[13px] font-bold uppercase tracking-wide">
                {title}
            </h2>
            {children}
        </section>
    );
}
