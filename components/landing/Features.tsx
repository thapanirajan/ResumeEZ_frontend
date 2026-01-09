import { Sparkles, Radar, Map, CloudUpload, TrendingUp, Download } from "lucide-react";

const features = [
    {
        icon: <Sparkles className="h-6 w-6 text-[#1E3A8A]" />,
        title: "AI Resume Enhancement",
        description: "Upload your resume and receive improvements instantly.",
    },
    {
        icon: <Radar className="h-6 w-6 text-[#1E3A8A]" />,
        title: "Skill Gap Analysis",
        description: "Compare your skills with real job descriptions and see missing areas.",
    },
    {
        icon: <Map className="h-6 w-6 text-[#1E3A8A]" />,
        title: "AI Learning Roadmap",
        description: "Personalized upskilling plans to improve employability.",
    },
    {
        icon: <CloudUpload className="h-6 w-6 text-[#1E3A8A]" />,
        title: "Bulk HR Upload",
        description: "HR can upload hundreds of resumes at once and evaluate instantly.",
    },
    {
        icon: <TrendingUp className="h-6 w-6 text-[#1E3A8A]" />,
        title: "AI Candidate Ranking & Scoring",
        description: "Automatically score and rank candidates for best fit.",
    },
    {
        icon: <Download className="h-6 w-6 text-[#1E3A8A]" />,
        title: "Shortlist & Export",
        description: "Export filtered and shortlisted candidates with a single click.",
    },
];

export default function Features() {
    return (
        <section id="features" className="py-20 md:py-28 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter text-[#0F172A] sm:text-4xl">
                        Powerful AI Features
                    </h2>
                    <p className="mt-4 text-lg text-[#475569]">
                        Designed for Candidates and HR Teams
                    </p>
                </div>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="
                transform transition-transform duration-300 hover:-translate-y-2
                bg-white border border-[#E5E7EB]
                p-8 rounded-lg
              "
                        >
                            <div className="flex flex-row items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EFF6FF]">
                                    {feature.icon}
                                </div>
                                <div>
                                    <div className="font-bold text-lg text-[#0F172A]">{feature.title}</div>
                                </div>
                            </div>
                            <div className="pt-4 text-[#475569]">{feature.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
