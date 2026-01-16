import { Job } from "../types";
import StatusBadge from "./StatusBadge";

export default function JobTable({
    jobs,
    onView,
    onEdit,
    onDelete,
}: any) {
    return (
        <div className="bg-white border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left">Title</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">JD</th>
                        <th className="px-4 py-3">Resumes</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((job: Job) => (
                        <tr key={job.id} className="border-t">
                            <td className="px-4 py-3 font-medium">{job.title}</td>
                            <td className="px-4 py-3">
                                <StatusBadge status={job.status} />
                            </td>
                            <td className="px-4 py-3">{job.jdType}</td>
                            <td className="px-4 py-3">{job.resumeCount}</td>
                            <td className="px-4 py-3 text-right space-x-2">
                                <button onClick={() => onView(job)}>View</button>
                                <button
                                    className="text-blue-600"
                                    onClick={() => onEdit(job)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="text-red-600"
                                    onClick={() => onDelete(job)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {jobs.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center py-6 text-gray-500">
                                No jobs found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
