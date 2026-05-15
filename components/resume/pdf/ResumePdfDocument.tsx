import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Link,
    pdf,
} from "@react-pdf/renderer";
import type { ResumeData } from "@/app/(candidate)/candidate/resume/type";
import type { ResumeTemplate } from "../ResumeBuilder";


const cl = StyleSheet.create({
    page: {
        fontFamily: "Times-Roman",
        fontSize: 11,
        lineHeight: 1.55,
        color: "#000000",
        paddingVertical: 30,
        paddingHorizontal: 40,
    },
    header: { alignItems: "center", marginBottom: 14 },
    name: { fontSize: 18, fontWeight: "bold" },
    subTitle: { fontSize: 11, marginTop: 2 },
    contact: { fontSize: 9.5, marginTop: 3 },
    sectionView: {
        borderBottomWidth: 1,
        borderBottomColor: "#000000",
        paddingBottom: 2,
        marginBottom: 5,
    },
    sectionText: { fontSize: 10, fontWeight: "bold", letterSpacing: 0.5 },
    sectionWrap: { marginBottom: 10 },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    bold: { fontWeight: "bold" },
    italic: { fontSize: 9, fontStyle: "italic" },
    body: { textAlign: "justify", marginTop: 2 },
    techStack: { fontSize: 9, fontStyle: "italic", marginTop: 1 },
    link: { color: "#000000" },
    projectLink: { fontSize: 9.5, marginTop: 2 },
    entryBlock: { marginBottom: 8 },
    skillRow: { marginBottom: 3 },
});

function ClassicPdf({ resume }: { resume: ResumeData }) {
    const contacts = [resume.email, resume.phone, resume.location]
        .filter(Boolean)
        .join(" • ");

    return (
        <Page size="A4" style={cl.page}>
            {/* HEADER */}
            <View style={cl.header}>
                <Text style={cl.name}>{resume.name}</Text>
                {!!resume.title && <Text style={cl.subTitle}>{resume.title}</Text>}
                {!!contacts && <Text style={cl.contact}>{contacts}</Text>}
                {(!!resume.linkedin || !!resume.github) && (
                    <Text style={cl.contact}>
                        {!!resume.linkedin && (
                            <Link src={resume.linkedin} style={cl.link}>
                                LinkedIn: {resume.linkedin}
                            </Link>
                        )}
                        {!!resume.linkedin && !!resume.github && <Text> • </Text>}
                        {!!resume.github && (
                            <Link src={resume.github} style={cl.link}>
                                GitHub: {resume.github}
                            </Link>
                        )}
                    </Text>
                )}
            </View>

            {/* SUMMARY */}
            {!!resume.summary && (
                <View style={cl.sectionWrap}>
                    <View style={cl.sectionView}>
                        <Text style={cl.sectionText}>PROFESSIONAL SUMMARY</Text>
                    </View>
                    <Text style={cl.body}>{resume.summary}</Text>
                </View>
            )}

            {/* EXPERIENCE */}
            {(resume.experience?.length ?? 0) > 0 && (
                <View style={cl.sectionWrap}>
                    <View style={cl.sectionView}>
                        <Text style={cl.sectionText}>EXPERIENCE</Text>
                    </View>
                    {resume.experience.map((e, i) => (
                        <View key={i} style={cl.entryBlock}>
                            <View style={cl.row}>
                                <Text style={cl.bold}>
                                    {e.role}
                                    {e.company ? `, ${e.company}` : ""}
                                </Text>
                                {(e.startDate || e.endDate) && (
                                    <Text style={cl.italic}>
                                        {e.startDate} – {e.endDate}
                                    </Text>
                                )}
                            </View>
                            {!!e.description && (
                                <Text style={cl.body}>{e.description}</Text>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* PROJECTS */}
            {(resume.projects?.length ?? 0) > 0 && (
                <View style={cl.sectionWrap}>
                    <View style={cl.sectionView}>
                        <Text style={cl.sectionText}>PROJECTS</Text>
                    </View>
                    {resume.projects.map((p, i) => (
                        <View key={i} style={cl.entryBlock}>
                            <Text style={cl.bold}>
                                {p.name}
                                {p.role ? ` — ${p.role}` : ""}
                            </Text>
                            {!!p.techStack && (
                                <Text style={cl.techStack}>{p.techStack}</Text>
                            )}
                            {!!p.description && (
                                <Text style={cl.body}>{p.description}</Text>
                            )}
                            {(!!p.liveUrl || !!p.githubUrl) && (
                                <Text style={cl.projectLink}>
                                    {!!p.liveUrl && (
                                        <Link src={p.liveUrl} style={cl.link}>
                                            Live: {p.liveUrl}
                                        </Link>
                                    )}
                                    {!!p.liveUrl && !!p.githubUrl && <Text> • </Text>}
                                    {!!p.githubUrl && (
                                        <Link src={p.githubUrl} style={cl.link}>
                                            GitHub: {p.githubUrl}
                                        </Link>
                                    )}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* SKILLS */}
            {(resume.skills?.length ?? 0) > 0 && (
                <View style={cl.sectionWrap}>
                    <View style={cl.sectionView}>
                        <Text style={cl.sectionText}>SKILLS</Text>
                    </View>
                    {resume.skills.map((s, i) => (
                        <Text key={i} style={cl.skillRow}>
                            <Text style={cl.bold}>{s.category}: </Text>
                            <Text>{s.items}</Text>
                        </Text>
                    ))}
                </View>
            )}

            {/* EDUCATION */}
            {(resume.education?.length ?? 0) > 0 && (
                <View style={cl.sectionWrap}>
                    <View style={cl.sectionView}>
                        <Text style={cl.sectionText}>EDUCATION</Text>
                    </View>
                    {resume.education.map((e, i) => (
                        <View key={i} style={cl.entryBlock}>
                            <View style={cl.row}>
                                <Text style={cl.bold}>
                                    {e.degree}
                                    {e.fieldOfStudy ? `, ${e.fieldOfStudy}` : ""}
                                </Text>
                                {(e.startDate || e.endDate) && (
                                    <Text style={cl.italic}>
                                        {e.startDate} – {e.endDate}
                                    </Text>
                                )}
                            </View>
                            <Text>{e.institution}</Text>
                            {!!e.gpa && <Text style={{ fontSize: 9.5 }}>GPA: {e.gpa}</Text>}
                            {!!e.honors && (
                                <Text style={{ fontSize: 9.5, textAlign: "justify" }}>
                                    {e.honors}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>
            )}
        </Page>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODERN  –  Helvetica · left-aligned · blue title · slate border
// ═══════════════════════════════════════════════════════════════════════════════

const mo = StyleSheet.create({
    page: {
        fontFamily: "Helvetica",
        fontSize: 10.5,
        lineHeight: 1.65,
        color: "#000000",
        paddingVertical: 30,
        paddingHorizontal: 40,
    },
    name: { fontSize: 19, fontWeight: "bold" },
    subTitle: { fontSize: 11, color: "#1e3a8a", marginTop: 2 },
    contact: { fontSize: 10, marginTop: 3 },
    sectionWrap: { marginBottom: 18 },
    sectionView: {
        borderBottomWidth: 0.75,
        borderBottomColor: "#cbd5e1",
        paddingBottom: 2,
        marginBottom: 5,
    },
    sectionText: { fontSize: 10, fontWeight: "bold", letterSpacing: 0.5 },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    bold: { fontWeight: "bold" },
    italic: { fontSize: 9, fontStyle: "italic" },
    body: { textAlign: "justify", marginTop: 4 },
    techStack: { fontSize: 9, fontStyle: "italic", marginTop: 1 },
    link: { color: "#1e3a8a" },
    projectLink: { fontSize: 10, marginTop: 2 },
    entryBlock: { marginBottom: 10 },
    companyLine: { fontSize: 10, fontWeight: "bold", marginTop: 1 },
    skillRow: { marginBottom: 3 },
});

function ModernPdf({ resume }: { resume: ResumeData }) {
    const contacts = [resume.email, resume.phone, resume.location]
        .filter(Boolean)
        .join(" • ");

    return (
        <Page size="A4" style={mo.page}>
            {/* HEADER */}
            <View style={{ marginBottom: 18 }}>
                <Text style={mo.name}>{resume.name}</Text>
                {!!resume.title && <Text style={mo.subTitle}>{resume.title}</Text>}
                {!!contacts && <Text style={mo.contact}>{contacts}</Text>}
                {(!!resume.linkedin || !!resume.github) && (
                    <Text style={mo.contact}>
                        {!!resume.linkedin && (
                            <Link src={resume.linkedin} style={mo.link}>
                                {resume.linkedin}
                            </Link>
                        )}
                        {!!resume.linkedin && !!resume.github && <Text> • </Text>}
                        {!!resume.github && (
                            <Link src={resume.github} style={mo.link}>
                                {resume.github}
                            </Link>
                        )}
                    </Text>
                )}
            </View>

            {/* SUMMARY */}
            {!!resume.summary && (
                <View style={mo.sectionWrap}>
                    <View style={mo.sectionView}>
                        <Text style={mo.sectionText}>PROFILE</Text>
                    </View>
                    <Text style={mo.body}>{resume.summary}</Text>
                </View>
            )}

            {/* EXPERIENCE */}
            {(resume.experience?.length ?? 0) > 0 && (
                <View style={mo.sectionWrap}>
                    <View style={mo.sectionView}>
                        <Text style={mo.sectionText}>EXPERIENCE</Text>
                    </View>
                    {resume.experience.map((e, i) => (
                        <View key={i} style={mo.entryBlock}>
                            <View style={mo.row}>
                                <Text style={mo.bold}>{e.role}</Text>
                                {(e.startDate || e.endDate) && (
                                    <Text style={mo.italic}>
                                        {e.startDate} – {e.endDate}
                                    </Text>
                                )}
                            </View>
                            {!!e.company && (
                                <Text style={mo.companyLine}>{e.company}</Text>
                            )}
                            {!!e.description && (
                                <Text style={mo.body}>{e.description}</Text>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* PROJECTS */}
            {(resume.projects?.length ?? 0) > 0 && (
                <View style={mo.sectionWrap}>
                    <View style={mo.sectionView}>
                        <Text style={mo.sectionText}>PROJECTS</Text>
                    </View>
                    {resume.projects.map((p, i) => (
                        <View key={i} style={mo.entryBlock}>
                            <Text style={mo.bold}>{p.name}</Text>
                            {!!p.techStack && (
                                <Text style={mo.techStack}>{p.techStack}</Text>
                            )}
                            {!!p.description && (
                                <Text style={mo.body}>{p.description}</Text>
                            )}
                            {(!!p.liveUrl || !!p.githubUrl) && (
                                <Text style={mo.projectLink}>
                                    {!!p.liveUrl && (
                                        <Link src={p.liveUrl} style={mo.link}>
                                            Live: {p.liveUrl}
                                        </Link>
                                    )}
                                    {!!p.liveUrl && !!p.githubUrl && <Text> • </Text>}
                                    {!!p.githubUrl && (
                                        <Link src={p.githubUrl} style={mo.link}>
                                            GitHub: {p.githubUrl}
                                        </Link>
                                    )}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* SKILLS */}
            {(resume.skills?.length ?? 0) > 0 && (
                <View style={mo.sectionWrap}>
                    <View style={mo.sectionView}>
                        <Text style={mo.sectionText}>SKILLS</Text>
                    </View>
                    {resume.skills.map((s, i) => (
                        <Text key={i} style={mo.skillRow}>
                            <Text style={mo.bold}>{s.category}: </Text>
                            <Text>{s.items}</Text>
                        </Text>
                    ))}
                </View>
            )}

            {/* EDUCATION */}
            {(resume.education?.length ?? 0) > 0 && (
                <View style={mo.sectionWrap}>
                    <View style={mo.sectionView}>
                        <Text style={mo.sectionText}>EDUCATION</Text>
                    </View>
                    {resume.education.map((e, i) => (
                        <View key={i} style={mo.entryBlock}>
                            <Text style={mo.bold}>
                                {e.degree}
                                {e.fieldOfStudy ? `, ${e.fieldOfStudy}` : ""}
                            </Text>
                            <Text style={{ fontSize: 10, marginTop: 1 }}>
                                {e.institution}
                            </Text>
                            {(e.startDate || e.endDate) && (
                                <Text style={mo.italic}>
                                    {e.startDate} – {e.endDate}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>
            )}
        </Page>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPACT  –  Helvetica · dense layout · no section borders
// ═══════════════════════════════════════════════════════════════════════════════

const co = StyleSheet.create({
    page: {
        fontFamily: "Helvetica",
        fontSize: 9.5,
        lineHeight: 1.4,
        color: "#000000",
        paddingVertical: 25,
        paddingHorizontal: 35,
    },
    name: { fontSize: 14, fontWeight: "bold" },
    contact: { fontSize: 9, marginTop: 2 },
    sectionWrap: { marginBottom: 6 },
    sectionText: { fontSize: 9, fontWeight: "bold", marginBottom: 3 },
    bold: { fontWeight: "bold" },
    italic: { fontSize: 9, fontStyle: "italic" },
    body: { textAlign: "justify" },
    entryBlock: { marginBottom: 5 },
    techStack: { fontSize: 8.5, fontStyle: "italic" },
    link: { color: "#000000" },
});

function CompactPdf({ resume }: { resume: ResumeData }) {
    const headerLine = [resume.title, resume.email, resume.phone, resume.location]
        .filter(Boolean)
        .join(" | ");

    return (
        <Page size="A4" style={co.page}>
            {/* HEADER */}
            <View style={{ marginBottom: 6 }}>
                <Text style={co.name}>{resume.name}</Text>
                {!!headerLine && <Text style={co.contact}>{headerLine}</Text>}
                {(!!resume.linkedin || !!resume.github) && (
                    <Text style={co.contact}>
                        {!!resume.linkedin && (
                            <Link src={resume.linkedin} style={co.link}>
                                {resume.linkedin}
                            </Link>
                        )}
                        {!!resume.linkedin && !!resume.github && <Text> | </Text>}
                        {!!resume.github && (
                            <Link src={resume.github} style={co.link}>
                                {resume.github}
                            </Link>
                        )}
                    </Text>
                )}
            </View>

            {/* SUMMARY */}
            {!!resume.summary && (
                <View style={co.sectionWrap}>
                    <Text style={co.sectionText}>SUMMARY</Text>
                    <Text style={co.body}>{resume.summary}</Text>
                </View>
            )}

            {/* EXPERIENCE */}
            {(resume.experience?.length ?? 0) > 0 && (
                <View style={co.sectionWrap}>
                    <Text style={co.sectionText}>EXPERIENCE</Text>
                    {resume.experience.map((e, i) => (
                        <View key={i} style={co.entryBlock}>
                            <Text>
                                <Text style={co.bold}>
                                    {e.role}
                                    {e.company ? `, ${e.company}` : ""}
                                </Text>
                                {(e.startDate || e.endDate) && (
                                    <Text style={co.italic}>
                                        {" "}
                                        ({e.startDate}–{e.endDate})
                                    </Text>
                                )}
                            </Text>
                            {!!e.description && (
                                <Text style={co.body}>{e.description}</Text>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* PROJECTS */}
            {(resume.projects?.length ?? 0) > 0 && (
                <View style={co.sectionWrap}>
                    <Text style={co.sectionText}>PROJECTS</Text>
                    {resume.projects.map((p, i) => (
                        <View key={i} style={co.entryBlock}>
                            <Text style={co.bold}>
                                {p.name}
                                {p.role ? ` — ${p.role}` : ""}
                            </Text>
                            {!!p.techStack && (
                                <Text style={co.techStack}>{p.techStack}</Text>
                            )}
                            {!!p.description && (
                                <Text style={co.body}>{p.description}</Text>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* SKILLS */}
            {(resume.skills?.length ?? 0) > 0 && (
                <View style={co.sectionWrap}>
                    <Text style={co.sectionText}>SKILLS</Text>
                    {resume.skills.map((s, i) => (
                        <Text key={i}>
                            <Text style={co.bold}>{s.category}: </Text>
                            <Text>{s.items}</Text>
                        </Text>
                    ))}
                </View>
            )}

            {/* EDUCATION */}
            {(resume.education?.length ?? 0) > 0 && (
                <View style={co.sectionWrap}>
                    <Text style={co.sectionText}>EDUCATION</Text>
                    {resume.education.map((e, i) => (
                        <Text key={i} style={{ marginBottom: 2 }}>
                            <Text style={co.bold}>
                                {e.degree}
                                {e.fieldOfStudy ? `, ${e.fieldOfStudy}` : ""}
                            </Text>
                            <Text>
                                {" "}
                                – {e.institution} ({e.startDate}–{e.endDate})
                            </Text>
                        </Text>
                    ))}
                </View>
            )}
        </Page>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT DOCUMENT
// ═══════════════════════════════════════════════════════════════════════════════

function ResumePdfDocument({
    resume,
    template,
}: {
    resume: ResumeData;
    template: ResumeTemplate;
}) {
    return (
        <Document>
            {template === "modern" ? (
                <ModernPdf resume={resume} />
            ) : template === "compact" ? (
                <CompactPdf resume={resume} />
            ) : (
                <ClassicPdf resume={resume} />
            )}
        </Document>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT HELPER  –  called dynamically from exportToPdf.ts
// ═══════════════════════════════════════════════════════════════════════════════

export async function getResumePdfBlob(
    resume: ResumeData,
    template: ResumeTemplate
): Promise<Blob> {
    // Cast is required because TypeScript doesn't know our wrapper returns <Document>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return pdf(React.createElement(ResumePdfDocument, { resume, template }) as any).toBlob();
}
