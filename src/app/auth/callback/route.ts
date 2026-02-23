import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Claim anonymous history
            // We can't import the server action directly here if it's not an async component or similar context?
            // Actually server actions can be called from here, but better to do it via a direct DB call or just redirect to a page that triggers it.
            // Let's use the supabase client directly here since we already have it.

            // Get session ID from cookies
            const cookieStore = await import('next/headers').then(mod => mod.cookies()); // Dynamic import to avoid type issues if any
            const sessionId = cookieStore.get('rbu_session_id')?.value;

            if (sessionId) {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    // Update instead of using rpc due to schema changes where items table has no session_id
                    await Promise.allSettled([
                        supabase.from('votes')
                            .update({ user_id: user.id })
                            .eq('session_id', sessionId)
                            .is('user_id', null),
                        supabase.from('reviews')
                            .update({ user_id: user.id })
                            .eq('session_id', sessionId)
                            .is('user_id', null)
                    ]);
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
