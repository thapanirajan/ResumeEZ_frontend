export default function JobFilters({
    search,
    setSearch,
    status,
    setStatus,
    jdType,
    setJdType,
}: any) {
    return (
        <div className="flex gap-3">
            <input
                placeholder="Search by title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-2 rounded w-64"
            />

            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border px-3 py-2 rounded"
            >
                <option value="">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="CLOSED">Closed</option>
            </select>

            <select
                value={jdType}
                onChange={(e) => setJdType(e.target.value)}
                className="border px-3 py-2 rounded"
            >
                <option value="">All JD Types</option>
                <option value="TEXT">Text</option>
                <option value="FILE">File</option>
            </select>
        </div>
    );
}
