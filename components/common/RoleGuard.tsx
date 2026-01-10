"use client";

import { ReactNode } from "react";
import { useRequireRole } from "@/hooks/useRequireRole";

type Props = {
    role: "RECRUITER" | "JOB_SEEKER";
    children: ReactNode;
};

export default function RoleGuard({ role, children }: Props) {
    useRequireRole(role);
    return <>{children}</>;
}
