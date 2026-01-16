export default function StatusBadge({ status }: { status: string }) {
    const colors: any = {
        DRAFT: "bg-gray-200 text-gray-700",
        ACTIVE: "bg-green-100 text-green-700",
        CLOSED: "bg-red-100 text-red-700",
    };

    return (
        <span className={`px-2 py-1 text-xs rounded ${colors[status]}`}>
            {status}
        </span>
    );
}
