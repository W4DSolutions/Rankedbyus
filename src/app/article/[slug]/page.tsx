import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import {
    ChevronLeft,
    Calendar,
    User,
    Share2,
    Clock,
    ArrowUpRight,
    TrendingUp,
    ShieldCheck
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { AdSlot } from "@/components/AdSlot";
import { ToolIcon } from "@/components/ToolIcon";
import { ShareButtons } from "@/components/ShareButtons";
import { cn, formatDate } from "@/lib/utils";
import { ViewTracker } from "@/components/ViewTracker";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: article } = await supabase
        .from('articles')
        .select('title, excerpt, author_name, published_at, created_at')
        .eq('slug', slug)
        .single();

    if (!article) return { title: 'Article Not Found' };

    return {
        title: `${article.title} | RankedByUs Analysis`,
        description: article.excerpt || `Deep-dive analysis and professional reviews on RankedByUs.`,
        openGraph: {
            title: article.title,
            description: article.excerpt || undefined,
            type: 'article',
            publishedTime: article.published_at || article.created_at,
            authors: [article.author_name || 'RankedByUs Team'],
        },
        alternates: {
            canonical: `/article/${slug}`,
        },
    };
}

export default async function ArticlePage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: article } = await supabase
        .from('articles')
        .select(`
            *,
            items (
                id,
                name,
                slug,
                description,
                logo_url,
                website_url,
                score,
                average_rating,
                pricing_model
            )
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    // Fetch active sponsors
    const { data: sponsors } = await supabase
        .from('items')
        .select('*, categories(name)')
        .eq('is_sponsored', true)
        .gt('sponsored_until', new Date().toISOString())
        .limit(3);

    // Distribute sponsors
    const topSponsor = sponsors?.[0] as unknown as any;
    const nativeSponsor = sponsors?.[1] as unknown as any;
    const sidebarSponsor = sponsors?.[2] as unknown as any;

    if (!article) notFound();

    const tool = article.items;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            {/* Nav */}
            <header className="border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-4 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-white font-black">R</div>
                        <span className="text-xl font-black uppercase tracking-tighter">RankedByUs</span>
                    </Link>
                    <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">
                        Intelligence Hub
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-12 md:py-20">
                <div className="grid lg:grid-cols-12 gap-16">
                    {/* Main Content Area */}
                    <article className="lg:col-span-8">
                        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 mb-12 transition-colors">
                            <ChevronLeft size={14} /> Back to Deck
                        </Link>

                        <div className="mb-12">
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-8">
                                {article.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-8 py-8 border-y border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <User size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Auditor</span>
                                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">{article.author_name}</span>
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />
                                <div className="flex items-center gap-4 text-slate-400">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-widest leading-none mb-1">Released</span>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase leading-none">{formatDate(article.published_at || article.created_at)}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-widest leading-none mb-1">Index Time</span>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase leading-none">5m Read</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Ad Slot */}
                        <AdSlot variant="display" sponsor={topSponsor} />

                        {/* Article Text Content */}
                        <div className="article-content text-slate-600 dark:text-slate-300 font-medium text-lg leading-relaxed mb-12 prose prose-slate dark:prose-invert max-w-none">
                            <ReactMarkdown>
                                {article.content}
                            </ReactMarkdown>
                        </div>

                        {/* Native/In-Feed Ad */}
                        <AdSlot variant="native" sponsor={nativeSponsor} />

                        <div className="mt-20 pt-12 border-t border-slate-100 dark:border-slate-800">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Share Analysis</h3>
                            <ShareButtons
                                url={`/article/${article.slug}`}
                                title={article.title}
                            />
                        </div>
                    </article>

                    {/* Sidebar / Sidebar Ads */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-32 flex flex-col gap-8">
                            {/* Linked Tool Card */}
                            {tool && (
                                <div className="rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 shadow-sm">
                                    <div className="flex items-center gap-5 mb-8">
                                        <div className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center p-3 shadow-lg">
                                            <ToolIcon url={tool.logo_url} name={tool.name} websiteUrl={tool.website_url} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{tool.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <TrendingUp size={12} className="text-blue-500" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Alpha {tool.score}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium mb-8 leading-relaxed line-clamp-3">
                                        {tool.description}
                                    </p>
                                    <Link
                                        href={`/tool/${tool.slug}`}
                                        className="w-full py-4 rounded-xl bg-blue-600 text-[10px] font-black text-white uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                                    >
                                        Full Report <ArrowUpRight size={14} />
                                    </Link>
                                </div>
                            )}

                            {/* Sidebar Ad Slot */}
                            <AdSlot variant="sidebar" sponsor={sidebarSponsor} />

                            <div className="p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Social Signal</h4>
                                <div className="flex items-center gap-3 text-green-500 mb-2">
                                    <ShieldCheck size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Verified Content</span>
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium italic">
                                    This article was audited by our community to ensure technical accuracy and unbiased analysis.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "TechArticle",
                        "headline": article.title,
                        "description": article.excerpt,
                        "datePublished": article.published_at || article.created_at,
                        "dateModified": article.updated_at || article.published_at || article.created_at,
                        "author": [{
                            "@type": "Person",
                            "name": article.author_name || "RankedByUs Team"
                        }],
                        "publisher": {
                            "@type": "Organization",
                            "name": "RankedByUs",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://rankedbyus.com/logo.png"
                            }
                        }
                    })
                }}
            />
            {/* Client-side View Tracking */}
            <ViewTracker articleId={article.id} />
        </div>
    );
}
