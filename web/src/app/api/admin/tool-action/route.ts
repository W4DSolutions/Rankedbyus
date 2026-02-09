import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
    try {
        const { id, action } = await request.json();

        if (!id || !['approve', 'reject'].includes(action)) {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }

        // Potential for password check here if we don't have middleware yet
        // const authHeader = request.headers.get('authorization');
        // if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) ...

        const supabase = createAdminClient();
        const status = action === 'approve' ? 'approved' : 'rejected';

        const { error } = await (supabase
            .from('items') as any)
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error('Admin tool action error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, status });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
