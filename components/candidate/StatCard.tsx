type StatCardProps = {
    title: string;
    value: string;
    description?: string;
};

export default function StatCard({ title, value, description }: StatCardProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
            {description && (
                <p className="mt-2 text-sm text-gray-500">{description}</p>
            )}
        </div>
    );
}
