import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { StarRating } from "@/components/StarRating";
import { TagBadge } from "@/components/TagBadge";
import { ReviewModal } from "@/components/ReviewModal";
import { VoteButtons } from "@/components/VoteButtons";
import { ToolCard } from "@/components/ToolCard";
import { cn } from "@/lib/utils";
import type { ItemWithDetails } from "@/types/models";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const supabase = await createClient();
    const { slug } = await params;

    const { data: item } = await supabase
        .from('items')
        .select('name, description')
        .eq('slug', slug)
        .single();

    if (!item) return { title: 'Tool Not Found' };

    return {
        title: `${item.name} Reviews & Rankings (2026) - RankedByUs`,
        description: item.description || `Read community reviews and see where ${item.name} ranks in the 2026 AI tool leaderboards.`,
        openGraph: {
            title: `${item.name} | RankedByUs`,
            description: item.description || undefined,
            type: 'website',
        },
    };
}

export default async function ToolDetailPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const supabase = await createClient();
    const { slug } = await params;

    // 1. Fetch tool details with category and tags
    const { data: itemData, error } = await supabase
        .from('items')
        .select(`
            *,
            categories:category_id (id, name, slug),
            item_tags (
                tags (*)
            )
        `)
        .eq('slug', slug)
        .single();

    if (error || !itemData) {
        notFound();
    }

    const tool = itemData as ItemWithDetails;

    // 2. Fetch approved reviews
    const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('item_id', tool.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

    // 3. Fetch related tools (same category)
    const { data: relatedTools } = await supabase
        .from('items')
        .select(`
            *,
            categories:category_id (id, name, slug),
            item_tags (
                tags (*)
            )
        `)
        .eq('category_id', tool.category_id)
        .eq('status', 'approved')
        .neq('id', tool.id)
        .limit(3)
        .order('score', { ascending: false });

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
                            <h1 className="text-xl font-bold text-white">RankedByUs</h1>
                        </Link>
                        <nav className="flex items-center gap-6">
                            <Link href="/#categories" className="text-sm text-slate-300 hover:text-white transition-colors">
                                Categories
                            </Link>
                            {tool.categories && (
                                <Link href={`/category/${tool.categories.slug}`} className="text-sm text-blue-400 hover:text-blue-300 font-bold uppercase tracking-widest text-[10px]">
                                    Back to {tool.categories.name}
                                </Link>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    <div className="lg:col-span-2">
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                            <div className="h-32 w-32 rounded-3xl bg-slate-900 border border-slate-700/50 overflow-hidden flex items-center justify-center p-4 shadow-2xl">
                                <img
                                    src={tool.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=1e293b&color=fff&size=128&bold=true`}
                                    alt={tool.name}
                                    className="h-full w-full object-contain rounded-xl"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-4">
                                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                                        {tool.name}
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {tool.item_tags?.map((it: any) => (
                                            <TagBadge
                                                key={it.tags.id}
                                                name={it.tags.name}
                                                slug={it.tags.slug}
                                                color={it.tags.color}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-center md:justify-start items-center gap-4 mb-6">
                                    <StarRating rating={tool.average_rating} size="lg" />
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                                        {tool.average_rating.toFixed(1)} / 5 ({tool.review_count} Reviews)
                                    </span>
                                </div>
                                <p className="text-lg text-slate-300 leading-relaxed mb-8">
                                    {tool.description}
                                </p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <a
                                        href={tool.affiliate_link || tool.website_url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40"
                                    >
                                        Visit Official Website
                                    </a>
                                    <div className="flex items-center gap-4 px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-md">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Community Rank</span>
                                        <VoteButtons
                                            itemId={tool.id}
                                            initialScore={tool.score}
                                            initialVoteCount={tool.vote_count}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Community Reviews Section */}
                        <div className="mt-20">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-white">Community Reviews</h3>
                                <ReviewModal itemId={tool.id} itemName={tool.name} />
                            </div>

                            <div className="space-y-6">
                                {(reviews || []).length === 0 ? (
                                    <div className="rounded-2xl border border-slate-700/30 bg-slate-800/10 p-12 text-center italic text-slate-500">
                                        No reviews yet. Be the first to share your thoughts!
                                    </div>
                                ) : (
                                    reviews?.map((review) => (
                                        <div key={review.id} className="rounded-2xl border border-slate-700/30 bg-slate-800/20 p-6 backdrop-blur-sm">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold text-xs">
                                                        {review.session_id.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white">Verified User</div>
                                                        <StarRating rating={review.rating} size="sm" />
                                                    </div>
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <p className="text-slate-300 italic leading-relaxed">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-12">
                        {/* Tool DNA / Metrics */}
                        <div className="rounded-3xl border border-slate-700/50 bg-slate-800/40 p-8 backdrop-blur-md">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Tool Overview</h4>
                            <div className="space-y-6">
                                <div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Category</div>
                                    {tool.categories ? (
                                        <Link href={`/category/${tool.categories.slug}`} className="text-white hover:text-blue-400 font-bold transition-colors">
                                            {tool.categories.name}
                                        </Link>
                                    ) : (
                                        <span className="text-white font-bold">Uncategorized</span>
                                    )}
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Community Score</div>
                                    <div className="text-2xl font-black text-white">{tool.score.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Verification Status</div>
                                    <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Verified 2026
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Related Rankings */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Related Rankings</h4>
                            <div className="space-y-4">
                                {relatedTools?.map((related) => (
                                    <Link
                                        key={related.id}
                                        href={`/tool/${related.slug}`}
                                        className="flex items-center gap-4 group rounded-2xl p-4 border border-slate-700/30 hover:border-blue-500/30 hover:bg-slate-800/50 transition-all"
                                    >
                                        <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-700/50 overflow-hidden flex items-center justify-center p-2">
                                            <img
                                                src={related.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(related.name)}&background=1e293b&color=fff&size=64&bold=true`}
                                                alt={related.name}
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="text-sm font-bold text-white group-hover:text-blue-400 truncate transition-colors">
                                                {related.name}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <StarRating rating={related.average_rating} size="xs" />
                                                <span className="text-[9px] text-slate-500">#{related.score}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* CTA / Support */}
                        <div className="rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 border border-blue-500/30">
                            <h4 className="font-bold text-white mb-2">Notice a mistake?</h4>
                            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                                Our community rankings are verified daily. If any info for {tool.name} is outdated, please let us know.
                            </p>
                            <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all">
                                Report Issue
                            </button>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "SoftwareApplication",
                        "name": tool.name,
                        "description": tool.description,
                        "applicationCategory": tool.categories?.name || "Software",
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": tool.average_rating || 0,
                            "ratingCount": tool.review_count || 1,
                            "bestRating": "5",
                            "worstRating": "1"
                        }
                    })
                }}
            />
        </div>
    );
}
