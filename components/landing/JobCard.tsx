import Image from "next/image";

export type JobCardProps = {
    logo: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    typeIcon: string;
    posted: string;
    matchLabel: string;
    matchColor: string;
    highlightContent: React.ReactNode;
    featured?: boolean;
    borderStyle?: string;
};

export default function JobCard({
    logo,
    title,
    company,
    location,
    salary,
    type,
    typeIcon,
    posted,
    matchLabel,
    matchColor,
    highlightContent,
    featured = false,
    borderStyle = "border border-slate-200 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5",
}: JobCardProps) {
    return (
        <div
            className={`group relative bg-white rounded-lg ${borderStyle} transition-all duration-300 overflow-hidden`}
            style={{ isolation: "isolate" }}
        >
            <div className="p-6 flex gap-6">
                <Image
                    src={logo}
                    alt={`${company} logo`}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-lg object-cover bg-slate-100 p-2"
                />
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-lg font-bold group-hover:text-primary transition-colors">
                                {title}
                            </h2>
                            {featured && (
                                <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded">
                                    Featured
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                            <span className={`text-xs font-bold ${matchColor} px-2 py-1 rounded`}>
                                {matchLabel}
                            </span>
                            <button className="text-slate-400 hover:text-primary transition-colors">
                                <span className="material-icons-round">bookmark_border</span>
                            </button>
                        </div>
                    </div>

                    <p className="text-sm font-bold text-slate-600 mb-4">
                        {company} •{" "}
                        <span className="text-slate-400 font-medium">{location}</span>
                    </p>

                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-1.5 text-slate-500">
                            <span className="material-icons-round text-sm">payments</span>
                            <span className="text-xs font-bold">{salary}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                            <span className="material-icons-round text-sm">{typeIcon}</span>
                            <span className="text-xs font-bold">{type}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                            <span className="material-icons-round text-sm">history</span>
                            <span className="text-xs font-bold">{posted}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Preview Overlay */}
            <div className="preview-overlay absolute inset-0 bg-white/95 p-6 opacity-0 translate-y-4 transition-all duration-300 flex flex-col justify-between pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                        <span className="material-icons-round text-sm">info</span>
                        Job Highlights
                    </h4>
                    {highlightContent}
                </div>
                <div className="flex gap-3 mt-4">
                    <button className="flex-1 bg-primary text-white py-2.5 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors">
                        Apply Now
                    </button>
                    <button className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors">
                        Full Details
                    </button>
                </div>
            </div>
        </div>
    );
}