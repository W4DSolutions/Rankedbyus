import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, Clock, User, Sparkles } from "lucide-react";
import { AdSlot } from "@/components/AdSlot";

export const metadata: Metadata = {
    title: 'Intelligence Hub - RankedByUs',
    description: 'Deep-dive analysis, strategic tool reviews, and industry insights from the RankedByUs community.',
};

export default async function BlogIndexSubPage() {
    const supabase = await createClient();

    const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false });

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            {/* Nav */}
            <header className="border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-4 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-white font-black">R</div>
                        <span className="text-xl font-black uppercase tracking-tighter">RankedByUs</span>
                    </Link>
                    <Link href="/search" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">
                        Deep Registry
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-12 md:py-20">
                <div className="mb-20">
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-6 border border-blue-500/20">
                        <Sparkles size={14} className="animate-pulse" />
                        The Intelligence Hub
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-8">
                        Strategic <br />
                        <span className="text-slate-300 dark:text-slate-800 underline decoration-blue-500/30">Analysis</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
                        Beyond the rankings. In-depth research papers on the tools shaping the future of SaaS, AI, and Global Infrastructure.
                    </p>
                </div>

                {/* Featured Ad */}
                <AdSlot variant="display" />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                    {(articles || []).map((article) => (
                        <Link
                            key={article.id}
                            href={`/article/${article.slug}`}
                            className="group flex flex-col h-full rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-10 hover:border-blue-500/30 hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 dark:border-slate-800 px-3 py-1 rounded-lg">Tactical Analysis</span>
                                <div className="h-px flex-1 bg-slate-50 dark:bg-slate-800" />
                            </div>

                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {article.title}
                            </h2>

                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10 line-clamp-3">
                                {article.excerpt}
                            </p>

                            <div className="mt-auto flex items-center justify-between pt-8 border-t border-slate-50 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <User size={12} />
                                    </div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{article.author_name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-blue-600 group-hover:translate-x-1 transition-transform">
                                    <span className="text-[9px] font-black uppercase tracking-widest inline-block">Study Report</span>
                                    <ArrowRight size={14} />
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* Placeholder for future content or sidebar ad inside grid */}
                    <AdSlot variant="sidebar" className="md:col-span-1" />
                </div>
            </main>

            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "headline": "RankedByUs Intelligence Hub",
                        "description": "Deep-dive analysis, strategic tool reviews, and industry insights.",
                        "mainEntity": {
                            "@type": "ItemList",
                            "itemListElement": articles?.map((article, index) => ({
                                "@type": "ListItem",
                                "position": index + 1,
                                "url": `${process.env.NEXT_PUBLIC_APP_URL || 'https://rankedbyus.com'}/article/${article.slug}`,
                                "name": article.title
                            }))
                        }
                    })
                }}
            />
        </div>
    );
}
