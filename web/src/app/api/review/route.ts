import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { item_id, rating, comment } = await request.json();

        if (!item_id || !rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Invalid item_id or rating' }, { status: 400 });
        }

        const cookieStore = await cookies();
        let sessionId = cookieStore.get('session_id')?.value;

        if (!sessionId) {
            sessionId = crypto.randomUUID();
            cookieStore.set('session_id', sessionId, {
                maxAge: 60 * 60 * 24 * 365,
                httpOnly: true,
                path: '/',
            });
        }

        // Check if user already reviewed this tool
        const { data: existingReview } = await supabase
            .from('reviews')
            .select('*')
            .eq('item_id', item_id)
            .eq('session_id', sessionId)
            .single();

        if (existingReview) {
            return NextResponse.json({ error: 'You have already reviewed this tool' }, { status: 400 });
        }

        // Insert review (starts as pending)
        const { error } = await (supabase.from('reviews') as any)
            .insert({
                item_id,
                session_id: sessionId as string,
                rating,
                comment,
                status: 'pending' as any // Force cast to avoid enum mismatches in CI
            });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Review submitted for moderation' });
    } catch (error) {
        console.error('Review API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
