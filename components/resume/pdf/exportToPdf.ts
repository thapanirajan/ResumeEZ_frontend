import type { ResumeData } from "@/app/(candidate)/candidate/resume/type";
import type { ResumeTemplate } from "../ResumeBuilder";

export async function exportToPdf(
    resume: ResumeData,
    template: ResumeTemplate
): Promise<void> {
    const { getResumePdfBlob } = await import("./ResumePdfDocument");

    const blob = await getResumePdfBlob(resume, template);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume.name || "resume"}.pdf`;
    a.click();

    URL.revokeObjectURL(url);
}
