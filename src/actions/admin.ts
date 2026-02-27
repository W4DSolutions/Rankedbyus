'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { ItemStatus } from '@/types/models';
import { sendEmail } from '@/lib/email';
import { verifyAdmin } from '@/lib/auth-guards';
import { revalidatePath } from 'next/cache';

export async function processAdminToolAction(id: string, action: 'approve' | 'reject', tags?: string[]) {
    // Auth Guard
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return { error: 'Unauthorized', status: 401 };
    }

    try {
        if (!id || !['approve', 'reject'].includes(action)) {
            return { error: 'Invalid parameters', status: 400 };
        }

        const supabase = createAdminClient();
        const status = (action === 'approve' ? 'approved' : 'rejected') as ItemStatus;

        const { error } = await supabase
            .from('items')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error('Admin tool action error:', error);
            return { error: error.message, status: 500 };
        }

        if (status === 'approved' && tags && Array.isArray(tags)) {
            const tagInserts = tags.map((tagId: string) => ({
                item_id: id,
                tag_id: tagId
            }));

            if (tagInserts.length > 0) {
                // Remove existing tags first
                await supabase.from('item_tags').delete().eq('item_id', id);

                const { error: tagError } = await supabase
                    .from('item_tags')
                    .insert(tagInserts);

                if (tagError) {
                    console.error('Error adding tags:', tagError);
                }
            }
        }

        // Email Notifications
        const { data: item } = await supabase
            .from('items')
            .select('submitter_email, name')
            .eq('id', id)
            .single();

        if (item?.submitter_email) {
            if (status === 'approved') {
                await sendEmail({
                    to: item.submitter_email,
                    subject: `Asset Approved: ${item.name} is now live!`,
                    template: 'item_approved',
                    data: { itemName: item.name }
                });
            } else if (status === 'rejected') {
                await sendEmail({
                    to: item.submitter_email,
                    subject: `Status Update: Submissions regarding ${item.name}`,
                    template: 'item_rejected',
                    data: { itemName: item.name }
                });
            }
        }

        revalidatePath('/admin');
        revalidatePath('/'); // Revalidate home in case it was a new approval
        revalidatePath(`/tool/${item?.name.toLowerCase().replace(/\s+/g, '-')}`); // Revalidate tool page

        return { success: true, status };
    } catch (error) {
        console.error('Admin action processing error:', error);
        return { error: 'Internal server error', status: 500 };
    }
}
