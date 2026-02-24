
import { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft } from 'lucide-react';
import { ItemWithDetails, ReviewWithItem } from '@/types/models';
import { ProfileView } from '@/components/ProfileView';

export const metadata: Metadata = {
    title: 'My Profile - RankedByUs',
    description: 'View your activity, votes, and reviews on RankedByUs.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;


export default async function ProfilePage() {
    const supabase = await createClient();
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('rbu_session_id')?.value;

    const { data: { user } } = await supabase.auth.getUser();

    // Claim session history if user is logged in
    if (user && sessionId) {
        // Update instead of using rpc due to schema changes where items table has no session_id
        await Promise.allSettled([
            supabase.from('votes')
                .update({ user_id: user.id })
                .eq('session_id', sessionId)
                .is('user_id', null),
            supabase.from('reviews')
                .update({ user_id: user.id })
                .eq('session_id', sessionId)
                .is('user_id', null)
        ]);
    }

    // If user somehow bypasses middleware but isn't logged in, redirect them
    if (!user) {
        redirect('/login?next=/profile');
    }

    // 1. Fetch Upvoted Items
    let votesQuery = supabase.from('votes').select(`
            item_id,
            value,
            created_at,
            items (
                *,
                categories (name, slug)
            )
        `)
        .eq('value', 1)
        .order('created_at', { ascending: false });

    if (user) {
        votesQuery = votesQuery.eq('user_id', user.id);
    } else if (sessionId) {
        votesQuery = votesQuery.eq('session_id', sessionId);
    }

    const { data: votes, error: votesError } = await votesQuery;
    if (votesError) console.error("Profile page votes error:", votesError);
    const upvotedToolsRaw = votes?.map(v => v.items).filter(Boolean) as unknown as ItemWithDetails[] || [];
    // Deduplicate items just in case the query returns multiple vote records for the same item
    const upvotedTools = Array.from(new Map(upvotedToolsRaw.map(item => [item.id, item])).values());

    // 2. Fetch User Reviews
    let reviewsQuery = supabase.from('reviews').select(`
            *,
            items (*)
        `)
        .order('created_at', { ascending: false });

    if (user) {
        reviewsQuery = reviewsQuery.eq('user_id', user.id);
    } else if (sessionId) {
        reviewsQuery = reviewsQuery.eq('session_id', sessionId);
    }

    const { data: reviews, error: reviewsError } = await reviewsQuery;
    if (reviewsError) console.error("Profile page reviews error:", reviewsError);

    // 3. Fetch User Submissions
    let submissionsQuery = supabase.from('items').select(`
            *,
            categories (name, slug)
        `)
        .order('created_at', { ascending: false });

    if (user) {
        submissionsQuery = submissionsQuery.eq('user_id', user.id);
    } else {
        // Items table currently does not track anonymous session submissions
        submissionsQuery = submissionsQuery.eq('id', '00000000-0000-0000-0000-000000000000');
    }

    const { data: submissions, error: submissionsError } = await submissionsQuery;
    if (submissionsError) console.error("Profile page submissions error:", submissionsError);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <ArrowLeft size={18} />
                            </div>
                            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest hidden sm:block">Back to Registry</span>
                        </Link>
                        <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                            {'My Profile'}
                        </h1>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">


                <ProfileView
                    displayName={user ? (user.user_metadata?.full_name || 'Authenticated User') : 'Anonymous User'}
                    displayIdentifier={user?.email || `Session: ${sessionId?.slice(0, 8)}...`}
                    isAnonymous={!user}
                    upvotedTools={upvotedTools as unknown as ItemWithDetails[] || []}
                    reviews={reviews as unknown as ReviewWithItem[] || []}
                    submissions={submissions as unknown as ItemWithDetails[] || []}
                />
            </main>
        </div>
    );
}
