'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(displayName: string) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { error: 'Unauthorized', status: 401 };
        }

        if (!displayName || displayName.trim().length < 2) {
            return { error: 'Display name must be at least 2 characters', status: 400 };
        }

        const { error } = await supabase.auth.updateUser({
            data: { full_name: displayName.trim() }
        });

        if (error) {
            console.error('Profile Update Error:', error);
            return { error: error.message, status: 500 };
        }

        revalidatePath('/profile');
        return { success: true, displayName: displayName.trim() };
    } catch (error: any) {
        console.error('Profile action panic:', error);
        return { error: 'Internal server error', status: 500 };
    }
}

export async function replyToReview(reviewId: string, reply: string) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { error: "Unauthorized", status: 401 };
        }

        if (!reviewId || !reply) {
            return { error: "Review ID and reply are required", status: 400 };
        }

        // 1. Get the review and check the item ownership
        const { data: review, error: reviewError } = await supabase
            .from("reviews")
            .select(`
                id,
                item_id,
                items (user_id, submitter_email)
            `)
            .eq("id", reviewId)
            .single();

        if (reviewError || !review) {
            return { error: "Review not found", status: 404 };
        }

        // 2. Verify ownership (user_id or email)
        const item = review.items as any;
        const isOwner = item?.user_id === user.id || item?.submitter_email === user.email;

        if (!isOwner) {
            return { error: "Permission denied. You do not own the asset this review is for.", status: 403 };
        }

        // 3. Update the review with the founder's reply
        const { error: updateError } = await supabase
            .from("reviews")
            .update({
                owner_reply: reply,
                owner_reply_at: new Date().toISOString()
            })
            .eq("id", reviewId);

        if (updateError) {
            console.error("Error updating review reply:", updateError);
            return { error: "Failed to save reply.", status: 500 };
        }

        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error("Server error replying to review:", error);
        return { error: "Internal Server Error", status: 500 };
    }
}
