import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // refreshing the auth token and checking user
    // We wrap this in a try-catch because getUser can throw AuthApiError if the refresh token is invalid
    let user = null;
    try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser()
        if (!error) {
            user = authUser;
        } else if (error.status === 400 && error.message.includes('Refresh Token Not Found')) {
            console.warn('Middleware: Invalid refresh token detected. User will be treated as guest.');
        }
    } catch (e) {
        console.error('Middleware Auth Error:', e);
    }

    // Protected Routes Check
    const protectedRoutes = ['/submit-tool']
    const isProtected = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

    if (isProtected && !user) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/login'
        // Add current path as `next` parameter
        redirectUrl.searchParams.set('next', request.nextUrl.pathname)

        // Return a redirect response setting the needed cookies
        const redirectResponse = NextResponse.redirect(redirectUrl)
        supabaseResponse.cookies.getAll().forEach(cookie => {
            redirectResponse.cookies.set(cookie.name, cookie.value)
        })
        return { supabaseResponse: redirectResponse, user: null }
    }

    return { supabaseResponse, user }
}
