import { Sparkles, Radar, Map, CloudUpload, TrendingUp, Download } from 'lucide-react';

const features = [
    {
        icon: <Sparkles className="h-6 w-6 text-blue-600" />,
        title: 'AI Resume Enhancement',
        description: 'Upload your resume and receive improvements instantly.',
    },
    {
        icon: <Radar className="h-6 w-6 text-blue-600" />,
        title: 'Skill Gap Analysis',
        description: 'Compare your skills with real job descriptions and see missing areas.',
    },
    {
        icon: <Map className="h-6 w-6 text-blue-600" />,
        title: 'AI Learning Roadmap',
        description: 'Personalized upskilling plans to improve employability.',
    },
    {
        icon: <CloudUpload className="h-6 w-6 text-blue-600" />,
        title: 'Bulk HR Upload',
        description: 'HR can upload hundreds of resumes at once and evaluate instantly.',
    },
    {
        icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
        title: 'AI Candidate Ranking & Scoring',
        description: 'Automatically score and rank candidates for best fit.',
    },
    {
        icon: <Download className="h-6 w-6 text-blue-600" />,
        title: 'Shortlist & Export',
        description: 'Export filtered and shortlisted candidates with a single click.',
    },
];

export default function Features() {
    return (
        <section id="features" className="py-20 md:py-28 bg-[#f2f7fc]">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
                        Powerful AI Features
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Designed for Candidates and HR Teams
                    </p>
                </div>
                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <div key={feature.title} className="transform transition-transform duration-300 hover:-translate-y-2 bg-[#ffffff]
                        p-8 rounded-lg border border-slate-200">
                            <div className="flex flex-row items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                    {feature.icon}
                                </div>
                                <div>
                                    <div className="font-bold text-lg">{feature.title}</div>
                                </div>
                            </div>
                            <div className=" pt-4 text-slate-600">
                                {feature.description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
