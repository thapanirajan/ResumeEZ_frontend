import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
    {
        variants: {
            variant: {
                default:
                    "border-primary/20 bg-primary/10 text-primary",
                secondary:
                    "border-slate-200 bg-slate-100 text-slate-700",
                success:
                    "border-green-200 bg-green-100 text-green-700",
                warning:
                    "border-amber-200 bg-amber-100 text-amber-700",
                info:
                    "border-blue-200 bg-blue-100 text-blue-700",
                destructive:
                    "border-red-200 bg-red-100 text-red-700",
                outline:
                    "border-current bg-transparent text-current",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
