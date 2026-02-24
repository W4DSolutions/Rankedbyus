import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email';

import { verifyAdmin } from '@/lib/auth-guards';

export async function POST(request: NextRequest) {
    // Auth Guard
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    try {
        const { claimId, action } = await request.json();

        if (!claimId || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (action === 'approve') {
            // Get item_id and email
            const { data: claim, error: fetchError } = await supabase
                .from('claim_requests')
                .select('item_id, email, items(name)')
                .eq('id', claimId)
                .single();

            if (fetchError || !claim) throw new Error('Claim not found');
            const itemName = (claim.items as any)?.name || 'your tool';

            const { error: updateError } = await supabase
                .from('claim_requests')
                .update({ status: 'approved' })
                .eq('id', claimId);

            if (updateError) throw updateError;

            // Mark the tool as verified
            const { error: itemError } = await supabase
                .from('items')
                .update({ is_verified: true })
                .eq('id', claim.item_id);

            if (itemError) throw itemError;

            // Notify Founder
            await sendEmail({
                to: claim.email,
                subject: `Identity Verified: You now own ${itemName}`,
                template: 'claim_approved',
                data: { itemName }
            });
        } else if (action === 'reject') {
            const { data: claim } = await supabase
                .from('claim_requests')
                .select('email, items(name)')
                .eq('id', claimId)
                .single();

            const { error: updateError } = await supabase
                .from('claim_requests')
                .update({ status: 'rejected' })
                .eq('id', claimId);

            if (updateError) throw updateError;

            if (claim) {
                const itemName = (claim.items as any)?.name || 'your tool';
                await sendEmail({
                    to: claim.email,
                    subject: `Founder Claim Update: ${itemName}`,
                    template: 'claim_rejected',
                    data: { itemName, reason: 'Verifiable information was missing or incorrect.' }
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Claim action error:', error);
        return NextResponse.json({ error: 'Failed to process action' }, { status: 500 });
    }
}
