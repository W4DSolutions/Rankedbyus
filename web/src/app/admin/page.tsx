import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
    const supabase = await createClient();

    // Fetch pending submissions
    const { data: pendingItems } = await supabase
        .from('items')
        .select(`
      *,
      categories:category_id (name, slug)
    `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    const pendingSubmissions = pendingItems || [];

    // Fetch stats
    const { count: totalApproved } = await supabase
        .from('items')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

    const { count: totalVotes } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true });

    const { count: totalCategories } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                                <span className="text-xl font-bold text-white">R</span>
                            </div>
                            <h1 className="text-xl font-bold text-white">RankedByUs Admin</h1>
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-400">Admin Panel</span>
                            <Link
                                href="/"
                                className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                            >
                                Back to Site
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Dashboard */}
            <section className="py-8 border-b border-slate-700/50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6">
                            <div className="text-sm text-slate-400">Pending Reviews</div>
                            <div className="mt-2 text-3xl font-bold text-yellow-400">{pendingSubmissions.length}</div>
                        </div>
                        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6">
                            <div className="text-sm text-slate-400">Total Tools</div>
                            <div className="mt-2 text-3xl font-bold text-white">{totalApproved || 0}</div>
                        </div>
                        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6">
                            <div className="text-sm text-slate-400">Total Votes</div>
                            <div className="mt-2 text-3xl font-bold text-white">{totalVotes || 0}</div>
                        </div>
                        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6">
                            <div className="text-sm text-slate-400">Categories</div>
                            <div className="mt-2 text-3xl font-bold text-white">{totalCategories || 0}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pending Submissions */}
            <section className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Pending Submissions</h2>
                        <div className="text-sm text-slate-400">
                            {pendingSubmissions.length} awaiting review
                        </div>
                    </div>

                    <div className="space-y-4">
                        {pendingSubmissions.map((submission: any) => (
                            <div
                                key={submission.id}
                                className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-semibold text-white">
                                                {submission.name}
                                            </h3>
                                            <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
                                                Pending
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-400">
                                            {submission.description}
                                        </p>
                                        <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                                            <span>Category: {submission.categories?.name || 'Unknown'}</span>
                                            <span>•</span>
                                            <a
                                                href={submission.website_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                {submission.website_url}
                                            </a>
                                            <span>•</span>
                                            <span>
                                                {new Date(submission.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 ml-6">
                                        <button
                                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                                            onClick={() => alert('Approve functionality coming soon!')}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="rounded-lg border border-red-600 bg-red-600/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-600/20 transition-colors"
                                            onClick={() => alert('Reject functionality coming soon!')}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {pendingSubmissions.length === 0 && (
                        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-12 text-center">
                            <div className="text-5xl mb-4">✓</div>
                            <h3 className="text-xl font-semibold text-white">All caught up!</h3>
                            <p className="mt-2 text-slate-400">No pending submissions to review.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
