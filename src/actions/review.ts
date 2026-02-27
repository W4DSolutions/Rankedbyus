'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { ReviewSchema, type ReviewInput } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

export async function submitReview(input: ReviewInput) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { error: 'Authentication required to submit reviews', status: 401 };
        }

        // 0. STRUCTURAL VALIDATION (ZOD)
        const validation = ReviewSchema.safeParse(input);
        if (!validation.success) {
            return { error: validation.error.issues[0].message, status: 400 };
        }
        const { item_id, rating, comment } = validation.data;

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
            return { error: 'You have already reviewed this tool', status: 400 };
        }

        // Insert review (starts as pending)
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('rbu_session_id')?.value;

        const { error: insertError } = await supabase
            .from('reviews')
            .insert({
                item_id,
                user_id: user.id,
                session_id: sessionId || null,
                rating: Math.round(rating),
                comment: comment || null,
                status: 'pending'
            });

        if (insertError) {
            console.error('Supabase Review Insertion Error:', insertError);
            if (insertError.code === '23505') {
                return { error: 'You have already reviewed this tool', status: 400 };
            }
            return { error: insertError.message || 'Database error occurred', status: 500 };
        }

        // Revalidate the tool page to show the pending status if we ever add that, 
        // or just to refresh the state.
        revalidatePath(`/tool/${item_id}`);

        return { success: true, message: 'Review submitted for moderation' };
    } catch (error: any) {
        console.error('Review action error:', error);
        return { error: 'Internal server error', status: 500 };
    }
}
