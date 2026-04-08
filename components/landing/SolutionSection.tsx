import { GraduationCap, Briefcase, CheckCircle2, ArrowRight, Zap } from "lucide-react";
import { ElementType } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type SolutionCard = {
    Icon: ElementType;
    tag: string;
    title: string;
    description: string;
    features: string[];
    accent: string;
    iconBg: string;
};

const cards: SolutionCard[] = [
    {
        Icon: GraduationCap,
        tag: "Job Seekers",
        title: "For Candidates",
        description: "Stand out from the crowd with an AI-crafted resume that beats ATS filters and lands interviews.",
        features: [
            "ATS-friendly modern resume builder",
            "AI-driven skill gap identification",
            "Automated learning & upskilling roadmap",
        ],
        accent: "from-primary/5 to-blue-50",
        iconBg: "bg-primary text-white",
    },
    {
        Icon: Briefcase,
        tag: "Hiring Teams",
        title: "For Recruiters",
        description: "Cut through the noise. Find and rank the best candidates 10× faster with AI-powered screening.",
        features: [
            "Instant AI candidate scoring & ranking",
            "Smart matching against job descriptions",
            "Streamlined candidate management panel",
        ],
        accent: "from-slate-50 to-white",
        iconBg: "bg-primary text-white",
    },
];

export default function SolutionsSection() {
    return (
        <section id="features" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section header */}
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <Badge className="mb-4 gap-1.5">
                        <Zap size={11} />
                        Tailored for Everyone
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight">
                        One Platform. <span className="text-primary">Two Powerful</span> Experiences.
                    </h2>
                    <p className="text-slate-500 text-base leading-relaxed">
                        Our platform bridges the gap between hiring needs and career aspirations
                        through precision AI modeling.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {cards.map((card) => {
                        const { Icon } = card;
                        return (
                            <Card
                                key={card.title}
                                className={`overflow-hidden border-slate-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 bg-linear-to-br ${card.accent}`}
                            >
                                <CardContent className="p-8">
                                    {/* Icon + tag row */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-lg shadow-primary/20`}>
                                            <Icon size={26} />
                                        </div>
                                        <Badge variant="secondary" className="text-xs font-bold">
                                            {card.tag}
                                        </Badge>
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-900 mb-2">{card.title}</h3>
                                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">{card.description}</p>

                                    {/* Feature list */}
                                    <ul className="space-y-3 mb-8">
                                        {card.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3 text-slate-700 text-sm">
                                                <CheckCircle2 size={17} className="shrink-0 text-primary mt-0.5" />
                                                <span className="font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button variant="ghost" className="px-0 text-primary font-bold hover:bg-transparent hover:gap-3 group">
                                        Learn more
                                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
