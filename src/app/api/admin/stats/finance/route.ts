import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-guards";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const isAdmin = await verifyAdmin();

    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const supabase = createAdminClient();

        // 1. Get total revenue (sum of payment_amount for paid items)
        const { data: revenueData, error: revenueError } = await supabase
            .from('items')
            .select('payment_amount, created_at')
            .eq('payment_status', 'paid');

        // If columns don't exist yet, return empty stats gracefully
        if (revenueError) {
            console.warn('Finance stats query failed (columns may not exist yet):', revenueError.message);
            return NextResponse.json({
                stats: {
                    totalRevenue: 0,
                    totalTransactions: 0,
                    pendingPaidCount: 0
                },
                recentTransactions: []
            });
        }

        const totalRevenue = (revenueData || []).reduce((sum: number, item: { payment_amount: number }) => sum + (Number(item.payment_amount) || 0), 0);

        // 2. Get recent transactions (latest 5 paid items)
        const { data: recentTransactions } = await supabase
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

        // 3. Get pending paid submissions count
        const { count: pendingPaidCount } = await supabase
            .from('items')
            .select('*', { count: 'exact', head: true })
            .eq('payment_status', 'paid')
            .eq('status', 'pending');

        return NextResponse.json({
            stats: {
                totalRevenue,
                totalTransactions: (revenueData || []).length,
                pendingPaidCount: pendingPaidCount || 0
            },
            recentTransactions: recentTransactions || []
        });

    } catch (error) {
        console.error('Error fetching admin finance stats:', error);
        return NextResponse.json({
            stats: {
                totalRevenue: 0,
                totalTransactions: 0,
                pendingPaidCount: 0
            },
            recentTransactions: []
        });
    }
}
