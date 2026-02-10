import { useState } from "react";

export default function JobModal({
    type,
    job,
    onClose,
    onCreate,
    onUpdate,
    onDelete,
}: any) {
    const [title, setTitle] = useState(job?.title || "");
    const [status, setStatus] = useState(job?.status || "DRAFT");
    const [jdMode, setJdMode] = useState<"TEXT" | "FILE">(job?.jdType || "TEXT");
    const [jdText, setJdText] = useState(job?.jdText || "");
    const [fileName, setFileName] = useState(job?.jdFileName || "");

    function submit() {
        const payload = {
            title,
            status,
            jdType: jdMode,
            jdText: jdMode === "TEXT" ? jdText : undefined,
            jdFileName: jdMode === "FILE" ? fileName : undefined,
        };

        if (type === "create") onCreate(payload);
        if (type === "edit") onUpdate(job.id, payload);
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 w-full max-w-lg rounded">
                <h2 className="text-lg font-semibold mb-4 capitalize">
                    {type} Job
                </h2>

                {type === "delete" ? (
                    <>
                        <p className="mb-4">Delete this job permanently?</p>
                        <div className="flex justify-end gap-2">
                            <button onClick={onClose}>Cancel</button>
                            <button
                                onClick={() => onDelete(job.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <input
                            placeholder="Job Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={type === "view"}
                            className="border w-full px-3 py-2 rounded mb-3"
                        />

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            disabled={type === "view"}
                            className="border w-full px-3 py-2 rounded mb-3"
                        >
                            <option value="DRAFT">Draft</option>
                            <option value="ACTIVE">Active</option>
                            <option value="CLOSED">Closed</option>
                        </select>

                        <div className="flex gap-4 mb-2">
                            <label>
                                <input
                                    type="radio"
                                    checked={jdMode === "TEXT"}
                                    onChange={() => setJdMode("TEXT")}
                                    disabled={type === "view"}
                                />{" "}
                                Paste JD
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    checked={jdMode === "FILE"}
                                    onChange={() => setJdMode("FILE")}
                                    disabled={type === "view"}
                                />{" "}
                                Upload JD
                            </label>
                        </div>

                        {jdMode === "TEXT" ? (
                            <textarea
                                value={jdText}
                                onChange={(e) => setJdText(e.target.value)}
                                disabled={type === "view"}
                                className="border w-full px-3 py-2 rounded mb-3"
                                rows={4}
                            />
                        ) : (
                            <input
                                placeholder="JD file name (mock)"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                disabled={type === "view"}
                                className="border w-full px-3 py-2 rounded mb-3"
                            />
                        )}

                        <div className="flex justify-end gap-2">
                            <button onClick={onClose}>Cancel</button>
                            {type !== "view" && (
                                <button
                                    onClick={submit}
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
