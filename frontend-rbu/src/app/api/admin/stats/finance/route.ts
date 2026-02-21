import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = createAdminClient();

        // 1. Get total revenue (sum of payment_amount for paid items)
        const { data: revenueData, error: revenueError } = await supabase
            .from('items')
            .select('payment_amount, created_at')
            .eq('payment_status', 'paid');

        if (revenueError) throw revenueError;

        const totalRevenue = revenueData.reduce((sum, item) => sum + (Number(item.payment_amount) || 0), 0);

        // 2. Get recent transactions (latest 5 paid items)
        const { data: recentTransactions, error: transactionsError } = await supabase
            .from('items')
            .select(`
                id,
                name,
                payment_amount,
                payment_status,
                transaction_id,
                created_at,
                submitter_email
            `)
            .eq('payment_status', 'paid')
            .order('created_at', { ascending: false })
            .limit(5);

        if (transactionsError) throw transactionsError;

        // 3. Get pending paid submissions count
        const { count: pendingPaidCount, error: pendingError } = await supabase
            .from('items')
            .select('*', { count: 'exact', head: true })
            .eq('payment_status', 'paid')
            .eq('status', 'pending');

        if (pendingError) throw pendingError;

        return NextResponse.json({
            stats: {
                totalRevenue,
                totalTransactions: revenueData.length,
                pendingPaidCount: pendingPaidCount || 0
            },
            recentTransactions
        });

    } catch (error) {
        console.error('Error fetching admin finance stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
