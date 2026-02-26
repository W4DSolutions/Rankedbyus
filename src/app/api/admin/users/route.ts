import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-guards";

export async function GET() {
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const supabase = createAdminClient();

        // 1. Get raw users from auth schema (requires service role with access to auth schema)
        // Note: Supabase JS client doesn't expose auth.users table directly easily.
        // Usually, the best practice is to have a public.users table synced via triggers.
        // However, we can use the admin.auth.listUsers() API if we have the service role key.

        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

        if (usersError) throw usersError;

        // 2. Enhance user data with activity stats (votes, submissions)
        // We'll do this by querying votes and items and aggregating by user_id
        const userIds = users.map(u => u.id);

        if (userIds.length === 0) {
            return NextResponse.json({ users: [] });
        }

        // Get submission counts
        const { data: submissions } = await supabase
            .from('items')
            .select('user_id')
            .in('user_id', userIds);

        // Get vote counts
        const { data: votes } = await supabase
            .from('votes')
            .select('user_id')
            .in('user_id', userIds);

        // Map counts
        const submissionCounts = (submissions || []).reduce((acc: any, item: any) => {
            acc[item.user_id] = (acc[item.user_id] || 0) + 1;
            return acc;
        }, {});

        const voteCounts = (votes || []).reduce((acc: any, vote: any) => {
            acc[vote.user_id] = (acc[vote.user_id] || 0) + 1;
            return acc;
        }, {});

        // Format response
        const enhancedUsers = users.map(u => ({
            id: u.id,
            email: u.email,
            created_at: u.created_at,
            last_sign_in_at: u.last_sign_in_at,
            submission_count: submissionCounts[u.id] || 0,
            vote_count: voteCounts[u.id] || 0,
            role: u.user_metadata?.role || 'user' // Assuming metadata or just default
        }));

        // Sort by most recent sign in
        enhancedUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return NextResponse.json({ users: enhancedUsers });

    } catch (error) {
        console.error('Error fetching admin users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
