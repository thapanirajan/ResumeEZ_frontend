import { NextRequest, NextResponse } from "next/server";

export default function proxy(req: NextRequest) {
    console.log("------------Middleware hit -------------------")
    const token = req.cookies.get("token");
    const pathname = req.nextUrl.pathname;

    if (!token && (pathname.startsWith("/candidate") || pathname.startsWith("/recruiter"))) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next();
}

export const config = {
matcher: ["/candidate/:path*", "/recruiter/:path*"]}