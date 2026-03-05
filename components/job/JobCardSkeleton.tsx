export default function JobCardSkeleton() {
    return (
        <div className="border border-slate-200/70 bg-white rounded-2xl p-5 sm:p-7 animate-pulse">
            {/* Top row: icon + title + badge */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
                    <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-100 rounded w-48" />
                        <div className="h-3 bg-slate-100 rounded w-28" />
                    </div>
                </div>
                <div className="h-5 w-14 bg-slate-100 rounded-full shrink-0" />
            </div>

            {/* Description lines */}
            <div className="space-y-2 mb-4">
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-3/4" />
            </div>

            {/* Meta row */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                    <div className="h-3 bg-slate-100 rounded w-16" />
                    <div className="h-3 bg-slate-100 rounded w-16" />
                    <div className="h-3 bg-slate-100 rounded w-16" />
                </div>
                <div className="h-8 w-16 bg-slate-100 rounded-lg" />
            </div>
        </div>
    )
}

export function JobFeedSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="flex flex-col space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <JobCardSkeleton key={i} />
            ))}
        </div>
    )
}
