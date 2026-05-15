import { NextRequest, NextResponse } from "next/server";

function decodeRole(token: string): string | null {
    try {
        const payloadBase64 = token.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));
        return payload.role ?? null;
    } catch {
        return null;
    }
}

export default function proxy(req: NextRequest) {
    const token = req.cookies.get("token");
    const pathname = req.nextUrl.pathname;

    const isCandidateRoute = pathname.startsWith("/candidate");
    const isRecruiterRoute = pathname.startsWith("/recruiter");

    // Redirect unauthenticated users to login
    if (!token && (isCandidateRoute || isRecruiterRoute)) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token) {
        const role = decodeRole(token.value);

        // Invalid or tampered token — clear cookie and send to login
        if (!role) {
            const response = NextResponse.redirect(new URL("/login", req.url));
            response.cookies.delete("token");
            return response;
        }

        // Prevent cross-role access: candidate trying to access recruiter routes
        if (isRecruiterRoute && role !== "RECRUITER") {
            return NextResponse.redirect(new URL("/candidate", req.url));
        }

        // Prevent cross-role access: recruiter trying to access candidate routes
        if (isCandidateRoute && role !== "JOB_SEEKER") {
            return NextResponse.redirect(new URL("/recruiter", req.url));
        }

        // Redirect authenticated users away from /login to their dashboard
        if (pathname === "/login") {
            if (role === "RECRUITER") {
                return NextResponse.redirect(new URL("/recruiter", req.url));
            }
            if (role === "JOB_SEEKER") {
                return NextResponse.redirect(new URL("/candidate", req.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/candidate/:path*", "/recruiter/:path*", "/login"],
};