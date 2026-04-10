"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ── Context ───────────────────────────────────────────────────────────────────

type TabsContextValue = {
    value: string;
    onValueChange: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
    const ctx = React.useContext(TabsContext);
    if (!ctx) throw new Error("Tabs components must be used within a <Tabs> root.");
    return ctx;
}

// ── Tabs root ─────────────────────────────────────────────────────────────────

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Controlled active tab value */
    value?: string;
    /** Uncontrolled default value */
    defaultValue?: string;
    /** Called when the active tab changes */
    onValueChange?: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({ value, defaultValue = "", onValueChange, className, children, ...props }, ref) => {
        const [internalValue, setInternalValue] = React.useState(defaultValue);
        const isControlled = value !== undefined;
        const current = isControlled ? value! : internalValue;

        const handleChange = React.useCallback(
            (v: string) => {
                if (!isControlled) setInternalValue(v);
                onValueChange?.(v);
            },
            [isControlled, onValueChange]
        );

        return (
            <TabsContext.Provider value={{ value: current, onValueChange: handleChange }}>
                <div ref={ref} className={cn("", className)} {...props}>
                    {children}
                </div>
            </TabsContext.Provider>
        );
    }
);
Tabs.displayName = "Tabs";

// ── TabsList ──────────────────────────────────────────────────────────────────

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            role="tablist"
            className={cn(
                "inline-flex h-10 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500",
                className
            )}
            {...props}
        />
    )
);
TabsList.displayName = "TabsList";

// ── TabsTrigger ───────────────────────────────────────────────────────────────

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, value, children, ...props }, ref) => {
        const { value: current, onValueChange } = useTabsContext();
        const isActive = current === value;

        return (
            <button
                ref={ref}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => onValueChange(value)}
                className={cn(
                    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    isActive
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-900",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);
TabsTrigger.displayName = "TabsTrigger";

// ── TabsContent ───────────────────────────────────────────────────────────────

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ className, value, ...props }, ref) => {
        const { value: current } = useTabsContext();
        if (current !== value) return null;

        return (
            <div
                ref={ref}
                role="tabpanel"
                className={cn("mt-4 focus-visible:outline-none", className)}
                {...props}
            />
        );
    }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
