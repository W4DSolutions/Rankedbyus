import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies, headers } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { item_id, value } = body as { item_id: string; value: number | null };

        // Validate input
        if (!item_id || (value !== null && value !== 1 && value !== -1)) {
            return NextResponse.json(
                { error: 'Invalid input. Value must be 1, -1, or null' },
                { status: 400 }
            );
        }

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
            .eq('action', 'vote_cast')
            .gte('created_at', twentyFourHoursAgo.toISOString());

        if ((dayVoteCount || 0) > 50) {
            await supabase.from('vote_audit_logs').insert({
                ip_address: ipAddress,
                user_agent: userAgent,
                action: 'rate_limited',
                message: 'Daily limit exceeded'
            });
            return NextResponse.json(
                { error: 'High volume detected. Please try again tomorrow.' },
                { status: 429 }
            );
        }

        // Get or create session ID from cookies
        const cookieStore = await cookies();
        let sessionId = cookieStore.get('rbu_session_id')?.value;

        if (!sessionId) {
            sessionId = crypto.randomUUID();
            cookieStore.set('rbu_session_id', sessionId, {
                maxAge: 60 * 60 * 24 * 365, // 1 year
                httpOnly: true,
                sameSite: 'lax',
            });
        }

        // Get authenticated user
        const { data: { user } } = await supabase.auth.getUser();

        // Check if user already voted (by user_id OR session OR IP)
        let existingVoteQuery = supabase.from('votes').select('*').eq('item_id', item_id);
        if (user) {
            existingVoteQuery = existingVoteQuery.eq('user_id', user.id);
        } else {
            existingVoteQuery = existingVoteQuery.or(`session_id.eq.${sessionId},ip_address.eq.${ipAddress}`);
        }
        const { data: existingVote } = await existingVoteQuery.maybeSingle();

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
                    session_id: sessionId, // Normalize to current session
                    ip_address: ipAddress,  // Update with current IP
                    user_id: user?.id || existingVote.user_id // Link to user if they just logged in
                })
                .eq('id', existingVote.id);
        } else {
            // Insert new vote
            await supabase
                .from('votes')
                .insert({
                    item_id,
                    session_id: sessionId,
                    user_id: user?.id || null, // Link vote to user if authenticated
                    ip_address: ipAddress,
                    user_agent: userAgent,
                    value
                });
        }

        // 2. LOG THE ACTION FOR AUDIT
        await supabase.from('vote_audit_logs').insert({
            ip_address: ipAddress,
            user_agent: userAgent,
            session_id: sessionId,
            item_id,
            action: 'vote_cast'
        });

        // Recalculate score
        const { count: upvotes } = await supabase
            .from('votes')
            .select('*', { count: 'exact', head: true })
            .eq('item_id', item_id)
            .eq('value', 1);

        const { count: downvotes } = await supabase
            .from('votes')
            .select('*', { count: 'exact', head: true })
            .eq('item_id', item_id)
            .eq('value', -1);

        // Calculate 7 days ago for trending bonus
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { count: recentUpvotes } = await supabase
            .from('votes')
            .select('*', { count: 'exact', head: true })
            .eq('item_id', item_id)
            .eq('value', 1)
            .gte('created_at', sevenDaysAgo.toISOString());

        // Algorithm: (Up - Down) + (Recent Up * 2)
        const baseScore = (upvotes || 0) - (downvotes || 0);
        const trendingBonus = (recentUpvotes || 0) * 2;
        const newScore = baseScore + trendingBonus;

        const newVoteCount = (upvotes || 0) + (downvotes || 0);

        // Update item score
        await supabase
            .from('items')
            .update({
                score: newScore,
                vote_count: newVoteCount
            })
            .eq('id', item_id);

        return NextResponse.json({
            success: true,
            new_score: newScore,
            vote_count: newVoteCount,
            user_vote: value,
        });

    } catch (error: any) {
        console.error('Vote error:', error);

        // Handle case where ip_address column might not exist yet
        if (error?.message?.includes('column "ip_address" of relation "votes" does not exist')) {
            return NextResponse.json(
                { error: 'Database migration required: Please run the SQL to add ip_address column to votes table.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET endpoint to check user's current vote on an item
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const itemId = searchParams.get('item_id');

        if (!itemId) {
            return NextResponse.json(
                { error: 'Missing item_id' },
                { status: 400 }
            );
        }

        const headersList = await headers();
        const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] ||
            headersList.get('x-real-ip') ||
            '127.0.0.1';

        const cookieStore = await cookies();
        const sessionId = cookieStore.get('rbu_session_id')?.value;

        const { data: { user } } = await supabase.auth.getUser();

        let query = supabase
            .from('votes')
            .select('value')
            .eq('item_id', itemId);

        if (user) {
            query = query.eq('user_id', user.id);
        } else if (sessionId && ipAddress) {
            query = query.or(`session_id.eq.${sessionId},ip_address.eq.${ipAddress}`);
        } else if (sessionId) {
            query = query.eq('session_id', sessionId);
        } else {
            query = query.eq('ip_address', ipAddress);
        }

        const { data: vote } = await query.maybeSingle();

        return NextResponse.json({
            user_vote: vote?.value || null,
        });

    } catch (error) {
        console.error('Get vote error:', error);
        return NextResponse.json({ user_vote: null });
    }
}

