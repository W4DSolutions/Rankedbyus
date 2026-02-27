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

        // 1. GLOBAL RATE LIMIT CHECK (Max 50 votes per 24h per IP)
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const { count: dayVoteCount } = await supabase
            .from('vote_audit_logs')
            .select('*', { count: 'exact', head: true })
            .eq('ip_address', ipAddress)
            .in('action', ['upvote', 'downvote', 'cancel'])
            .gte('created_at', twentyFourHoursAgo.toISOString());

        if ((dayVoteCount || 0) >= 50) {
            await supabase.from('vote_audit_logs').insert({
                ip_address: ipAddress,
                user_agent: userAgent,
                action: 'rate_limited',
                message: 'Daily limit exceeded'
            });
            return { error: 'High volume detected. Please try again tomorrow.', status: 429 };
        }

        // Check if user already voted (strictly by user_id)
        const { data: existingVote, error: checkError } = await supabase
            .from('votes')
            .select('*')
            .eq('item_id', item_id)
            .eq('user_id', user.id)
            .maybeSingle();

        if (checkError) {
            console.error('Check existing vote error:', checkError);
            return { error: 'Failed to verify existing signal status.', status: 500 };
        }

        if (value === null) {
            // Remove vote
            if (existingVote) {
                await supabase
                    .from('votes')
                    .delete()
                    .eq('id', existingVote.id);
            }
        } else if (existingVote) {
            // Update existing vote
            await supabase
                .from('votes')
                .update({
                    value,
                    ip_address: ipAddress,
                    user_id: user.id
                })
                .eq('id', existingVote.id);
        } else {
            // Insert new vote
            const cookieStore = await cookies();
            const sessionId = cookieStore.get('rbu_session_id')?.value;

            await supabase
                .from('votes')
                .insert({
                    item_id,
                    user_id: user.id,
                    session_id: sessionId || null,
                    ip_address: ipAddress,
                    user_agent: userAgent,
                    value
                });
        }

        // 2. LOG THE ACTION FOR AUDIT (Silent Catch)
        try {
            await supabase.from('vote_audit_logs').insert({
                item_id,
                user_id: user.id,
                action: value === null ? 'cancel' : value === 1 ? 'upvote' : 'downvote',
                ip_address: ipAddress || 'unknown'
            });
        } catch (e) {
            console.warn('Audit Logging skipped:', e);
        }

        // 3. Recalculate global score for UI return (USING ADMIN CLIENT)
        const { createAdminClient } = await import('@/lib/supabase/admin');
        const adminSupabase = createAdminClient();

        const { count: upvotes, error: upError } = await adminSupabase
            .from('votes')
            .select('*', { count: 'exact', head: true })
            .eq('item_id', item_id)
            .eq('value', 1);

        if (upError) {
            console.error('Error counting upvotes:', upError);
            throw new Error('Failed to verify new signal amplitude.');
        }

        const { count: downvotes, error: downError } = await adminSupabase
            .from('votes')
            .select('*', { count: 'exact', head: true })
            .eq('item_id', item_id)
            .eq('value', -1);

        if (downError) {
            console.error('Error counting downvotes:', downError);
            throw new Error('Failed to verify new signal amplitude.');
        }

        const newScore = (upvotes || 0) - (downvotes || 0);
        const newVoteCount = (upvotes || 0) + (downvotes || 0);

        // Revalidate aggressively
        revalidatePath('/', 'layout'); // Clears cache for all pages using the main layout

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
        console.error('Vote action error:', error);
        return { error: 'Internal server error', status: 500 };
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
