import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AdminActionButtons } from "@/components/AdminActionButtons";
import { AdminReviewActionButtons } from "@/components/AdminReviewActionButtons";
import { AdminAssetList } from "@/components/AdminAssetList";
import { AdminArticleList } from "@/components/AdminArticleList";
import { AdminClaimRequests } from "@/components/AdminClaimRequests";
import { AdminFinanceStats } from "@/components/AdminFinanceStats";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { cn, formatDate } from "@/lib/utils";
import {
    Layout,
    MessageSquare,
    Database,
    TrendingUp,
    Layers,
    Clock,
    ShieldCheck,
    ArrowUpRight,
    Star,
    CheckCircle2,
    Search,
    FileText,
    BarChart3,
    Sparkles,
    Users
} from "lucide-react";
import type { ItemWithDetails, Review, Article } from "@/types/models";
import { TrafficChart } from "@/components/TrafficChart";
import { AdminReviewList } from "@/components/AdminReviewList";
import { AdminUserList } from "@/components/AdminUserList";
import { ToolIcon } from "@/components/ToolIcon";


// Force refresh
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const supabase = createAdminClient();

    // Fetch pending submissions
    const { data: pendingItems } = await supabase
        .from('items')
        .select(`
            *,
            categories:category_id (name, slug)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    const pendingSubmissions = (pendingItems || []) as ItemWithDetails[];

    // Fetch approved assets for management
    const { data: approvedItems } = await supabase
        .from('items')
        .select(`
            *,
            categories:category_id (name, slug)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

    const approvedAssets = (approvedItems || []) as ItemWithDetails[];

    // Fetch pending reviews
    const { data: pendingReviewsData } = await supabase
        .from('reviews')
        .select(`
            *,
            items:item_id (name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    const pendingReviews = (pendingReviewsData || []) as (Review & { items: { name: string } })[];

    // Fetch pending claim requests
    const { data: claimRequestsData } = await supabase
        .from('claim_requests')
        .select(`
            *,
            items:item_id (name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    const claimRequests = (claimRequestsData || []) as any[]; // cast properly later or use any for now

    // Fetch stats
    const { count: totalApproved } = await supabase
        .from('items')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

    const { count: totalVotes } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true });

    // Fetch Vote Velocity (last 24h)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    const { count: votesLast24h } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', twentyFourHoursAgo.toISOString());

    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    const { count: totalCategories } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });

    const { count: totalSubscribers } = await supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true });

    // Fetch Articles
    const { data: articlesData } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

    // Fetch Analytics Trends (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoIso = thirtyDaysAgo.toISOString();

    const { data: clicksTrend } = await supabase
        .from('clicks')
        .select('created_at')
        .gte('created_at', thirtyDaysAgoIso);

    const { data: viewsTrend } = await supabase
        .from('article_views')
        .select('created_at')
        .gte('created_at', thirtyDaysAgoIso);

    // Process Trend Data
    const chartDataMap = new Map<string, { views: number; clicks: number }>();

    // Initialize last 30 days with 0
    for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().split('T')[0];
        chartDataMap.set(dateKey, { views: 0, clicks: 0 });
    }

    (clicksTrend || []).forEach((c: any) => {
        const dateKey = new Date(c.created_at).toISOString().split('T')[0];
        if (chartDataMap.has(dateKey)) {
            const current = chartDataMap.get(dateKey)!;
            chartDataMap.set(dateKey, { ...current, clicks: current.clicks + 1 });
        }
    });

    (viewsTrend || []).forEach((v: any) => {
        const dateKey = new Date(v.created_at).toISOString().split('T')[0];
        if (chartDataMap.has(dateKey)) {
            const current = chartDataMap.get(dateKey)!;
            chartDataMap.set(dateKey, { ...current, views: current.views + 1 });
        }
    });

    const chartData = Array.from(chartDataMap.entries())
        .map(([date, counts]) => ({ date, ...counts }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const articles = (articlesData || []) as Article[];
    const { count: totalArticles } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });

    // Fetch Top Articles
    const { data: topArticles } = await supabase
        .from('articles')
        .select('title, slug, view_count, author_name')
        .order('view_count', { ascending: false })
        .limit(5);

    // Fetch Top Tools by Clicks
    const { data: topTools } = await supabase
        .from('items')
        .select('name, slug, click_count, logo_url')
        .eq('status', 'approved')
        .order('click_count', { ascending: false })
        .limit(5);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            {/* Header */}
            <header className="sticky top-0 z-[40] border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-blue-600 shadow-lg group-hover:scale-110 transition-transform">
                                <span className="text-xl font-black text-white uppercase">R</span>
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Command Center</h1>
                        </Link>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <AdminLogoutButton />
                            <Link
                                href="/"
                                className="rounded-xl border border-slate-200 dark:border-slate-800 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
                            >
                                Back to Site
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                {/* Analytics Chart */}
                <section className="mb-16">
                    <div className="flex items-center gap-2 mb-6 text-purple-600 dark:text-purple-400">
                        <BarChart3 size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Traffic Intelligence (30 Days)</span>
                    </div>
                    <TrafficChart data={chartData} />
                </section>

                <section className="mb-16">
                    <div className="flex items-center gap-2 mb-6 text-emerald-600 dark:text-emerald-400">
                        <TrendingUp size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Financial Overview</span>
                    </div>
                    <AdminFinanceStats />
                </section>

                {/* Stats Grid */}
                <section className="mb-16">
                    <div className="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400">
                        <TrendingUp size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Operational Metrics</span>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 shadow-sm">
                            <div className="flex items-center gap-3 text-slate-400 mb-3">
                                <Clock size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Awaiting Audit</span>
                            </div>
                            <div className="text-4xl font-black text-slate-900 dark:text-white">{pendingSubmissions.length}</div>
                            <div className="mt-1 text-xs font-bold text-slate-500">Pending Tools</div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 shadow-sm">
                            <div className="flex items-center gap-3 text-slate-400 mb-3">
                                <MessageSquare size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Moderation</span>
                            </div>
                            <div className="text-4xl font-black text-slate-900 dark:text-white">{pendingReviews.length}</div>
                            <div className="mt-1 text-xs font-bold text-slate-500">Pending Reviews</div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 shadow-sm">
                            <div className="flex items-center gap-3 text-slate-400 mb-3">
                                <Database size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Registry Total</span>
                            </div>
                            <div className="text-4xl font-black text-slate-900 dark:text-white">{totalApproved || 0}</div>
                            <div className="mt-1 text-xs font-bold text-slate-500">Approved Assets</div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 shadow-sm">
                            <div className="flex items-center gap-3 text-slate-400 mb-3">
                                <ShieldCheck size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-purple-500">Founder Claims</span>
                            </div>
                            <div className="text-4xl font-black text-slate-900 dark:text-white">{claimRequests.length}</div>
                            <div className="mt-1 text-xs font-bold text-slate-500">Pending Identity</div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 shadow-sm">
                            <div className="flex items-center gap-3 text-slate-400 mb-3">
                                <Layers size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Interactions</span>
                            </div>
                            <div className="text-4xl font-black text-slate-900 dark:text-white">{totalVotes || 0}</div>
                            <div className="mt-1 text-xs font-bold text-slate-500">
                                {votesLast24h || 0} in last 24h
                            </div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Search size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">Audience</span>
                                </div>
                                <a
                                    href="/api/admin/subscribers/export"
                                    download
                                    className="text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Export CSV
                                </a>
                            </div>
                            <div className="text-4xl font-black text-slate-900 dark:text-white">{totalSubscribers || 0}</div>
                            <div className="mt-1 text-xs font-bold text-slate-500">Elite Leads</div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 shadow-sm">
                            <div className="flex items-center gap-3 text-slate-400 mb-3">
                                <FileText size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-purple-500">Knowledge Base</span>
                            </div>
                            <div className="text-4xl font-black text-slate-900 dark:text-white">{totalArticles || 0}</div>
                            <div className="mt-1 text-xs font-bold text-slate-500">Deep Dives Published</div>
                        </div>
                    </div>
                </section>

                {/* Top Performers Grid */}
                <section className="mb-24">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Top Articles */}
                        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-10 w-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-600">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">High-Signal Intelligence</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Top Articles by Views</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {(topArticles || []).map((art: any, idx) => (
                                    <div key={art.slug} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 group hover:bg-purple-500/5 transition-all">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xl font-black text-slate-200 dark:text-slate-800">0{idx + 1}</span>
                                            <div>
                                                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">{art.title || 'Untitled'}</h4>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{art.author_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-black text-purple-600">{art.view_count || 0}</span>
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Views</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Tools */}
                        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Active Deployments</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Top Tools by Outbound Clicks</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {(topTools || []).map((tool: any, idx) => (
                                    <div key={tool.slug} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 group hover:bg-blue-500/5 transition-all">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xl font-black text-slate-200 dark:text-slate-800">0{idx + 1}</span>
                                            <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-950 flex items-center justify-center p-1 border border-slate-100 dark:border-slate-800 overflow-hidden">
                                                <ToolIcon
                                                    url={tool.logo_url}
                                                    name={tool.name}
                                                    websiteUrl={tool.website_url}
                                                    fill
                                                    className="h-full w-full"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">{tool.name}</h4>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{tool.slug}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-black text-blue-600">{tool.click_count || 0}</span>
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Clicks</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mb-24">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Identity Verification</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Founder Claim Queue</p>
                        </div>
                    </div>
                    <AdminClaimRequests requests={claimRequests} />
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Pending Submissions */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                    <Layout size={18} />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Asset Ingress</h2>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pendingSubmissions.length} Pending</span>
                        </div>

                        <div className="space-y-4">
                            {pendingSubmissions.map((submission) => (
                                <div
                                    key={submission.id}
                                    className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm hover:border-blue-500/30 transition-all"
                                >
                                    <div className="flex items-start justify-between relative z-10">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                                    {submission.name}
                                                </h3>
                                                <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    {submission.categories?.name}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-4">
                                                {submission.description || "No description provided."}
                                            </p>
                                            <div className="flex items-center gap-4">
                                                <a
                                                    href={submission.website_url ?? undefined}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline"
                                                >
                                                    View Source <ArrowUpRight size={12} />
                                                </a>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    Received {formatDate(submission.created_at)}
                                                </span>
                                                {/* Payment Status Badge */}
                                                {submission.payment_status === 'paid' ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                                        <CheckCircle2 size={10} className="fill-current text-emerald-500/20" /> Paid
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                        Unpaid
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <AdminActionButtons id={submission.id} />
                                    </div>
                                </div>
                            ))}

                            {pendingSubmissions.length === 0 && (
                                <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-16 text-center">
                                    <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Queue Depleted</h3>
                                    <p className="mt-2 text-sm text-slate-500 font-medium">All incoming assets have been audited.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Pending Reviews */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <MessageSquare size={18} />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Signal Moderation</h2>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pendingReviews.length} Pending</span>
                        </div>

                        <div className="space-y-4">
                            <AdminReviewList reviews={pendingReviews as any} />
                        </div>
                    </section>
                </div>

                {/* Approved Assets Management */}
                <section className="mt-16 pt-16 border-t border-slate-100 dark:border-slate-800">
                    <AdminAssetList initialAssets={approvedAssets} categories={categories || []} />
                </section>

                {/* User Management */}
                <section className="mt-16 pt-16 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <Users size={20} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Tactical Personnel</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">User Database & Activity</p>
                        </div>
                    </div>
                    <AdminUserList />
                </section>

                {/* Content Management */}
                <section className="mt-16 pt-16 border-t border-slate-100 dark:border-slate-800">
                    <AdminArticleList initialArticles={articles} items={approvedAssets} />
                </section>
            </main>
        </div >
    );
}
