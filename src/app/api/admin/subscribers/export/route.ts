import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdmin } from '@/lib/auth-guards';

export async function GET(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .select('email, source, status, created_at')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Convert to CSV
        const headers = ['Email', 'Source', 'Status', 'Subscribed At'];
        const rows = (data || []).map(sub => [
            sub.email,
            sub.source || 'n/a',
            sub.status,
            new Date(sub.created_at).toISOString()
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename=subscribers-${new Date().toISOString().split('T')[0]}.csv`
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
