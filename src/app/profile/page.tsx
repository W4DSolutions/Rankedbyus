import { Metadata } from 'next';
import Link from 'next/link';
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
    const { data: { user } } = await supabase.auth.getUser();

    // STRICT GUARD: No anonymous profile access
    if (!user) {
        redirect('/login?next=/profile');
    }

    // 1. Fetch Upvoted Items
    const { data: votes, error: votesError } = await supabase
        .from('votes')
        .select(`
            item_id,
            value,
            created_at,
            items (
                *,
                categories (name, slug)
            )
        `)
        .eq('user_id', user.id)
        .eq('value', 1)
        .order('created_at', { ascending: false });

    if (votesError) console.error("Profile page votes error:", votesError);
    const upvotedToolsRaw = votes?.map(v => v.items).filter(Boolean) as unknown as ItemWithDetails[] || [];
    // Deduplicate
    const upvotedTools = Array.from(new Map(upvotedToolsRaw.map(item => [item.id, item])).values());

    // 2. Fetch User Reviews (Reviews written BY the user)
    const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
            *,
            items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (reviewsError) console.error("Profile page reviews error:", reviewsError);

    // 3. Fetch User Submissions
    const { data: submissions, error: submissionsError } = await supabase
        .from('items')
        .select(`
            *,
            categories (name, slug)
        `)
        .or(`user_id.eq.${user.id},submitter_email.eq.${user.email}`)
        .order('created_at', { ascending: false });

    if (submissionsError) console.error("Profile page submissions error:", submissionsError);

    // 4. Fetch Reviews ON User's Tools (For Founder Replies)
    const userToolIds = submissions?.map(s => s.id) || [];
    const { data: receivedReviews, error: receivedError } = await supabase
        .from('reviews')
        .select(`
            *,
            items (name, slug, logo_url)
        `)
        .in('item_id', userToolIds)
        .order('created_at', { ascending: false });

    if (receivedError) console.error("Profile page received reviews error:", receivedError);

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
                    displayName={user.user_metadata?.full_name || 'Authenticated User'}
                    displayIdentifier={user.email || 'Verified Member'}
                    isAnonymous={false}
                    upvotedTools={upvotedTools as unknown as ItemWithDetails[] || []}
                    reviews={reviews as unknown as ReviewWithItem[] || []}
                    submissions={submissions as unknown as ItemWithDetails[] || []}
                    receivedReviews={receivedReviews as unknown as ReviewWithItem[] || []}
                />
            </main>
        </div>
    );
}
