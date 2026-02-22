import { ResumeData } from "@/app/(candidate)/candidate/resume/type";

export default function AtsModern({ resume }: { resume: ResumeData }) {
    return (
        <div className="font-sans text-[13.5px] leading-[1.65] text-black">
            {/* HEADER */}
            <header className="mb-6">
                <h1 className="text-[24px] font-semibold tracking-tight">
                    {resume.name}
                </h1>

                {resume.title && (
                    <p className="text-[#1e3a8a] font-medium">
                        {resume.title}
                    </p>
                )}

                <p className="mt-1 text-[12.5px]">
                    {[resume.email, resume.phone, resume.location]
                        .filter(Boolean)
                        .join(" • ")}
                </p>

                {(resume.linkedin || resume.github) && (
                    <p className="text-[12.5px]">
                        {resume.linkedin && <a href={resume.linkedin} target="_blank" rel="noreferrer">{resume.linkedin}</a>}
                        {resume.linkedin && resume.github && " • "}
                        {resume.github && <a href={resume.github} target="_blank" rel="noreferrer">{resume.github}</a>}
                    </p>
                )}
            </header>

            {resume.summary && (
                <Section title="Profile">
                    <p className="text-justify">{resume.summary}</p>
                </Section>
            )}

            {resume.experience?.length > 0 && (
                <Section title="Experience">
                    {resume.experience.map((e, i) => (
                        <div key={i} className="mb-4">
                            <div className="flex justify-between">
                                <p className="font-semibold">
                                    {e.role}
                                </p>
                                <span className="text-[12px] italic">
                                    {e.startDate} – {e.endDate}
                                </span>
                            </div>

                            {e.company && (
                                <p className="text-[12.5px] font-medium">
                                    {e.company}
                                </p>
                            )}

                            <p className="mt-1 text-justify">
                                {e.description}
                            </p>
                        </div>
                    ))}
                </Section>
            )}

            {resume.projects?.length > 0 && (
                <Section title="Projects">
                    {resume.projects.map((p, i) => (
                        <div key={i} className="mb-3">
                            <p className="font-semibold">
                                {p.name}
                            </p>

                            <p className="italic text-[12px]">
                                {p.techStack}
                            </p>

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

            {resume.education?.length > 0 && (
                <Section title="Education">
                    {resume.education.map((e, i) => (
                        <div key={i} className="mb-2">
                            <p className="font-semibold">
                                {e.degree}
                                {e.fieldOfStudy && `, ${e.fieldOfStudy}`}
                            </p>
                            <p className="text-[12.5px]">
                                {e.institution}
                            </p>
                            <p className="text-[12px] italic">
                                {e.startDate} – {e.endDate}
                            </p>
                        </div>
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
        <section className="mb-6">
            <h2 className="mb-1 border-b border-slate-300 pb-1 text-[13px] font-bold uppercase tracking-wide">
                {title}
            </h2>
            {children}
        </section>
    );
}
