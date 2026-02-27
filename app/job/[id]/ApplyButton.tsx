"use client"

import { useState, useEffect, useRef } from "react"
import {
    FileText,
    X,
    Loader2,
    CheckCircle2,
    ChevronRight,
    AlertCircle,
    Plus,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/util/api"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

type Resume = {
    id: string
    title: string
    created_at: string
    updated_at: string | null
}

export default function ApplyButton({ jobId }: { jobId: string }) {
    const [open, setOpen] = useState(false)
    const [resumes, setResumes] = useState<Resume[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const backdropRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        setLoading(true)
        setSelectedId(null)
        api.get<Resume[]>("/api/resume")
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : (res.data as any).data ?? []
                setResumes(data)
            })
            .catch(() => toast.error("Failed to load resumes"))
            .finally(() => setLoading(false))
    }, [open])

    // Close on Escape
    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [open])

    async function handleApply() {
        if (!selectedId) return
        const selected = resumes.find((r) => r.id === selectedId)
        setSubmitting(true)
        try {
            await new Promise((r) => setTimeout(r, 600)) 
            toast.success(`Applied with "${selected?.title}"`)
            setOpen(false)
        } catch {
            toast.error("Failed to submit application")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            {/* Trigger */}
            <button
                onClick={() => setOpen(true)}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
            >
                Apply Now
            </button>

            {/* Modal */}
            {open && (
                <div
                    ref={backdropRef}
                    onClick={(e) => { if (e.target === backdropRef.current) setOpen(false) }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
                >
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-base font-bold text-slate-900">Select a Resume</h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Choose which resume to submit with your application
                                </p>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-4 max-h-72 overflow-y-auto">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <p className="text-sm">Loading your resumes…</p>
                                </div>
                            ) : resumes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                        <AlertCircle className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">No resumes found</p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            Create a resume first before applying.
                                        </p>
                                    </div>
                                    <Link
                                        href="/candidate/resume/create"
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Create a Resume
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {resumes.map((resume) => {
                                        const isSelected = selectedId === resume.id
                                        return (
                                            <button
                                                key={resume.id}
                                                type="button"
                                                onClick={() => setSelectedId(resume.id)}
                                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${
                                                    isSelected
                                                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                                                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                }`}
                                            >
                                                {/* File icon */}
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                                    isSelected ? "bg-primary/10" : "bg-slate-100"
                                                }`}>
                                                    <FileText className={`w-4 h-4 ${isSelected ? "text-primary" : "text-slate-400"}`} />
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-semibold truncate ${isSelected ? "text-primary" : "text-slate-800"}`}>
                                                        {resume.title}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        {formatDistanceToNow(new Date(resume.created_at), { addSuffix: true })}
                                                    </p>
                                                </div>

                                                {/* Check */}
                                                {isSelected ? (
                                                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        {!loading && resumes.length > 0 && (
                            <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleApply}
                                    disabled={!selectedId || submitting}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Submitting…
                                        </>
                                    ) : (
                                        "Submit Application"
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
