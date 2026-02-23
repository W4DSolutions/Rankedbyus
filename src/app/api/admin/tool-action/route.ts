import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { ItemStatus } from '@/types/models';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as { id: string; action: string; tags?: string[] };
        const { id, action } = body;

        if (!id || !['approve', 'reject'].includes(action)) {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }

        const supabase = createAdminClient() as any;
        const status = (action === 'approve' ? 'approved' : 'rejected') as ItemStatus;

        const { error } = await supabase
            .from('items')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error('Admin tool action error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (status === 'approved' && body.tags && Array.isArray(body.tags)) {
            const tagInserts = body.tags.map((tagId: string) => ({
                item_id: id,
                tag_id: tagId
            }));

            if (tagInserts.length > 0) {
                // Remove existing tags first to be safe (though for pending items usually none)
                await supabase.from('item_tags').delete().eq('item_id', id);

                const { error: tagError } = await supabase
                    .from('item_tags')
                    .insert(tagInserts);

                if (tagError) {
                    console.error('Error adding tags:', tagError);
                    // Don't fail the whole request, but log it
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
                    data: { name: item.name }
                });
            } else if (status === 'rejected') {
                await sendEmail({
                    to: item.submitter_email,
                    subject: `Status Update: Submissions regarding ${item.name}`,
                    template: 'item_rejected',
                    data: { name: item.name }
                });
            }
        }

        return NextResponse.json({ success: true, status });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
