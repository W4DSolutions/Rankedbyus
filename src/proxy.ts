import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const response = await updateSession(request);

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
        const session = request.cookies.get('admin_session');

        if (!session || session.value !== 'authenticated') {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }
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
