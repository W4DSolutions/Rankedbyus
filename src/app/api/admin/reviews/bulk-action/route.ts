import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdmin } from '@/lib/auth-guards';

export async function POST(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { ids, action } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0 || !['approve', 'reject'].includes(action)) {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }

        const supabase = createAdminClient();
        const status = action === 'approve' ? 'approved' : 'rejected';

        const { error } = await supabase
            .from('reviews')
            .update({ status })
            .in('id', ids);

        if (error) {
            console.error('Bulk review action error:', error);
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true, count: ids.length });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
