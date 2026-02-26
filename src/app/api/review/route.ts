import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required to submit reviews' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { item_id, rating, comment } = body as { item_id: string; rating: number; comment?: string };

        // Basic UUID validation
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!item_id || !uuidRegex.test(item_id)) {
            return NextResponse.json({ error: 'Invalid Asset ID format' }, { status: 400 });
        }

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5 stars' }, { status: 400 });
        }

        // Check if user already reviewed this tool
        const { data: existingReview, error: checkError } = await supabase
            .from('reviews')
            .select('*')
            .eq('item_id', item_id)
            .eq('user_id', user.id)
            .maybeSingle();

        if (checkError) {
            console.error('Check existing review error:', checkError);
        }

        if (existingReview) {
            return NextResponse.json({ error: 'You have already reviewed this tool' }, { status: 400 });
        }

        // Insert review (starts as pending)
        const { error: insertError } = await supabase
            .from('reviews')
            .insert({
                item_id,
                user_id: user.id,
                rating: Math.round(rating),
                comment: comment || null,
                status: 'pending'
            });

        if (insertError) {
            console.error('Supabase Review Insertion Error:', insertError);
            // Handle unique constraint violation specifically
            if (insertError.code === '23505') {
                return NextResponse.json({ error: 'You have already reviewed this tool' }, { status: 400 });
            }
            return NextResponse.json({ error: insertError.message || 'Database error occurred' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Review submitted for moderation' });
    } catch (error: any) {
        console.error('Review API Panic:', error);
        return NextResponse.json({ error: 'Internal Server Error. Please ensure the tool ID is valid.' }, { status: 500 });
    }
}
