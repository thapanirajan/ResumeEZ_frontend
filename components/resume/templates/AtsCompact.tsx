import { ResumeData } from "@/app/(candidate)/candidate/resume/type";

export default function AtsCompact({ resume }: { resume: ResumeData }) {
    return (
        <div className="font-sans text-[12px] leading-[1.4] text-black">
            {/* HEADER */}
            <header className="mb-2">
                <h1 className="text-[17px] font-bold leading-tight">
                    {resume.name}
                </h1>

                <p className="text-[11.5px]">
                    {[resume.title, resume.email, resume.phone, resume.location]
                        .filter(Boolean)
                        .join(" | ")}
                </p>

                {(resume.linkedin || resume.github) && (
                    <p className="text-[11.5px]">
                        {resume.linkedin && resume.linkedin}
                        {resume.linkedin && resume.github && " | "}
                        {resume.github && resume.github}
                    </p>
                )}
            </header>

            {resume.summary && (
                <Section title="Summary">
                    <p>{resume.summary}</p>
                </Section>
            )}

            {resume.experience?.length > 0 && (
                <Section title="Experience">
                    {resume.experience.map((e, i) => (
                        <div key={i} className="mb-1.5">
                            <p className="font-semibold">
                                {e.role}
                                {e.company && `, ${e.company}`}
                                <span className="ml-1 italic font-normal">
                                    ({e.startDate}–{e.endDate})
                                </span>
                            </p>
                            <p>{e.description}</p>
                        </div>
                    ))}
                </Section>
            )}

            {resume.projects?.length > 0 && (
                <Section title="Projects">
                    {resume.projects.map((p, i) => (
                        <div key={i} className="mb-1.5">
                            <p className="font-semibold">
                                {p.name}
                                {p.role && ` — ${p.role}`}
                            </p>
                            <p className="italic text-[11px]">
                                {p.techStack}
                            </p>
                            <p>{p.description}</p>
                        </div>
                    ))}
                </Section>
            )}

            {resume.education?.length > 0 && (
                <Section title="Education">
                    {resume.education.map((e, i) => (
                        <p key={i}>
                            <span className="font-semibold">
                                {e.degree}
                                {e.fieldOfStudy && `, ${e.fieldOfStudy}`}
                            </span>{" "}
                            – {e.institution} ({e.startDate}–{e.endDate})
                        </p>
                    ))}
                </Section>
            )}
        </div>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="mb-2">
            <h2 className="text-[11.5px] font-bold uppercase">
                {title}
            </h2>
            {children}
        </section>
    );
}
