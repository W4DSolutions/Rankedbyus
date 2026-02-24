import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const { supabaseResponse: response, user: middlewareUser } = await updateSession(request);

    try {
        // Ensure rbu_session_id exists for all users
        const sessionId = request.cookies.get('rbu_session_id');
        if (!sessionId) {
            const newSessionId = crypto.randomUUID();
            response.cookies.set('rbu_session_id', newSessionId, {
                maxAge: 60 * 60 * 24 * 365, // 1 year
                httpOnly: true,
                path: '/',
            });
        }
    } catch (e) {
        console.error('Middleware Session Error:', e);
    }

    // Only protect /admin (but allow /admin/login)
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        // 1. Check legacy admin_session cookie
        const legacySession = request.cookies.get('admin_session');
        if (legacySession?.value === 'authenticated') {
            return response;
        }

        // 2. Check Supabase RBAC
        if (middlewareUser?.app_metadata?.role === 'admin') {
            return response;
        }

        // Redirect to login if neither is present
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
    ],
};
