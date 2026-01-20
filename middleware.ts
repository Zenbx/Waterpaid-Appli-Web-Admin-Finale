import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token');
    const { pathname } = request.nextUrl;

    // Si l'utilisateur est sur /admin sans token, rediriger vers login
    if (pathname.startsWith('/admin') && !token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Si l'utilisateur est sur /auth/login avec un token, rediriger vers admin
    if (pathname.startsWith('/auth/login') && token) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/auth/login'],
};
