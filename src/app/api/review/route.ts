import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    console.log('Review API: POST request received');
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { item_id, rating, comment } = body as { item_id: string; rating: number; comment?: string };

        if (!item_id || !rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Invalid item_id or rating' }, { status: 400 });
        }

        const cookieStore = await cookies();
        let sessionId = cookieStore.get('rbu_session_id')?.value;

        if (!sessionId) {
            sessionId = crypto.randomUUID();
            cookieStore.set('rbu_session_id', sessionId, {
                maxAge: 60 * 60 * 24 * 365,
                httpOnly: true,
                path: '/',
            });
        }

        const { data: { user } } = await supabase.auth.getUser();

        // Check if user already reviewed this tool
        let checkQuery = supabase.from('reviews').select('*').eq('item_id', item_id);
        if (user) {
            checkQuery = checkQuery.eq('user_id', user.id);
        } else {
            checkQuery = checkQuery.eq('session_id', sessionId);
        }
        const { data: existingReview, error: checkError } = await checkQuery.maybeSingle();

        if (checkError) {
            console.error('Check existing review error:', checkError);
        }

        if (existingReview) {
            return NextResponse.json({ error: 'You have already reviewed this tool' }, { status: 400 });
        }

        // Insert review (starts as pending)
        console.log('Inserting review for item:', item_id, 'with rating:', rating, 'session:', sessionId, 'user_id', user?.id);
        const { error: insertError } = await supabase
            .from('reviews')
            .insert({
                item_id,
                session_id: sessionId as string,
                user_id: user?.id || null,
                rating,
                comment,
                status: 'pending'
            });

        if (insertError) {
            console.error('Supabase Review Insertion Error:', insertError);
            return NextResponse.json({ error: insertError.message || 'Database error occurred' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Review submitted for moderation' });
    } catch (error: any) {
        console.error('Review API Panic:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
