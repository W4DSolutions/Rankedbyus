import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
    const supabase = createAdminClient();

    try {
        const { reviewId } = await request.json();

        if (!reviewId) {
            return NextResponse.json({ error: 'Missing reviewId' }, { status: 400 });
        }

        // Increment helpful_count
        const { error } = await supabase.rpc('increment_review_helpful', { review_row_id: reviewId });

        if (error) {
            // Fallback if RPC doesn't exist yet
            const { data: review } = await supabase.from('reviews').select('helpful_count').eq('id', reviewId).single();
            const { error: updateError } = await supabase
                .from('reviews')
                .update({ helpful_count: (review?.helpful_count || 0) + 1 })
                .eq('id', reviewId);

            if (updateError) throw updateError;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Helpful vote error:', error);
        return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
    }
}
