import PublicResumeBuilder from "@/components/resume/PublicResumeBuilder";

export const metadata = {
    title: "Free Resume Builder | ResumeEZ",
    description: "Build a professional, ATS-friendly resume for free. No sign-up required. Export to PDF instantly.",
};

export default function ResumeBuilderPage() {
    return <PublicResumeBuilder />;
}
