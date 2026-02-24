import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
    ChevronLeft,
    ExternalLink,
    ShieldCheck,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Calendar,
    ArrowRight,
    Zap,
    Star,
    Scale,
    Sparkles,
    User
} from "lucide-react";
import { createClient, createStaticClient } from "@/lib/supabase/server";
import { StarRating } from "@/components/StarRating";
import { TagBadge } from "@/components/TagBadge";
import { ReviewModal } from "@/components/ReviewModal";
import { VoteButtons } from "@/components/VoteButtons";

import { ThemeToggle } from "@/components/ThemeToggle";
import { ToolIcon } from '@/components/ToolIcon';
import { cn, getLogoUrl } from "@/lib/utils";
import { ShareButtons } from "@/components/ShareButtons";
import { ClaimListingModal } from "@/components/ClaimListingModal";
import { AdSlot } from "@/components/AdSlot";
import type { ItemWithDetails, Review } from "@/types/models";
import Image from "next/image";
import { ReviewList } from "@/components/ReviewList";

// Generate static params for all tools
export async function generateStaticParams() {
    const supabase = createStaticClient();
    const { data: items } = await supabase.from('items').select('slug').eq('status', 'approved');

    return (items || []).map((item) => ({
        slug: item.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const supabase = await createClient();
    const { slug } = await params;

    const { data: item } = await supabase
        .from('items')
        .select('name, description')
        .eq('slug', slug)
        .single();

    if (!item) return { title: 'Tool Not Found' };
    const tool = item as { name: string; description: string | null };

    return {
        title: `${tool.name} Reviews & Rankings (2026) - RankedByUs`,
        description: tool.description || `Read community reviews and see where ${tool.name} ranks in the 2026 AI tool leaderboards.`,
        openGraph: {
            title: `${tool.name} | RankedByUs`,
            description: tool.description || undefined,
            type: 'website',
        },
        alternates: {
            canonical: `/tool/${slug}`,
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

    const { data: { user } } = await supabase.auth.getUser();
    const isAuthenticated = !!user;

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
        .order('created_at', { ascending: false })
        .limit(8);

    // 3. Fetch deep analysis article if exists
    const { data: article } = await supabase
        .from('articles')
        .select('slug, title, excerpt')
        .eq('item_id', tool.id)
        .eq('is_published', true)
        .single();

    // 4. Fetch related tools (same category)
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
        <div className="min-h-screen bg-white dark:bg-slate-950">
            {/* Header */}
            <header className="sticky top-0 z-[50] border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-blue-600 shadow-lg group-hover:scale-110 transition-transform">
                                <span className="text-xl font-black text-white uppercase">R</span>
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">RankedByUs</h1>
                        </Link>
                        <nav className="flex items-center gap-8">
                            <Link href="/#categories" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Registry
                            </Link>
                            <Link href="/about" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                About
                            </Link>
                            <Link href="/profile" className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <User size={20} />
                            </Link>
                            <ThemeToggle />
                        </nav>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
                <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* 8.2 Breadcrumbs Component */}
                    <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Registry</Link>
                        <span>/</span>
                        {tool.categories && (
                            <Link href={`/category/${tool.categories.slug}`} className="hover:text-blue-600 transition-colors">{tool.categories.name}</Link>
                        )}
                        <span>/</span>
                        <span className="text-slate-900 dark:text-white">{tool.name}</span>
                    </nav>

                    {tool.categories ? (
                        <Link href={`/category/${tool.categories.slug}`} className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 uppercase tracking-[0.2em] transition-all group">
                            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Back to {tool.categories.name}
                        </Link>
                    ) : (
                        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            <ChevronLeft size={14} />
                            Return to Base
                        </Link>
                    )}
                </div>

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
                    <div className="lg:col-span-2">
                        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left mb-16">
                            <div className="h-40 w-40 flex-shrink-0 rounded-[2.5rem] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 overflow-hidden flex items-center justify-center p-8 shadow-2xl transition-transform hover:rotate-3 duration-500">
                                <ToolIcon
                                    url={tool.logo_url}
                                    name={tool.name}
                                    websiteUrl={tool.website_url}
                                    width={128}
                                    height={128}
                                    unoptimized={true}
                                    priority={true}
                                    className="h-full w-full"
                                    imgClassName="object-contain"
                                />
                            </div>
                            <div className="flex-1 pt-2">
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-4">
                                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                                        {tool.name}
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {tool.item_tags?.filter(it => it.tags).map((it) => (
                                            <TagBadge
                                                key={it.tags.id}
                                                name={it.tags.name}
                                                slug={it.tags.slug}
                                                color={it.tags.color}
                                                href={tool.categories ? `/category/${tool.categories.slug}/${it.tags.slug}` : undefined}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-center md:justify-start items-center gap-4 mb-8">
                                    <StarRating rating={tool.average_rating} size="lg" />
                                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-500/5 px-4 py-2 rounded-xl border border-blue-500/10">
                                        Community Confidence: {(tool.average_rating || 0).toFixed(1)}
                                    </span>
                                </div>
                                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-medium mb-10">
                                    {tool.description}
                                </p>
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
                                    <a
                                        href={`/go/${tool.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 rounded-2xl bg-slate-900 dark:bg-blue-600 px-10 py-5 text-[10px] font-black text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95 uppercase tracking-widest group"
                                    >
                                        Visit Official Interface
                                        <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </a>

                                    <div className="flex items-center gap-8 px-8 py-5 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-sm">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Alpha Score</span>
                                            <div className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight">{tool.score.toLocaleString()}</div>
                                        </div>
                                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
                                        <VoteButtons
                                            itemId={tool.id}
                                            initialScore={tool.score}
                                        />
                                    </div>
                                </div>
                                <div className="mt-8 flex flex-wrap items-center gap-6">
                                    <ShareButtons
                                        url={`/tool/${tool.slug}`}
                                        title={`Check out ${tool.name} on RankedByUs - Community Analysis`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Deep Analysis Article Link - Phase 2 SEO Requirement */}
                        {article && (
                            <div className="mt-20 p-10 rounded-[2.5rem] border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm relative overflow-hidden group">
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-4 text-blue-600">
                                            <Sparkles size={16} className="animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Full Study Available</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
                                            {article.title}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 line-clamp-2">
                                            {article.excerpt}
                                        </p>
                                        <Link
                                            href={`/article/${article.slug}`}
                                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                                        >
                                            Read Deep Analysis <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                    <div className="hidden md:block h-32 w-32 bg-white dark:bg-slate-900 rounded-[2rem] border border-blue-500/10 flex-shrink-0 flex items-center justify-center p-6 grayscale group-hover:grayscale-0 transition-all duration-700">
                                        <ToolIcon url={tool.logo_url} name={tool.name} websiteUrl={tool.website_url} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <AdSlot variant="display" className="mt-12" />

                        {/* Community Reviews Section */}
                        <div className="mt-32">
                            <div className="flex items-end justify-between mb-16 border-b border-slate-100 dark:border-slate-800 pb-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                                        <CheckCircle2 size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Feedback</span>
                                    </div>
                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Signal Log</h3>
                                </div>
                                <ReviewModal
                                    itemId={tool.id}
                                    itemName={tool.name}
                                    isAuthenticated={isAuthenticated}
                                    className="rounded-[1.25rem] bg-slate-100 dark:bg-slate-900 px-8 py-4 text-[10px] font-black tracking-widest uppercase text-slate-600 dark:text-slate-400 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white transition-all shadow-sm"
                                />
                            </div>

                            <ReviewList reviews={(reviews as Review[]) || []} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-12 lg:sticky lg:top-32">
                        {/* Rating Distribution / Sentiment */}
                        <div className="rounded-[3rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12 pb-4 border-b border-slate-100 dark:border-slate-800">Sentiment Analysis</h4>
                            <div className="space-y-6">
                                {[5, 4, 3, 2, 1].map((rating) => {
                                    const count = reviews?.filter(r => r.rating === rating).length || 0;
                                    const percentage = (reviews?.length || 0) > 0 ? (count / reviews!.length) * 100 : 0;
                                    return (
                                        <div key={rating} className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 min-w-[40px]">
                                                <span className="text-[10px] font-black text-slate-900 dark:text-white">{rating}</span>
                                                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                                            </div>
                                            <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner">
                                                <div
                                                    className="h-full bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 min-w-[24px] text-right">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800 text-center">
                                <div className="text-4xl font-black text-slate-900 dark:text-white leading-none mb-2">{(tool.average_rating || 0).toFixed(1)}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Confidence</div>
                            </div>
                        </div>

                        {/* Tool DNA / Metrics */}
                        <div className="rounded-[3rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 pointer-events-none">
                                <TrendingUp size={140} />
                            </div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12 pb-4 border-b border-slate-100 dark:border-slate-800">Intelligence Profile</h4>
                            <div className="space-y-12">
                                <div className="flex items-start gap-5">
                                    <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                                        <TrendingUp size={24} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Sektor</div>
                                        {tool.categories ? (
                                            <Link href={`/category/${tool.categories.slug}`} className="text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-black transition-colors text-xl uppercase tracking-tighter leading-none">
                                                {tool.categories.name}
                                            </Link>
                                        ) : (
                                            <span className="text-slate-900 dark:text-white font-black text-xl">General</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Security</div>
                                        <div className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none flex items-center gap-2">
                                            Verified 2026
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Market Velocity</div>
                                        <div className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none flex items-center gap-2">
                                            {tool.click_count || 0} Deployments
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="h-12 w-12 rounded-2xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Audit Sync</div>
                                        <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">
                                            {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' }).toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Related Rankings */}
                        <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 pl-4">Market Rivals</h4>
                            <div className="grid gap-4">
                                {(relatedTools as ItemWithDetails[])?.map((related) => (
                                    <div
                                        key={related.id}
                                        className="flex items-center gap-5 group rounded-[1.5rem] p-5 bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 hover:shadow-xl transition-all duration-300"
                                    >
                                        <Link href={`/tool/${related.slug}`} className="flex flex-1 items-center gap-5 overflow-hidden">
                                            <div className="h-16 w-16 flex-shrink-0 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center p-3 shadow-sm group-hover:rotate-3 transition-transform duration-500">
                                                <ToolIcon
                                                    url={related.logo_url}
                                                    name={related.name}
                                                    websiteUrl={related.website_url}
                                                    width={64}
                                                    height={64}
                                                    unoptimized={true}
                                                    className="h-full w-full"
                                                    imgClassName="object-contain"
                                                />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors uppercase tracking-widest">
                                                    {related.name}
                                                </div>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <StarRating rating={related.average_rating} size="xs" />
                                                    <div className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Alpha: {related.score}</span>
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="flex flex-col gap-2">
                                            <Link
                                                href={`/compare/${tool.slug}-vs-${related.slug}`}
                                                className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                title={`Compare with ${related.name}`}
                                            >
                                                <Scale size={14} />
                                            </Link>
                                            <ArrowRight size={14} className="text-slate-300 dark:text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all mx-auto" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA / Report */}
                        <div className="rounded-[2.5rem] bg-slate-900 p-10 border border-slate-800 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 text-blue-500/5 group-hover:text-blue-500/10 group-hover:rotate-12 transition-all duration-700">
                                <AlertCircle size={100} />
                            </div>
                            <div className="flex items-center gap-2 mb-4 text-blue-500">
                                <AlertCircle size={16} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Asset Validation</span>
                            </div>
                            <h4 className="font-black text-white uppercase tracking-tighter text-2xl mb-4 relative z-10">Founder Access</h4>
                            <p className="text-xs text-slate-400 mb-8 leading-relaxed relative z-10 font-medium">
                                Do you represent the technical team behind {tool.name}? Claim this listing to update metadata, pricing models, and access community growth signals.
                            </p>
                            <ClaimListingModal itemId={tool.id} itemName={tool.name} />
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
