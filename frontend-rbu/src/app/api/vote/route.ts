import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { item_id, value } = body;

        // Validate input
        if (!item_id || (value !== null && value !== 1 && value !== -1)) {
            return NextResponse.json(
                { error: 'Invalid input. Value must be 1, -1, or null' },
                { status: 400 }
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

        // Check if user already voted
        const { data: existingVote } = await supabase
            .from('votes')
            .select('*')
            .eq('item_id', item_id)
            .eq('session_id', sessionId)
            .single();

        if (value === null) {
            // Remove vote
            if (existingVote) {
                // @ts-ignore - Supabase type inference issue
                await supabase
                    .from('votes')
                    .delete()
                    // @ts-expect-error - Supabase types
                    .eq('id', existingVote.id);
            }
        } else if (existingVote) {
            // Update existing vote
            // @ts-ignore - Supabase type inference issue
            await supabase
                .from('votes')
                // @ts-expect-error - Supabase types
                .update({ value } as any)
                // @ts-expect-error - Supabase types
                .eq('id', existingVote.id);
        } else {
            // Insert new vote
            await supabase
                .from('votes')
                .insert({ item_id, session_id: sessionId, value } as any);
        }

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

        const newScore = (upvotes || 0) - (downvotes || 0);
        const newVoteCount = (upvotes || 0) + (downvotes || 0);

        // Update item score
        // @ts-ignore - Supabase type inference issue
        await supabase
            .from('items')
            // @ts-expect-error - Supabase types
            .update({
                score: newScore,
                vote_count: newVoteCount
            } as any)
            .eq('id', item_id);

        return NextResponse.json({
            success: true,
            new_score: newScore,
            vote_count: newVoteCount,
            user_vote: value,
        });

    } catch (error) {
        console.error('Vote error:', error);
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

        const cookieStore = await cookies();
        const sessionId = cookieStore.get('rbu_session_id')?.value;

        if (!sessionId) {
            return NextResponse.json({ user_vote: null });
        }

        const { data: vote } = await supabase
            .from('votes')
            .select('value')
            .eq('item_id', itemId)
            .eq('session_id', sessionId)
            .single();

        // @ts-ignore - Supabase type inference issue
        return NextResponse.json({
            // @ts-expect-error - Supabase types
            user_vote: vote?.value || null,
        });

    } catch (error) {
        console.error('Get vote error:', error);
        return NextResponse.json({ user_vote: null });
    }
}
