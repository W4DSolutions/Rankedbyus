import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { ItemStatus } from '@/types/models';

import { verifyAdmin } from '@/lib/auth-guards';

export async function POST(request: NextRequest) {
    // Auth Guard
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, action } = body as { id: string; action: string };

        if (!id || !['approve', 'reject'].includes(action)) {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }

        const supabase = createAdminClient();
        const status = (action === 'approve' ? 'approved' : 'rejected') as ItemStatus;

        // 1. Update review status
        const { data: review, error: reviewError } = await supabase
            .from('reviews')
            .update({ status })
            .eq('id', id)
            .select('item_id')
            .single();

        if (reviewError) {
            console.error('Admin review action error:', reviewError);
            return NextResponse.json({ error: reviewError.message }, { status: 500 });
        }

        // 2. Recalculate item rating regardless of action (in case we rejected a previously approved review)
        const itemId = review.item_id;

        // Get all approved reviews for this item
        const { data: reviews } = await supabase
            .from('reviews')
            .select('rating')
            .eq('item_id', itemId)
            .eq('status', 'approved');

        let newAvg = 0;
        let newCount = 0;

        if (reviews && reviews.length > 0) {
            newCount = reviews.length;
            const totalRating = reviews.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0);
            newAvg = totalRating / newCount;
        }

        // Update item stats
        await supabase
            .from('items')
            .update({
                average_rating: newAvg,
                review_count: newCount
            })
            .eq('id', itemId);

        return NextResponse.json({ success: true, status });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
