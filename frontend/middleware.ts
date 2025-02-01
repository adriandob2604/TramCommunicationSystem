import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const isAuthenticated = request.cookies.get('token');
    const blockedPathsForAuthUsers = ['/register', '/login'];
    const protectedPaths = ['/home', '/tramRoute', '/profile'];

    const { pathname } = request.nextUrl;

    if (isAuthenticated && blockedPathsForAuthUsers.some(path => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL('/home', request.url));
    }

    if (!isAuthenticated && protectedPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/:path*']
};
