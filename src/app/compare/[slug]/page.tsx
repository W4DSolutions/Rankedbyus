import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ToolIcon } from "@/components/ToolIcon";
import {
    Check,
    X,
    ArrowLeft,
    TrendingUp,
    ExternalLink,
    Zap,
    Shield,
    Globe,
    Scale,
    HelpCircle,
    Award
} from "lucide-react";
import type { ItemWithDetails } from "@/types/models";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const parts = slug.split('-vs-');

    if (parts.length !== 2) return { title: 'Compare Tools' };

    const name1 = parts[0].replace(/-/g, ' ');
    const name2 = parts[1].replace(/-/g, ' ');

    return {
        title: `${name1} vs ${name2} - Community Comparison (2026)`,
        description: `Detailed side-by-side comparison of ${name1} and ${name2}. Real user scores, pricing models, and community signals.`,
    };
}

export default async function ComparisonPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const parts = slug.split('-vs-');

    if (parts.length !== 2) {
        notFound();
    }

    const supabase = await createClient();

    let tool1: ItemWithDetails | null = null;
    let tool2: ItemWithDetails | null = null;

    if (parts[1] === 'leader') {
        const { data: t1 } = await supabase
            .from('items')
            .select('*, categories:category_id (name, slug)')
            .eq('slug', parts[0])
            .single();

        if (!t1) notFound();
        tool1 = t1 as ItemWithDetails;

        const { data: leader } = await supabase
            .from('items')
            .select('*, categories:category_id (name, slug)')
            .eq('category_id', tool1.category_id)
            .eq('status', 'approved')
            .neq('id', tool1.id)
            .order('score', { ascending: false })
            .limit(1)
            .single();

        if (!leader) {
            // No other tools to compare with
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                    <div className="text-center max-w-md">
                        <Scale size={48} className="mx-auto text-slate-300 mb-6" />
                        <h1 className="text-2xl font-black uppercase mb-4">Solo Specialist</h1>
                        <p className="text-slate-500 mb-8 font-medium">{tool1.name} is currently the sole verified asset in this niche. No competitors found for comparison.</p>
                        <Link href={`/tool/${tool1.slug}`} className="text-blue-600 font-black uppercase tracking-widest text-[10px]">Back to Details</Link>
                    </div>
                </div>
            );
        }
        tool2 = leader as ItemWithDetails;
    } else {
        // Fetch both items
        const { data: items } = await supabase
            .from('items')
            .select(`
                *,
                categories:category_id (name, slug),
                item_tags (
                    tags (*)
                )
            `)
            .in('slug', parts);

        if (!items || items.length !== 2) {
            notFound();
        }

        tool1 = items.find(i => i.slug === parts[0]) as ItemWithDetails;
        tool2 = items.find(i => i.slug === parts[1]) as ItemWithDetails;
    }

    if (!tool1 || !tool2) notFound();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-4 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-white font-black">R</div>
                        <span className="text-xl font-black uppercase tracking-tighter">RankedByUs</span>
                    </Link>
                    <Link href="/search" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">
                        Registry
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-12 md:py-20">
                <Link href="/search" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 mb-12 transition-colors">
                    <ArrowLeft size={14} /> Back to Registry
                </Link>

                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Scale className="text-blue-600" size={24} />
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">Strategic Comparison</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-6">
                        {tool1.name} <span className="text-slate-300 dark:text-slate-800">VS</span> {tool2.name}
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                        A data-driven analysis of two industry-leading tools in 2026. Audited by community signals and deployment velocity.
                    </p>
                </div>

                {/* Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    {/* VS Circle Overlay (Desktop) */}
                    <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-950 shadow-2xl">
                        <span className="text-lg font-black text-slate-900 dark:text-white">VS</span>
                    </div>

                    {/* Tool 1 Card */}
                    <ToolCompareCard tool={tool1} side="left" />

                    {/* Tool 2 Card */}
                    <ToolCompareCard tool={tool2} side="right" />
                </div>

                {/* Technical Deep Dive */}
                <div className="mt-20">
                    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                            <div className="p-8 font-black text-[10px] uppercase tracking-widest text-slate-400">Metric</div>
                            <div className="p-8 font-black text-[10px] uppercase tracking-widest text-slate-900 dark:text-white border-l border-slate-200 dark:border-slate-800">
                                {tool1.name}
                            </div>
                            <div className="p-8 font-black text-[10px] uppercase tracking-widest text-slate-900 dark:text-white border-l border-slate-200 dark:border-slate-800">
                                {tool2.name}
                            </div>
                        </div>

                        {/* Pricing */}
                        <MetricRow label="Pricing Model" val1={tool1.pricing_model} val2={tool2.pricing_model} />

                        {/* Community Score */}
                        <MetricRow
                            label="Community Score"
                            val1={tool1.score?.toString()}
                            val2={tool2.score?.toString()}
                            highlight
                        />

                        {/* Deployment Status */}
                        <MetricRow
                            label="Status"
                            val1={tool1.status}
                            val2={tool2.status}
                        />

                        {/* Votes */}
                        <MetricRow
                            label="Verified Votes"
                            val1={tool1.vote_count?.toString()}
                            val2={tool2.vote_count?.toString()}
                        />

                        {/* Category */}
                        <MetricRow
                            label="Niche Index"
                            val1={tool1.categories?.name}
                            val2={tool2.categories?.name}
                        />
                    </div>
                </div>

                {/* Expert Verdict - Phase 2 Requirement */}
                <div className="mt-20 p-12 rounded-[2.5rem] border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-blue-500/5 group-hover:rotate-12 transition-transform duration-700">
                        <Award size={160} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <Award className="text-blue-600" size={24} />
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Expert Verdict</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4">Best for Scale</h4>
                                <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">
                                    {tool1.score > tool2.score ? tool1.name : tool2.name}
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">
                                    With a community score of {Math.max(tool1.score, tool2.score)}, this asset demonstrates superior deployment velocity and verified reliability signals.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Market Dynamic</h4>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    {tool1.name} and {tool2.name} represent the elite tier of {tool1.categories?.name}. The choice depends on whether you prioritize {tool1.pricing_model} efficiency or {tool2.pricing_model} flexibility.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section - Phase 2 Requirement */}
                <div className="mt-20">
                    <div className="flex items-center gap-3 mb-10">
                        <HelpCircle className="text-blue-600" size={24} />
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Comparison Analytics</h2>
                    </div>
                    <div className="grid gap-6">
                        {[
                            {
                                q: `Which is better: ${tool1.name} or ${tool2.name}?`,
                                a: `According to our 2026 registry data, ${tool1.score > tool2.score ? tool1.name : tool2.name} leads with a score of ${Math.max(tool1.score, tool2.score)}, though both tools are approved for professional use.`
                            },
                            {
                                q: `Is ${tool1.name} cheaper than ${tool2.name}?`,
                                a: `${tool1.name} operates on a ${tool1.pricing_model} model while ${tool2.name} uses ${tool2.pricing_model}. Cost-effectiveness depends on your specific deployment scale.`
                            }
                        ].map((faq, idx) => (
                            <div key={idx} className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">{faq.q}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">{faq.a}</p>
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
                                        "name": `${tool1.name} vs ${tool2.name}: Which is better?`,
                                        "acceptedAnswer": {
                                            "@type": "Answer",
                                            "text": `${tool1.score > tool2.score ? tool1.name : tool2.name} leads with a superior community score of ${Math.max(tool1.score, tool2.score)}.`
                                        }
                                    }
                                ]
                            })
                        }}
                    />
                </div>

                {/* Call to Action */}
                <div className="mt-20 grid md:grid-cols-2 gap-12">
                    <div className="p-12 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl">
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Deploy {tool1.name}</h3>
                        <p className="text-blue-100 font-medium mb-8">Ready to integrate {tool1.name} into your workflow? Direct deployment link available.</p>
                        <a
                            href={`/go/${tool1.slug}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 shadow-lg"
                        >
                            Access {tool1.name} <ExternalLink size={14} />
                        </a>
                    </div>
                    <div className="p-12 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl">
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Deploy {tool2.name}</h3>
                        <p className="text-slate-400 font-medium mb-8">Start your journey with {tool2.name} today. Optimized for enterprise scale.</p>
                        <a
                            href={`/go/${tool2.slug}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-[10px] font-black text-white uppercase tracking-widest hover:bg-blue-500 transition-all active:scale-95 shadow-lg"
                        >
                            Access {tool2.name} <ExternalLink size={14} />
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ToolCompareCard({ tool, side }: { tool: ItemWithDetails, side: 'left' | 'right' }) {
    return (
        <div className={cn(
            "p-10 md:p-16 rounded-[3rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden",
            side === 'left' ? "md:rounded-r-none" : "md:rounded-l-none"
        )}>
            {/* Background Glow */}
            <div className={cn(
                "absolute -top-24 -left-24 h-64 w-64 blur-[100px] opacity-20 pointer-events-none",
                side === 'left' ? "bg-blue-500" : "bg-purple-500"
            )} />

            <div className="relative z-10 flex flex-col h-full">
                <div className="h-24 w-24 mb-10 p-5 rounded-3xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-xl flex items-center justify-center">
                    <ToolIcon
                        url={tool.logo_url}
                        name={tool.name}
                        websiteUrl={tool.website_url}
                        width={64}
                        height={64}
                    />
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{tool.name}</h2>
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-500/5 px-2 py-1 rounded">
                            {tool.categories?.name}
                        </span>
                    </div>

                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
                        {tool.description}
                    </p>

                    <div className="flex items-center gap-8 border-t border-slate-100 dark:border-slate-800 pt-8">
                        <div>
                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Scale Score</span>
                            <div className="flex items-center gap-2">
                                <TrendingUp size={20} className="text-blue-500" />
                                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{tool.score}</span>
                            </div>
                        </div>
                        <div>
                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pricing</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{tool.pricing_model || 'TBA'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricRow({ label, val1, val2, highlight }: { label: string, val1?: string | null, val2?: string | null, highlight?: boolean }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-100 dark:border-slate-800 last:border-0 group hover:bg-slate-50 dark:hover:bg-slate-800/10 transition-colors">
            <div className="p-8 flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
            </div>
            <div className={cn(
                "p-8 font-bold text-slate-900 dark:text-white border-l border-slate-100 dark:border-slate-800",
                highlight && "text-xl font-black text-blue-600 dark:text-blue-400"
            )}>
                {val1 || '—'}
            </div>
            <div className={cn(
                "p-8 font-bold text-slate-900 dark:text-white border-l border-slate-100 dark:border-slate-800",
                highlight && "text-xl font-black text-blue-600 dark:text-blue-400"
            )}>
                {val2 || '—'}
            </div>
        </div>
    );
}
