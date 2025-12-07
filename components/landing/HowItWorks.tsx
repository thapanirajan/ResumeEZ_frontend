import { Upload, Cpu, BarChart, CheckCircle } from 'lucide-react';

const steps = [
    {
        stepNumber: 1,
        title: 'Upload Resume & Job Description',
        description: 'Simply upload your resume and the job posting you’re targeting.',
        icon: <Upload className="h-8 w-8" />,
    },
    {
        stepNumber: 2,
        title: 'AI Analyzes & Scores',
        description: 'Our AI compares your resume with the job description using advanced matching.',
        icon: <Cpu className="h-8 w-8" />,
    },
    {
        stepNumber: 3,
        title: 'Receive Suggestions & Ranking',
        description: 'Get tailored improvement tips and your overall match score.',
        icon: <BarChart className="h-8 w-8" />,
    },
    {
        stepNumber: 4,
        title: 'Improve & Apply Faster',
        description: 'Update your resume quickly and boost your chances of getting shortlisted.',
        icon: <CheckCircle className="h-8 w-8" />,
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center mb-16">
                    <h2 className="font-headline text-4xl font-bold tracking-tight text-foreground">
                        How ResumeEZ Works
                    </h2>
                </div>

                <div className="relative">
                    <div className="grid gap-16 md:grid-cols-4">
                        {steps.map((step) => (
                            <div
                                className="relative flex flex-col items-center text-center p-4"
                                key={step.stepNumber}
                            >
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-500 shadow shadow-blue-200">
                                    {step.icon}
                                </div>

                                <h3 className="mt-6 text-xl font-semibold text-foreground">{step.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground max-w-[250px]">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
