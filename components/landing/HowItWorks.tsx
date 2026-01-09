import { UploadCloud, Cpu, BarChart2, CheckCircle2 } from "lucide-react";

const steps = [
    {
        stepNumber: 1,
        title: "Upload Resume & Job Description",
        description:
            "Simply upload your resume and the job posting you’re targeting.",
        icon: <UploadCloud className="h-8 w-8 text-[#1E3A8A]" />,
    },
    {
        stepNumber: 2,
        title: "AI Analyzes & Scores",
        description:
            "Our AI compares your resume with the job description using advanced matching.",
        icon: <Cpu className="h-8 w-8 text-[#1E3A8A]" />,
    },
    {
        stepNumber: 3,
        title: "Receive Suggestions & Ranking",
        description:
            "Get tailored improvement tips and your overall match score.",
        icon: <BarChart2 className="h-8 w-8 text-[#1E3A8A]" />,
    },
    {
        stepNumber: 4,
        title: "Improve & Apply Faster",
        description:
            "Update your resume quickly and boost your chances of getting shortlisted.",
        icon: <CheckCircle2 className="h-8 w-8 text-[#1E3A8A]" />,
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="font-headline text-4xl font-bold text-[#0F172A]">
                        How ResumeEZ Works
                    </h2>
                    <p className="mt-4 text-lg text-[#475569]">
                        Simplify your job application process with AI-powered insights.
                    </p>
                </div>

                <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
                    {steps.map((step) => (
                        <div
                            key={step.stepNumber}
                            className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm transition-transform duration-300 hover:shadow-md hover:-translate-y-1"
                        >
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#EFF6FF] mb-4">
                                {step.icon}
                            </div>

                            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                                {step.title}
                            </h3>
                            <p className="text-sm text-[#475569]">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
