import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL, otherwise go to profile
    const next = searchParams.get('next') ?? '/profile'

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
                    // 1. Claim Votes (Handle potential duplicates)
                    // Get all anonymous votes for this session
                    const { data: anonVotes } = await supabase.from('votes')
                        .select('item_id, value, id')
                        .eq('session_id', sessionId)
                        .is('user_id', null);

                    if (anonVotes && anonVotes.length > 0) {
                        for (const vote of anonVotes) {
                            // Check if user already has an authenticated vote for this item
                            const { data: authVote } = await supabase.from('votes')
                                .select('id')
                                .eq('item_id', vote.item_id)
                                .eq('user_id', user.id)
                                .maybeSingle();

                            if (authVote) {
                                // Conflict: User already voted while logged in. 
                                // Priority goes to AUTH vote. Delete the anonymous one.
                                await supabase.from('votes').delete().eq('id', vote.id);
                            } else {
                                // No conflict: Claim the anonymous vote.
                                await supabase.from('votes').update({ user_id: user.id }).eq('id', vote.id);
                            }
                        }
                    }

                    // 2. Claim Reviews (Handle potential duplicates)
                    const { data: anonReviews } = await supabase.from('reviews')
                        .select('item_id, id')
                        .eq('session_id', sessionId)
                        .is('user_id', null);

                    if (anonReviews && anonReviews.length > 0) {
                        for (const review of anonReviews) {
                            const { data: authReview } = await supabase.from('reviews')
                                .select('id')
                                .eq('item_id', review.item_id)
                                .eq('user_id', user.id)
                                .maybeSingle();

                            if (authReview) {
                                // Conflict: Delete anon review.
                                await supabase.from('reviews').delete().eq('id', review.id);
                            } else {
                                await supabase.from('reviews').update({ user_id: user.id }).eq('id', review.id);
                            }
                        }
                    }

                    // 3. Claim Maker tools by email
                    if (user.email) {
                        await supabase.from('items')
                            .update({ user_id: user.id })
                            .eq('submitter_email', user.email)
                            .is('user_id', null);
                    }
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                const protocol = request.headers.get('x-forwarded-proto') || 'https'
                return NextResponse.redirect(`${protocol}://${forwardedHost}${next}`)
            } else {
                const secureOrigin = origin.replace('http://', 'https://')
                return NextResponse.redirect(`${secureOrigin}${next}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
