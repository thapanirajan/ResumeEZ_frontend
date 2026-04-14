"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Bell, X, CheckCheck, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import api from "@/util/api"
import { Notification, NotificationType } from "@/types/notification"

// ── Per-type visual config ────────────────────────────────────────────────────

const TYPE_DOT: Record<NotificationType, string> = {
    NEW_APPLICATION: "bg-blue-500",
    SHORTLIST_RESULT: "bg-emerald-500",
    SHORTLIST_SENT_CONFIRMATION: "bg-primary",
}

const TYPE_LABEL: Record<NotificationType, string> = {
    NEW_APPLICATION: "Application",
    SHORTLIST_RESULT: "Shortlisted",
    SHORTLIST_SENT_CONFIRMATION: "Sent",
}

// ── Navigation helper ─────────────────────────────────────────────────────────

function getNavigationPath(
    notification: Notification,
    userRole: "RECRUITER" | "JOB_SEEKER",
): string | null {
    if (!notification.job_id) return null
    if (userRole === "RECRUITER") {
        return `/recruiter/job/${notification.job_id}/applicants`
    }
    // Job seekers → their jobs / applications list
    return `/candidate/job`
}

// ── Skeleton loader item ──────────────────────────────────────────────────────

function SkeletonItem() {
    return (
        <div className="flex items-start gap-3 px-4 py-3.5 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-slate-200 mt-2 shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 rounded-full w-3/4" />
                <div className="h-2.5 bg-slate-100 rounded-full w-full" />
                <div className="h-2 bg-slate-100 rounded-full w-1/4" />
            </div>
        </div>
    )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
    userRole: "RECRUITER" | "JOB_SEEKER"
    /** Extra classes forwarded to the outer wrapper div */
    className?: string
}

export default function NotificationCenter({ userRole, className = "" }: Props) {
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [markingAll, setMarkingAll] = useState(false)

    const panelRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    // ── Poll unread count for badge ───────────────────────────────────────────

    const refreshUnreadCount = useCallback(async () => {
        try {
            const res = await api.get<{ unread_count: number }>("/api/notifications/unread-count")
            setUnreadCount(res.data.unread_count)
        } catch {
            // silently ignore — network errors shouldn't break the UI
        }
    }, [])

    useEffect(() => {
        refreshUnreadCount()
        const id = setInterval(refreshUnreadCount, 30_000)
        return () => clearInterval(id)
    }, [refreshUnreadCount])

    // ── Fetch full list when panel opens ──────────────────────────────────────

    const fetchNotifications = useCallback(async () => {
        setLoading(true)
        try {
            const res = await api.get<Notification[]>("/api/notifications/?limit=20")
            setNotifications(res.data)
            setUnreadCount(res.data.filter((n) => !n.is_read).length)
        } catch {
            // silently ignore
        } finally {
            setLoading(false)
        }
    }, [])

    const handleToggle = useCallback(() => {
        const next = !open
        setOpen(next)
        if (next) fetchNotifications()
    }, [open, fetchNotifications])

    // ── Click outside to close ────────────────────────────────────────────────

    useEffect(() => {
        if (!open) return
        function onMouseDown(e: MouseEvent) {
            if (
                panelRef.current?.contains(e.target as Node) ||
                buttonRef.current?.contains(e.target as Node)
            ) return
            setOpen(false)
        }
        document.addEventListener("mousedown", onMouseDown)
        return () => document.removeEventListener("mousedown", onMouseDown)
    }, [open])

    // ── Mark one notification read + navigate ─────────────────────────────────

    const handleClick = useCallback(
        async (notification: Notification) => {
            if (!notification.is_read) {
                // optimistic update
                setNotifications((prev) =>
                    prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n)),
                )
                setUnreadCount((c) => Math.max(0, c - 1))
                // persist
                api.patch(`/api/notifications/${notification.id}/read`).catch(() => {
                    // rollback on failure
                    setNotifications((prev) =>
                        prev.map((n) => (n.id === notification.id ? { ...n, is_read: false } : n)),
                    )
                    setUnreadCount((c) => c + 1)
                })
            }

            const path = getNavigationPath(notification, userRole)
            if (path) {
                setOpen(false)
                router.push(path)
            }
        },
        [userRole, router],
    )

    // ── Mark all read ─────────────────────────────────────────────────────────

    const handleMarkAllRead = useCallback(async () => {
        setMarkingAll(true)
        // optimistic
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
        setUnreadCount(0)
        try {
            await api.patch("/api/notifications/read-all")
        } catch {
            // rollback
            fetchNotifications()
        } finally {
            setMarkingAll(false)
        }
    }, [fetchNotifications])

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className={`relative ${className}`}>
            {/* ── Bell Button ── */}
            <button
                ref={buttonRef}
                onClick={handleToggle}
                aria-label={`Notifications${unreadCount > 0 ? ` — ${unreadCount} unread` : ""}`}
                className="relative p-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
            >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none shadow-sm">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* ── Dropdown Panel ── */}
            {open && (
                <div
                    ref={panelRef}
                    className="absolute right-0 top-full mt-2.5 w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden"
                    style={{ maxWidth: "calc(100vw - 1rem)" }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-slate-500" />
                            <span className="font-bold text-slate-900 text-sm">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    disabled={markingAll}
                                    className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline disabled:opacity-50 transition-opacity"
                                >
                                    {markingAll ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <CheckCheck className="w-3 h-3" />
                                    )}
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="overflow-y-auto" style={{ maxHeight: "420px" }}>
                        {loading ? (
                            <div className="divide-y divide-slate-50">
                                <SkeletonItem />
                                <SkeletonItem />
                                <SkeletonItem />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-14 gap-3 text-slate-400">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                    <Bell className="w-6 h-6 opacity-40" />
                                </div>
                                <p className="text-sm font-medium">No notifications yet</p>
                                <p className="text-xs text-slate-300 text-center max-w-[200px]">
                                    Activity on your jobs and applications will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {notifications.map((n) => {
                                    const dot = TYPE_DOT[n.type] ?? "bg-slate-400"
                                    const label = TYPE_LABEL[n.type] ?? "Update"
                                    const isNavigable = !!getNavigationPath(n, userRole)

                                    return (
                                        <button
                                            key={n.id}
                                            onClick={() => handleClick(n)}
                                            className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors ${
                                                !n.is_read
                                                    ? "bg-blue-50/50 hover:bg-blue-50"
                                                    : "bg-white hover:bg-slate-50"
                                            } ${isNavigable ? "cursor-pointer" : "cursor-default"}`}
                                        >
                                            {/* Unread dot */}
                                            <div
                                                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 transition-colors ${
                                                    n.is_read ? "bg-slate-200" : dot
                                                }`}
                                            />

                                            {/* Text */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <p
                                                        className={`text-sm leading-snug truncate ${
                                                            !n.is_read
                                                                ? "font-bold text-slate-900"
                                                                : "font-semibold text-slate-700"
                                                        }`}
                                                    >
                                                        {n.title}
                                                    </p>
                                                    <span
                                                        className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full shrink-0 ${
                                                            !n.is_read
                                                                ? `${dot.replace("bg-", "bg-").replace("500", "100")} text-slate-600`
                                                                : "bg-slate-100 text-slate-400"
                                                        }`}
                                                    >
                                                        {label}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                                    {n.message}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                                                    {formatDistanceToNow(new Date(n.created_at), {
                                                        addSuffix: true,
                                                    })}
                                                </p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {!loading && notifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/80 text-center">
                            <p className="text-[11px] text-slate-400 font-medium">
                                Showing the {notifications.length} most recent notifications
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
