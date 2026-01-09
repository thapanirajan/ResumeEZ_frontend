import { Clock, Sparkles, Target } from "lucide-react";

const valueProps = [
    {
        icon: <Clock className="h-8 w-8 text-[#1E3A8A]" />,
        title: "Save Hours of Manual Review",
        description:
            "HR teams can analyze 300 resumes in minutes with AI scoring and ranking.",
    },
    {
        icon: <Sparkles className="h-8 w-8 text-[#1E3A8A]" />,
        title: "Instant Resume Improvements",
        description:
            "Candidates get detailed improvements, formatting fixes, and keyword suggestions.",
    },
    {
        icon: <Target className="h-8 w-8 text-[#1E3A8A]" />,
        title: "Better Hiring Decisions",
        description:
            "Data-driven analysis improves decision accuracy and reduces guesswork.",
    },
];

export default function WhyUs() {
    return (
        <section id="value-prop" className="py-20 md:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter text-[#0F172A] sm:text-4xl">
                        Why ResumeEZ?
                    </h2>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-3">
                    {valueProps.map((prop) => (
                        <div
                            key={prop.title}
                            className="
                flex flex-col items-center text-center
                border border-[#E5E7EB]
                bg-white
                py-8 px-4 rounded-lg
                shadow-sm
                hover:shadow-md hover:shadow-[#1E3A8A]/15
                transition-all duration-300
              "
                        >
                            <div className="flex flex-col items-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EFF6FF]">
                                    {prop.icon}
                                </div>

                                <div className="font-bold text-xl pb-4 text-[#0F172A]">
                                    {prop.title}
                                </div>
                            </div>

                            <p className="text-[#475569]">{prop.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
