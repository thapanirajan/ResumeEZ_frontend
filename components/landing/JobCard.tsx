import {
    Building2,
    MapPin,
    Banknote,
    Briefcase,
    Clock,
    GraduationCap,
    FileText,
    Laptop,
    ChevronRight,
} from "lucide-react"

const TYPE_ICONS: Record<string, React.ElementType> = {
    "Full Time":  Briefcase,
    "Part Time":  Clock,
    "Internship": GraduationCap,
    "Contract":   FileText,
    "Remote":     Laptop,
}

function isNewJob(createdAt: string): boolean {
    return Date.now() - new Date(createdAt).getTime() < 3 * 24 * 60 * 60 * 1000
}

export type JobCardProps = {
    id: string
    title: string
    location: string
    salary: string
    type: string
    posted: string
    status: string
    statusColor: string
    description: string
    createdAt: string
    isSaved: boolean
    onToggleSave: () => void
}

export default function JobCard({
    id,
    title,
    location,
    salary,
    type,
    posted,
    status,
    statusColor,
    description,
    createdAt,
}: JobCardProps) {
    const TypeIcon = TYPE_ICONS[type] ?? Briefcase
    const showNew  = isNewJob(createdAt)

    return (
        <div className="group border border-slate-200/70 bg-white shadow-sm rounded-2xl p-5 sm:p-6 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            {/* Top row */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                    {/* Company icon placeholder */}
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/5 transition-colors">
                        <Building2 className="w-5 h-5 text-slate-400 group-hover:text-primary/60 transition-colors" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-base font-bold text-slate-800 group-hover:text-primary transition-colors leading-snug">
                                {title}
                            </h2>
                            {showNew && (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700">
                                    New
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {location}
                        </p>
                    </div>
                </div>

                {/* Right side: status badge + bookmark */}
                <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
                        {status}
                    </span>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                {description}
            </p>

            {/* Meta row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <Banknote className="w-3.5 h-3.5 text-slate-400" />
                        {salary}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <TypeIcon className="w-3.5 h-3.5 text-slate-400" />
                        {type}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {posted}
                    </span>
                </div>

                <a
                    href={`/candidate/job/${id}`}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors sm:w-auto w-full"
                >
                    View details
                    <ChevronRight className="w-3.5 h-3.5" />
                </a>
            </div>
        </div>
    )
}
