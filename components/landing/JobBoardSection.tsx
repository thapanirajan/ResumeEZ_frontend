import Link from "next/link";
import { MapPin, Clock, Banknote, ArrowRight, Briefcase, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type JobCard = {
    title: string;
    company: string;
    location: string;
    type: "Remote" | "Hybrid" | "On-site";
    salary: string;
    tags: string[];
    posted: string;
    logo: string;
};

const jobs: JobCard[] = [
    {
        title: "Frontend Engineer",
        company: "Vercel",
        location: "San Francisco, CA",
        type: "Remote",
        salary: "$120k – $160k",
        tags: ["React", "TypeScript", "Next.js"],
        posted: "2h ago",
        logo: "V",
    },
    {
        title: "Product Designer",
        company: "Figma",
        location: "New York, NY",
        type: "Hybrid",
        salary: "$110k – $145k",
        tags: ["Figma", "UX Research", "Prototyping"],
        posted: "5h ago",
        logo: "F",
    },
    {
        title: "Backend Developer",
        company: "Stripe",
        location: "London, UK",
        type: "On-site",
        salary: "$130k – $170k",
        tags: ["Node.js", "PostgreSQL", "AWS"],
        posted: "1d ago",
        logo: "S",
    },
];

const typeBadgeVariant: Record<JobCard["type"], "success" | "warning" | "info"> = {
    Remote: "success",
    Hybrid: "warning",
    "On-site": "info",
};

export default function JobBoardSection() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left — copy */}
                    <div>
                        <Badge className="mb-5 gap-1.5">
                            <Briefcase size={11} />
                            Job Board
                        </Badge>

                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-5">
                            Browse &amp; Apply for{" "}
                            <span className="text-primary">Top Roles</span>
                            {" "}— All in One Place
                        </h2>

                        <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-md">
                            Explore hundreds of open positions posted by verified recruiters.
                            Apply directly with your ResumeEZ profile — no copy-pasting required.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {[
                                { icon: Sparkles, text: "AI matches jobs to your resume automatically" },
                                { icon: Briefcase, text: "One-click apply with your saved resume" },
                                { icon: ArrowRight, text: "Track all applications in your dashboard" },
                            ].map(({ icon: Icon, text }) => (
                                <li key={text} className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Icon size={15} className="text-primary" />
                                    </span>
                                    {text}
                                </li>
                            ))}
                        </ul>

                        <Button size="lg" asChild>
                            <Link href="/login">
                                Browse Open Jobs
                                <ArrowRight size={16} />
                            </Link>
                        </Button>
                    </div>

                    {/* Right — job cards */}
                    <div className="flex flex-col gap-3">
                        {jobs.map((job) => (
                            <Card
                                key={job.title}
                                className="border-slate-200 hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
                            >
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            {/* Logo */}
                                            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md shadow-primary/20">
                                                {job.logo}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">
                                                    {job.title}
                                                </h3>
                                                <p className="text-xs text-slate-400 mt-0.5 font-medium">{job.company}</p>
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                                        <MapPin size={10} /> {job.location}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                                        <Banknote size={10} /> {job.salary}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                                        <Clock size={10} /> {job.posted}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-3 shrink-0">
                                            <Badge variant={typeBadgeVariant[job.type]} className="text-[10px] font-bold">
                                                {job.type}
                                            </Badge>
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href="/login">Apply</Link>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                        {job.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="text-[10px] rounded-md px-2 py-0.5">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <Link
                            href="/login"
                            className="text-center text-sm font-semibold text-primary hover:underline py-2 transition-colors"
                        >
                            + View 200 more open positions →
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
