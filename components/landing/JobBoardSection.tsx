import Link from "next/link";
import { MapPin, Clock, Banknote, ArrowRight, Briefcase, Sparkles } from "lucide-react";

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

const typeColors: Record<JobCard["type"], string> = {
    Remote: "bg-green-100 text-green-700",
    Hybrid: "bg-amber-100 text-amber-700",
    "On-site": "bg-blue-100 text-blue-700",
};

export default function JobBoardSection() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left — copy */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                            <Briefcase size={13} className="text-primary" />
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">
                                Job Board
                            </span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-5">
                            Browse &amp; Apply for{" "}
                            <span className="text-primary">Top Roles</span> — All in One Place
                        </h2>

                        <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-md">
                            Explore hundreds of open positions posted by verified recruiters.
                            Apply directly with your ResumeEZ profile — no copy-pasting
                            required.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {[
                                { icon: Sparkles, text: "AI matches jobs to your resume automatically" },
                                { icon: Briefcase, text: "One-click apply with your saved resume" },
                                { icon: ArrowRight, text: "Track all applications in your dashboard" },
                            ].map(({ icon: Icon, text }) => (
                                <li key={text} className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                                    <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Icon size={14} className="text-primary" />
                                    </span>
                                    {text}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-7 py-3.5 rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                        >
                            Browse Open Jobs
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* Right — mock job cards */}
                    <div className="flex flex-col gap-4">
                        {jobs.map((job) => (
                            <div
                                key={job.title}
                                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    {/* Logo + info */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-11 h-11 rounded-lg bg-primary flex items-center justify-center text-white font-black text-lg shrink-0">
                                            {job.logo}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">
                                                {job.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-0.5">{job.company}</p>
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                                    <MapPin size={11} />
                                                    {job.location}
                                                </span>
                                                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                                    <Banknote size={11} />
                                                    {job.salary}
                                                </span>
                                                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                                    <Clock size={11} />
                                                    {job.posted}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Type badge + apply */}
                                    <div className="flex flex-col items-end gap-3 shrink-0">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[job.type]}`}>
                                            {job.type}
                                        </span>
                                        <Link
                                            href="/login"
                                            className="text-xs font-bold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all"
                                        >
                                            Apply
                                        </Link>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5 mt-4">
                                    {job.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* View more nudge */}
                        <Link
                            href="/login"
                            className="text-center text-sm font-semibold text-primary hover:underline py-2"
                        >
                            + View 200 more open positions →
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
