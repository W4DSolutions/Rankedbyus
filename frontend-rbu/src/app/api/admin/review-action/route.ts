import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
    try {
        const { id, action } = await request.json();

        if (!id || !['approve', 'reject'].includes(action)) {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }

        const supabase = createAdminClient();
        const status = action === 'approve' ? 'approved' : 'rejected';

        // 1. Update review status
        const { data: review, error: reviewError } = await (supabase
            .from('reviews') as any)
            .update({ status })
            .eq('id', id)
            .select('item_id')
            .single();

        if (reviewError) {
            console.error('Admin review action error:', reviewError);
            return NextResponse.json({ error: reviewError.message }, { status: 500 });
        }

        if (action === 'approve') {
            // 2. Recalculate item rating if approved
            const itemId = (review as any).item_id;

            // Get all approved reviews for this item
            const { data: reviews } = await supabase
                .from('reviews')
                .select('rating')
                .eq('item_id', itemId)
                .eq('status', 'approved');

            if (reviews && reviews.length > 0) {
                const count = reviews.length;
                const avg = (reviews as any[]).reduce((acc, r) => acc + r.rating, 0) / count;

                await (supabase
                    .from('items') as any)
                    .update({
                        average_rating: avg,
                        review_count: count
                    })
                    .eq('id', itemId);
            }
        }

        return NextResponse.json({ success: true, status });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
