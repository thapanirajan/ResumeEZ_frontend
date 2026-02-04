export type ResumeTemplate =
    | "classic"
    | "compact"
    | "modern";

export const TEMPLATE_LABELS: Record<ResumeTemplate, string> = {
    classic: "Classic",
    compact: "Compact",
    modern: "Modern",
};
