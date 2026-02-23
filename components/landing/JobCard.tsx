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
    "Full Time": Briefcase,
    "Part Time": Clock,
    "Internship": GraduationCap,
    "Contract": FileText,
    "Remote": Laptop,
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
}: JobCardProps) {
    const TypeIcon = TYPE_ICONS[type] ?? Briefcase

    return (
        <div className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between gap-3 mb-3">
                {/* Icon + Title */}
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Building2 className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800 group-hover:text-primary transition-colors leading-snug">
                            {title}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {location}
                        </p>
                    </div>
                </div>

                {/* Status badge */}
                <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
                    {status}
                </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                {description}
            </p>

            {/* Meta row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Banknote className="w-3.5 h-3.5 text-slate-400" />
                        {salary}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <TypeIcon className="w-3.5 h-3.5 text-slate-400" />
                        {type}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {posted}
                    </span>
                </div>

                <a
                    href={`/job/${id}`}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0"
                >
                    View
                    <ChevronRight className="w-3.5 h-3.5" />
                </a>
            </div>
        </div>
    )
}
