import { NextRequest, NextResponse } from "next/server";

export default function proxy(req: NextRequest) {
    console.log("------------Middleware hit -------------------")
    const token = req.cookies.get("token");
    const pathname = req.nextUrl.pathname;

    // Redirect unauthenticated users away from protected routes
    if (!token && (pathname.startsWith("/candidate") || pathname.startsWith("/recruiter"))) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    // Redirect authenticated users away from /login based on their role
    if (token && pathname === "/login") {
        try {
            const payloadBase64 = token.value.split(".")[1];
            const payload = JSON.parse(atob(payloadBase64));
            if (payload.role === "RECRUITER") {
                return NextResponse.redirect(new URL("/recruiter", req.url));
            }
            if (payload.role === "JOB_SEEKER") {
                return NextResponse.redirect(new URL("/candidate", req.url));
            }
        } catch {
            // Malformed token — let them through to /login
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/candidate/:path*", "/recruiter/:path*", "/login"]
}