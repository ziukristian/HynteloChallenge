import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/_next") || request.cookies.has("bloguser")) {
        return NextResponse.next();
    } else {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
}

export const config = {
    matcher: ["/((?!login).*)"], // Apply to all paths except the login page
};
