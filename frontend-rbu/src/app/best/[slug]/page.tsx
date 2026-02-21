import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { AdSlot } from "@/components/AdSlot";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Rocket, Shield, Globe, Zap, CheckCircle2, Star, HelpCircle } from "lucide-react";
import type { Category, ItemWithDetails, Tag } from "@/types/models";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    // Parse slug: free-ai-writing-tools or ai-writing-tools-for-creators
    let title = "Best AI Tools";
    if (slug.startsWith('free-')) {
        const categoryPart = slug.replace('free-', '').replace(/-/g, ' ');
        title = `Best Free ${categoryPart} in 2026`;
    } else if (slug.includes('-for-')) {
        const parts = slug.split('-for-');
        const toolPart = parts[0].replace(/-/g, ' ');
        const forPart = parts[1].replace(/-/g, ' ');
        title = `Best ${toolPart} for ${forPart} (2026)`;
    } else {
        title = `Best ${slug.replace(/-/g, ' ')}`;
    }

    return {
        title: `${title} - RankedByUs`,
        description: `Explore the community-ranked ${title.toLowerCase()}. Real user signals and deployment stats.`,
        openGraph: {
            title: `${title} | RankedByUs`,
            description: `Verify the top-rated ${title.toLowerCase()} based on 50+ data points.`,
            type: 'website',
        },
        alternates: {
            canonical: `/best/${slug}`,
        },
    };
}

export default async function BestPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const supabase = await createClient();

    let categorySlug = '';
    let pricingFilter = null;
    let tagFilter = null;
    let displayTitle = '';

    if (slug.startsWith('free-')) {
        categorySlug = slug.replace('free-', '');
        pricingFilter = 'Free';
        displayTitle = `Best Free ${categorySlug.replace(/-/g, ' ')}`;
    } else if (slug.includes('-for-')) {
        const parts = slug.split('-for-');
        categorySlug = parts[0];
        tagFilter = parts[1];
        displayTitle = `Best ${categorySlug.replace(/-/g, ' ')} for ${tagFilter.replace(/-/g, ' ')}`;
    } else {
        // Fallback or generic best
        categorySlug = slug;
        displayTitle = `Best ${categorySlug.replace(/-/g, ' ')}`;
    }

    // Fetch category
    const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', categorySlug)
        .single();

    if (!category) {
        notFound();
    }

    // Build query
    let query = supabase
        .from('items')
        .select(`
            *,
            categories:category_id!inner (name, slug),
            item_tags (
                tags (*)
            ),
            articles (*)
        `)
        .eq('status', 'approved')
        .eq('categories.slug', categorySlug);

    if (pricingFilter) {
        query = query.eq('pricing_model', pricingFilter);
    }

    if (tagFilter) {
        // Find items with this tag
        const { data: tagMatches } = await supabase
            .from('item_tags')
            .select('item_id, tags!inner(slug)')
            .eq('tags.slug', tagFilter);

        const itemIds = tagMatches?.map(tm => tm.item_id) || [];
        if (itemIds.length > 0) {
            query = query.in('id', itemIds);
        } else {
            // No matches for tag
            return renderEmpty(displayTitle);
        }
    }

    const { data: items } = await query
        .order('is_sponsored', { ascending: false })
        .order('score', { ascending: false });
    const tools = (items || []) as ItemWithDetails[];

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            {/* Header */}
            <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-white font-black">R</div>
                        <span className="text-xl font-black uppercase tracking-tighter">RankedByUs</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Intelligence</Link>
                        <Link href="/about" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-20">
                <Link href="/search" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 mb-12 transition-colors">
                    <ArrowLeft size={14} /> Back to Registry
                </Link>

                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                            Elite Collection
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tools.length} Assets Found</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-6">
                        {displayTitle}
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-3xl leading-relaxed">
                        Strategically audited and community-ranked {displayTitle.toLowerCase()} for professional deployment and high-tier results in 2026.
                    </p>
                </div>

                {/* Quick Comparison Table (Mini-View) - Phase 2 Requirement */}
                {tools.length >= 2 && (
                    <div className="mb-20 overflow-x-auto">
                        <div className="min-w-[800px] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900/50">
                            <div className="grid grid-cols-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <div className="p-6 font-black text-[10px] uppercase tracking-widest text-slate-400">Tool</div>
                                <div className="p-6 font-black text-[10px] uppercase tracking-widest text-slate-400">Community Score</div>
                                <div className="p-6 font-black text-[10px] uppercase tracking-widest text-slate-400">Pricing</div>
                                <div className="p-6 font-black text-[10px] uppercase tracking-widest text-slate-400">Action</div>
                            </div>
                            {tools.slice(0, 3).map((tool) => (
                                <div key={tool.id} className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 transition-colors">
                                    <div className="p-6 flex items-center gap-4">
                                        <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center p-2">
                                            <span className="text-xs font-black uppercase tracking-tighter text-slate-900 dark:text-white">{tool.name[0]}</span>
                                        </div>
                                        <span className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-sm truncate">{tool.name}</span>
                                    </div>
                                    <div className="p-6 flex items-center gap-2">
                                        <Star size={14} className="text-blue-600" />
                                        <span className="font-bold text-slate-900 dark:text-white tracking-tighter uppercase text-sm">{tool.score}</span>
                                    </div>
                                    <div className="p-6">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                            {tool.pricing_model || 'TBA'}
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <Link href={`/go/${tool.slug}`} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-500 transition-colors flex items-center gap-2">
                                            Deploy <Rocket size={12} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <AdSlot variant="display" />

                {tools.length === 0 ? renderEmpty(displayTitle) : (
                    <div className="space-y-6">
                        {tools.map((tool, index) => (
                            <div key={tool.id}>
                                <ToolCard tool={tool} rank={index + 1} />
                                {index === 1 && <AdSlot variant="native" className="my-12" />}
                            </div>
                        ))}
                    </div>
                )}

                {/* FAQ Section - Phase 2 Requirement */}
                {tools.length > 0 && (
                    <div className="mt-32">
                        <div className="flex items-center gap-3 mb-12">
                            <HelpCircle className="text-blue-600" size={24} />
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Frequently Asked Questions</h2>
                        </div>
                        <div className="grid gap-6">
                            {[
                                {
                                    q: `What is the best ${categorySlug.replace(/-/g, ' ')}?`,
                                    a: `Based on community rankings and audit signals, ${tools[0].name} is currently the top-rated choice for ${displayTitle.toLowerCase()}.`
                                },
                                {
                                    q: `Are there free options for ${categorySlug.replace(/-/g, ' ')}?`,
                                    a: `Yes, tools like ${tools.find(t => t.pricing_model === 'Free')?.name || tools[0].name} offer free deployment tiers suitable for entry-level use.`
                                },
                                {
                                    q: `How do you rank these tools?`,
                                    a: `Our proprietary TrustScore algorithm prioritizes recent deployment velocity, verified user feedback, and technical audit standards to ensure the freshest rankings.`
                                }
                            ].map((faq, idx) => (
                                <div key={idx} className="p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">
                                        {faq.q}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                        {/* JSON-LD Schema */}
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify({
                                    "@context": "https://schema.org",
                                    "@type": "FAQPage",
                                    "mainEntity": [
                                        {
                                            "@type": "Question",
                                            "name": `What is the best ${categorySlug.replace(/-/g, ' ')}?`,
                                            "acceptedAnswer": {
                                                "@type": "Answer",
                                                "text": `Based on community rankings and audit signals, ${tools[0].name} is currently the top-rated choice for ${displayTitle.toLowerCase()}.`
                                            }
                                        },
                                        {
                                            "@type": "Question",
                                            "name": `Are there free options?`,
                                            "acceptedAnswer": {
                                                "@type": "Answer",
                                                "text": `Yes, tools like ${tools.find(t => t.pricing_model === 'Free')?.name || tools[0].name} offer free deployment tiers.`
                                            }
                                        }
                                    ]
                                })
                            }}
                        />
                    </div>
                )}
            </main>

            {/* Benefit Grid */}
            <section className="bg-slate-50 dark:bg-slate-900/30 py-24 border-t border-slate-200 dark:border-slate-800">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 dark:border-slate-700">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-tighter">Real-Time Alpha</h3>
                            <p className="text-sm text-slate-500 font-medium">Scores updated hourly based on active community deployments and verified auditor feedback.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-purple-600 shadow-sm border border-slate-100 dark:border-slate-700">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-tighter">Verified Integrity</h3>
                            <p className="text-sm text-slate-500 font-medium">Every asset undergoes a 72-hour technical audit before appearing in our master registry.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-green-600 shadow-sm border border-slate-100 dark:border-slate-700">
                                <Globe size={24} />
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-tighter">Global Consensus</h3>
                            <p className="text-sm text-slate-500 font-medium">The definitive stack chosen by creators and developers across 140+ countries.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function renderEmpty(title: string) {
    return (
        <div className="rounded-[3rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-24 text-center">
            <Rocket size={48} className="mx-auto text-slate-300 mb-8" />
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">No assets match this niche yet</h2>
            <p className="text-slate-500 font-medium max-w-md mx-auto mb-10">Our community hasn&apos;t identified any elite assets for &quot;{title}&quot; that meet our 2026 audit standards.</p>
            <Link href="/search" className="rounded-xl bg-slate-900 px-8 py-4 text-[10px] font-black text-white uppercase tracking-widest transition-all hover:bg-slate-800 active:scale-95">
                Explore Full Registry
            </Link>
        </div>
    );
}
