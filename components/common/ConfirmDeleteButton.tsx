"use client";

import * as React from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

type ConfirmDeleteButtonProps = {
    onConfirm: () => Promise<void> | void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    disabled?: boolean;
    stopPropagation?: boolean;
    buttonClassName?: string;
    dialogClassName?: string;
    successToast?: string;
    errorToast?: string | ((err: unknown) => string);
    children?: React.ReactNode;
};

function getApiErrorMessage(err: unknown): string | null {
    if (!err || typeof err !== "object") return null;

    const maybeErr = err as {
        response?: { data?: unknown };
    };

    const data = maybeErr.response?.data;
    if (data && typeof data === "object") {
        const maybeData = data as {
            error?: { message?: unknown };
            message?: unknown;
        };
        const msg = maybeData.error?.message ?? maybeData.message;
        if (typeof msg === "string" && msg.trim()) return msg;
    }

    return null;
}

export default function ConfirmDeleteButton({
    onConfirm,
    title = "Delete item?",
    description = "This action can’t be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    disabled,
    stopPropagation = true,
    buttonClassName,
    dialogClassName,
    successToast,
    errorToast,
    children,
}: ConfirmDeleteButtonProps) {
    const [open, setOpen] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const cancelRef = React.useRef<HTMLButtonElement | null>(null);
    const titleId = React.useId();
    const descriptionId = React.useId();

    React.useEffect(() => {
        if (!open) return;

        cancelRef.current?.focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open]);

    const handleOpen = (e: React.MouseEvent) => {
        if (stopPropagation) e.stopPropagation();
        e.preventDefault();
        if (disabled) return;
        setOpen(true);
    };

    const handleClose = (e?: React.SyntheticEvent) => {
        if (e && stopPropagation) e.stopPropagation();
        setOpen(false);
    };

    const handleConfirm = async (e: React.MouseEvent) => {
        if (stopPropagation) e.stopPropagation();
        e.preventDefault();
        if (submitting) return;

        try {
            setSubmitting(true);
            await onConfirm();
            setOpen(false);
            if (successToast) toast.success(successToast);
        } catch (err) {
            console.error(err);
            const fallback = "Failed to delete. Please try again.";
            const message =
                typeof errorToast === "function"
                    ? errorToast(err)
                    : typeof errorToast === "string"
                      ? errorToast
                      : getApiErrorMessage(err) ?? fallback;
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={handleOpen}
                disabled={disabled}
                className={cn(
                    "p-2 text-slate-400 hover:text-red-600 transition disabled:opacity-50 disabled:pointer-events-none",
                    buttonClassName
                )}
                aria-label="Delete"
            >
                {children ?? <Trash2 className="h-4 w-4 cursor-pointer" />}
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/40"
                        aria-label="Close"
                        onClick={handleClose}
                    />
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        aria-describedby={descriptionId}
                        className={cn(
                            "relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl",
                            dialogClassName
                        )}
                    >
                        <div className="space-y-2">
                            <h2 id={titleId} className="text-lg font-semibold text-slate-900">
                                {title}
                            </h2>
                            <p id={descriptionId} className="text-sm text-slate-500">
                                {description}
                            </p>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-2">
                            <button
                                ref={cancelRef}
                                type="button"
                                onClick={handleClose}
                                disabled={submitting}
                                className="h-10 rounded-lg cursor-pointer border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                            >
                                {cancelText}
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={submitting}
                                className="h-10 cursor-pointer rounded-lg bg-red-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <span className="inline-flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Deleting…
                                    </span>
                                ) : (
                                    confirmText
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
