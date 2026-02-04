import { ResumeData } from "@/app/(candidate)/candidate/resume/type";


export default function AtsModern({
    resume,
}: {
    resume: ResumeData;
}) {
    return (
        <div className="text-sm leading-relaxed text-black font-sans">
            <header className="mb-4">
                <h1 className="text-2xl font-semibold">{resume.name}</h1>

                {resume.title && (
                    <p className="font-medium text-[#1e3a8a]">
                        {resume.title}
                    </p>
                )}

                <p className="mt-1">
                    {[resume.email, resume.phone, resume.location]
                        .filter(Boolean)
                        .join(" | ")}
                </p>

                {(resume.linkedin || resume.github) && (
                    <p className="mt-1">
                        {resume.linkedin && (
                            <>
                                LinkedIn:{" "}
                                <span className="underline">
                                    {resume.linkedin}
                                </span>
                            </>
                        )}
                        {resume.linkedin && resume.github && " | "}
                        {resume.github && (
                            <>
                                GitHub:{" "}
                                <span className="underline">
                                    {resume.github}
                                </span>
                            </>
                        )}
                    </p>
                )}
            </header>

            {resume.summary && (
                <Section title="Summary">
                    <p>{resume.summary}</p>
                </Section>
            )}

            {resume.experience.length > 0 && (
                <Section title="Experience">
                    {resume.experience.map((e, i) => (
                        <div key={i} className="mb-3">
                            <p className="font-medium">
                                {e.role}
                                {e.company && ` – ${e.company}`}
                            </p>

                            {(e.startDate || e.endDate) && (
                                <p className="italic text-xs">
                                    {e.startDate} – {e.endDate}
                                </p>
                            )}

                            {e.description && <p>{e.description}</p>}
                        </div>
                    ))}
                </Section>
            )}

            {resume.education.length > 0 && (
                <Section title="Education">
                    {resume.education.map((e, i) => (
                        <div key={i} className="mb-3">
                            <p className="font-medium">
                                {e.degree}
                                {e.fieldOfStudy && `, ${e.fieldOfStudy}`}
                            </p>

                            <p>{e.institution}</p>

                            {(e.startDate || e.endDate) && (
                                <p className="italic text-xs">
                                    {e.startDate} – {e.endDate}
                                </p>
                            )}

                            {e.gpa && <p>GPA: {e.gpa}</p>}
                            {e.honors && <p>{e.honors}</p>}
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
        <>
            <h2 className="mt-4 font-bold uppercase text-[#1e3a8a]">
                {title}
            </h2>
            <hr className="my-2" />
            {children}
        </>
    );
}
