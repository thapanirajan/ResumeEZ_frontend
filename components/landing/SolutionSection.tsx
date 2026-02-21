import { GraduationCap, Briefcase, CheckCircle2, ArrowRight } from "lucide-react";
import { ElementType } from "react";

type SolutionCard = {
    Icon: ElementType;
    iconBg: string;
    title: string;
    features: string[];
    linkColor: string;
    checkColor: string;
};

const cards: SolutionCard[] = [
    {
        Icon: GraduationCap,
        iconBg: "bg-primary",
        title: "For Candidates",
        features: [
            "ATS-friendly modern resume builder",
            "AI-driven skill gap identification",
            "Automated learning & upskilling roadmap",
        ],
        linkColor: "text-primary",
        checkColor: "text-primary",
    },
    {
        Icon: Briefcase,
        iconBg: "bg-primary",
        title: "For Recruiters",
        features: [
            "Instant AI candidate scoring & ranking",
            "Smart matching against job descriptions",
            "Streamlined candidate management panel",
        ],
        linkColor: "text-primary",
        checkColor: "text-primary",
    },
];

export default function SolutionsSection() {
    return (
        <section id="features" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-black mb-4">
                        Tailored Solutions for Everyone
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Our platform bridges the gap between hiring needs and career
                        aspirations through precision AI modeling.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {cards.map((card) => {
                        const { Icon } = card;
                        return (
                            <div
                                key={card.title}
                                className="p-10 rounded-xl border border-slate-200 bg-[#F8FAFC] shadow-sm"
                            >
                                <div className={`w-14 h-14 ${card.iconBg} text-white rounded-lg flex items-center justify-center mb-6`}>
                                    <Icon size={28} />
                                </div>

                                <h3 className="text-2xl font-bold text-slate-800 mb-4">{card.title}</h3>

                                <ul className="space-y-4 text-slate-600">
                                    {card.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <CheckCircle2 size={18} className={`shrink-0 ${card.checkColor}`} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button className={`mt-8 ${card.linkColor} cursor-pointer font-bold flex items-center gap-1 hover:gap-2 transition-all`}>
                                    Learn more
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
