'use server';

import { createClient } from '@/lib/supabase/server';
import { headers, cookies } from 'next/headers';
import { VoteSchema, type VoteInput } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

export async function submitVote(input: VoteInput) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { error: 'Authentication required to vote', status: 401 };
        }

        // 0. STRUCTURAL VALIDATION (ZOD)
        const validation = VoteSchema.safeParse(input);
        if (!validation.success) {
            return { error: validation.error.issues[0].message, status: 400 };
        }
        const { item_id, value } = validation.data;

        // Get Client IP
        const headersList = await headers();
        const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] ||
            headersList.get('x-real-ip') ||
            '127.0.0.1';
        const userAgent = headersList.get('user-agent') || 'unknown';

        // 1. INITIALIZE CLIENTS
        const { createAdminClient } = await import('@/lib/supabase/admin');
        const adminSupabase = createAdminClient();

        // 2. GLOBAL RATE LIMIT CHECK (Max 50 votes per 24h per IP)
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const { count: dayVoteCount } = await adminSupabase
            .from('vote_audit_logs')
            .select('*', { count: 'exact', head: true })
            .eq('ip_address', ipAddress)
            .in('action', ['upvote', 'downvote', 'cancel'])
            .gte('created_at', twentyFourHoursAgo.toISOString());

        if ((dayVoteCount || 0) >= 50) {
            await adminSupabase.from('vote_audit_logs').insert({
                ip_address: ipAddress,
                user_agent: userAgent,
                action: 'rate_limited',
                message: 'Daily limit exceeded'
            });
            return { error: 'High volume detected. Please try again tomorrow.', status: 429 };
        }

        // 3. GET SESSION & IDENTIFY EXISTING VOTE

        // 1. GET SESSION & IDENTIFY EXISTING VOTE
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('rbu_session_id')?.value;

        // More robust lookup: check by UID OR SessionID (if logged in, we check both to claim history)
        // We use Admin Client here to ensure we find the record regardless of RLS visibility
        let query = adminSupabase
            .from('votes')
            .select('*')
            .eq('item_id', item_id);

        if (user) {
            if (sessionId) {
                query = query.or(`user_id.eq.${user.id},session_id.eq.${sessionId}`);
            } else {
                query = query.eq('user_id', user.id);
            }
        } else if (sessionId) {
            query = query.eq('session_id', sessionId).is('user_id', null);
        } else {
            return { error: 'Signal authentication required', status: 401 };
        }

        const { data: existingVotes, error: fetchError } = await query;
        if (fetchError) {
            console.error('Signal lookup failure:', fetchError);
            return { error: 'Registry lookup failed. Please try again.', status: 500 };
        }

        // We might find two votes if the user voted anonymously and then logged in without claiming
        // We prioritize the authenticated one
        const existingVote = existingVotes && existingVotes.length > 0
            ? (existingVotes.find(v => v.user_id === user?.id) || existingVotes[0])
            : null;

        if (value === null) {
            // Remove signal
            if (existingVote) {
                const { error: delError } = await adminSupabase
                    .from('votes')
                    .delete()
                    .eq('id', existingVote.id);
                if (delError) {
                    console.error('Delete error:', delError);
                    return { error: 'Could not retract signal from registry.', status: 500 };
                }
            }
        } else if (existingVote) {
            // Update existing signal (and bridge user ID if it was anonymous)
            const { error: updError } = await adminSupabase
                .from('votes')
                .update({
                    value,
                    user_id: user?.id || existingVote.user_id,
                    session_id: sessionId || existingVote.session_id
                })
                .eq('id', existingVote.id);

            if (updError) {
                console.error('Update error:', updError);
                return { error: 'Signal update rejected by registry.', status: 500 };
            }
        } else {
            // New signal insertion
            const { error: insError } = await adminSupabase
                .from('votes')
                .insert({
                    item_id,
                    user_id: user?.id || null,
                    session_id: sessionId || null,
                    value
                });

            if (insError) {
                console.error('Registry Signal Induction Error:', insError);
                // Check for unique violation (code 23505)
                if ((insError as any).code === '23505') {
                    return { error: 'You have already contributed a signal for this asset.', status: 400 };
                }
                // Return actual error details for debugging
                return {
                    error: `Signal induction failed: ${insError.message || 'Registry refusal'} (${(insError as any).code || 'unknown'})`,
                    status: 500
                };
            }
        }

        // 2. LOG THE ACTION FOR AUDIT (Silent Catch)
        try {
            await adminSupabase.from('vote_audit_logs').insert({
                item_id,
                user_id: user?.id,
                action: value === null ? 'cancel' : value === 1 ? 'upvote' : 'downvote',
                ip_address: ipAddress || 'unknown',
                user_agent: userAgent,
                session_id: sessionId || 'unknown'
            });
        } catch (e) {
            console.warn('Audit Logging skipped:', e);
        }

        // 3. Recalculate global score for UI return
        const { count: upvotes, error: upError } = await adminSupabase
            .from('votes')
            .select('*', { count: 'exact', head: true })
            .eq('item_id', item_id)
            .eq('value', 1);

        if (upError) {
            console.error('Error counting upvotes:', upError);
            return { error: 'Failed to verify new signal amplitude.', status: 500 };
        }

        const { count: downvotes, error: downError } = await adminSupabase
            .from('votes')
            .select('*', { count: 'exact', head: true })
            .eq('item_id', item_id)
            .eq('value', -1);

        if (downError) {
            console.error('Error counting downvotes:', downError);
            return { error: 'Failed to verify new signal amplitude.', status: 500 };
        }

        const newScore = (upvotes || 0) - (downvotes || 0);
        const newVoteCount = (upvotes || 0) + (downvotes || 0);

        // Revalidate aggressively
        revalidatePath('/', 'layout');

        // Also revalidate the specific entity if possible
        const { data: item } = await adminSupabase.from('items').select('slug').eq('id', item_id).single();
        if (item?.slug) {
            revalidatePath(`/tool/${item.slug}`);
        }

        return {
            success: true,
            new_score: newScore,
            vote_count: newVoteCount,
            user_vote: value,
        };

    } catch (error: any) {
        console.error('Vote action panic:', error);
        return { error: error.message || 'Internal server error', status: 500 };
    }
}

export async function getUserVote(itemId: string) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { user_vote: null };
        }

        const { data: vote } = await supabase
            .from('votes')
            .select('value')
            .eq('item_id', itemId)
            .eq('user_id', user.id)
            .maybeSingle();

        return {
            user_vote: vote?.value || null,
        };

    } catch (error) {
        console.error('Get vote action error:', error);
        return { user_vote: null };
    }
}
