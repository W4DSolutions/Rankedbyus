import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
    const supabase = createAdminClient();

    try {
        const { itemId, email, proofUrl, message } = await request.json();

        if (!itemId || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { error } = await supabase
            .from('claim_requests')
            .insert({
                item_id: itemId,
                email: email,
                proof_url: proofUrl,
                message: message,
                status: 'pending'
            });

        if (error) {
            console.error('Claim submission error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
