import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SubmitToolModal } from "@/components/SubmitToolModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SortSelector, SortOption } from "@/components/SortSelector";
import { ToolCard } from "@/components/ToolCard";
import { SponsoredBanner } from "@/components/SponsoredBanner";
import { AdSlot } from "@/components/AdSlot";
import { CategoryFilters } from "@/components/CategoryFilters";
import { createClient, createStaticClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import {
    PenTool,
    Palette,
    Video,
    Code2,
    Cloud,
    Globe,
    Rocket,
    Wrench,
    ArrowLeft,
    Search,
    Inbox,
    Filter,
    User
} from "lucide-react";
import type { Category, ItemWithDetails, Tag } from "@/types/models";

// Generate static params for all categories
export async function generateStaticParams() {
    const supabase = createStaticClient();
    const { data: categories } = await supabase.from('categories').select('slug');

    return (categories || []).map((category) => ({
        slug: category.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const supabase = await createClient();
    const { slug } = await params;

    const { data: categoryData } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!categoryData) return { title: 'Category Not Found' };
    const category = categoryData as Category;

    return {
        title: `Best ${category.name} in 2026 - RankedByUs`,
        description: category.description || `Explore the community-ranked best ${category.name.toLowerCase()} for 2026. Real user reviews and voting.`,
        openGraph: {
            title: `Top 10+ ${category.name} | RankedByUs`,
            description: category.description || undefined,
            type: 'website',
        },
    };
}

export default async function CategoryPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ sort?: SortOption, tag?: string, pricing?: string, verified?: string }>
}) {
    const supabase = await createClient();
    const { slug } = await params;
    const { sort = 'top', tag, pricing, verified } = await searchParams;

    // Fetch category
    const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();


    if (categoryError || !categoryData) {
        notFound();
    }

    const category = categoryData as Category;

    // Build query based on sort option and tags
    let query = supabase
        .from('items')
        .select(`
            *,
            item_tags (
                tags (*)
            ),
            articles (*)
        `)
        .eq('category_id', category.id)
        .eq('status', 'approved');

    if (tag) {
        // To filter by tag efficiently, we first get item IDs that have this tag
        const { data: tagMatches } = await supabase
            .from('item_tags')
            .select('item_id, tags!inner(slug)')
            .eq('tags.slug', tag);

        const itemIds = tagMatches?.map(m => m.item_id) || [];
        if (itemIds.length > 0) {
            query = query.in('id', itemIds);
        } else {
            query = query.eq('id', '00000000-0000-0000-0000-000000000000');
        }
    }

    if (pricing) {
        query = query.eq('pricing_model', pricing);
    }

    if (verified === 'true') {
        query = query.gt('vote_count', 10); // Placeholder logic for verified
    }

    // Primary: Sponsored, Secondary: Selected Sort
    query = query.order('is_sponsored', { ascending: false });

    if (sort === 'new') {
        query = query.order('created_at', { ascending: false });
    } else if (sort === 'most-voted') {
        query = query.order('vote_count', { ascending: false });
    } else {
        query = query.order('score', { ascending: false });
    }

    const { data: itemsData } = await query;

    // Fetch a sponsor for the AdSlot (Active & Sponsored)
    const { data: potentialSponsors } = await supabase
        .from('items')
        .select('*, categories(name)')
        .eq('is_sponsored', true)
        .gt('sponsored_until', new Date().toISOString())
        .limit(5);

    const adSponsor = potentialSponsors && potentialSponsors.length > 0
        ? potentialSponsors[new Date().getDate() % potentialSponsors.length] as unknown as ItemWithDetails
        : null;

    const tools = (itemsData || []) as ItemWithDetails[];

    // Fetch all available tags to show in filter bar
    const { data: allTagsData } = await supabase
        .from('tags')
        .select('*')
        .order('name');

    const allTags = (allTagsData || []) as Tag[];

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
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">RankedByUs</h1>
                        </Link>
                        <nav className="flex items-center gap-8">
                            <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Intelligence
                            </Link>
                            <Link href="/about" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                About
                            </Link>
                            <Link href="/profile" className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <User size={20} />
                            </Link>
                            <ThemeToggle />
                            <SubmitToolModal className="rounded-xl bg-slate-900 dark:bg-blue-600 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/10 active:scale-95" />
                        </nav>
                    </div>
                </div>
            </header>

            {/* Category Hero */}
            <section className="relative py-20 overflow-hidden border-b border-slate-200 dark:border-slate-800">
                <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-600/10" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

                    {/* 8.2 Breadcrumbs Component */}
                    <nav className="flex items-center gap-2 mb-8 text-[9px] font-black uppercase tracking-widest text-slate-400">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Registry</Link>
                        <span>/</span>
                        <span className="text-slate-900 dark:text-white">{category.name}</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-start gap-12">
                        <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl border-2 border-slate-100 dark:border-slate-800 text-blue-600 dark:text-blue-400 group-hover:rotate-6 transition-transform">
                            {(() => {
                                const size = 42;
                                const strokeWidth = 1.5;
                                if (category.slug === 'ai-writing-tools') return <PenTool size={size} strokeWidth={strokeWidth} />;
                                if (category.slug === 'ai-image-generators') return <Palette size={size} strokeWidth={strokeWidth} />;
                                if (category.slug === 'ai-video-tools') return <Video size={size} strokeWidth={strokeWidth} />;
                                if (category.slug === 'ai-code-assistants') return <Code2 size={size} strokeWidth={strokeWidth} />;
                                if (category.slug === 'cloud-hosting') return <Cloud size={size} strokeWidth={strokeWidth} />;
                                if (category.slug === 'esim-providers') return <Globe size={size} strokeWidth={strokeWidth} />;
                                if (category.slug === 'saas-essentials') return <Rocket size={size} strokeWidth={strokeWidth} />;
                                return <Wrench size={size} strokeWidth={strokeWidth} />;
                            })()}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Master Registry</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{tools.length} Assets Ranked</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-4">{category.name}</h2>
                            <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{category.description}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rankings List */}
            <section className="py-20 bg-slate-50/50 dark:bg-slate-950/50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Filter & Sort Bar */}
                    <div className="mb-12 flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                        <CategoryFilters
                            tags={allTags}
                            baseUrl={`/category/${slug}`}
                            currentTagSlug={tag}
                        />
                        <div className="flex-shrink-0 pt-1">
                            <SortSelector />
                        </div>
                    </div>

                    <SponsoredBanner />

                    {tools.length === 0 ? (
                        <div className="rounded-[3rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-24 text-center backdrop-blur-xl shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-600/10" />
                            <div className="relative z-10">
                                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 mb-8">
                                    {tag ? <Search size={48} strokeWidth={1} /> : <Inbox size={48} strokeWidth={1} />}
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
                                    {tag ? `No results for &quot;{tag}&quot;` : 'Index is Empty'}
                                </h3>
                                <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
                                    {tag ? 'Our scanners couldn&apos;t identify any assets fitting this classification.' : 'Be the pioneer. Deploy the first asset to this niche registry.'}
                                </p>
                                {!tag && (
                                    <SubmitToolModal className="mt-10 rounded-2xl bg-slate-900 dark:bg-blue-600 px-10 py-5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95" />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-12">
                            <div className="flex-1 space-y-6">
                                {tools.map((tool, index) => (
                                    <div key={tool.id}>
                                        <ToolCard
                                            tool={tool}
                                            rank={index + 1}
                                            priority={index < 2}
                                        />
                                        {/* Ad Slot after Rank #3 */}
                                        {index === 2 && (
                                            <div className="mt-6 mb-6">
                                                <AdSlot variant="display" sponsor={adSponsor} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Programmatic Sidebar Collections - Phase 8 Enhancement */}
                            <aside className="lg:w-80 space-y-10">
                                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Strategic Collections</h3>
                                    <div className="space-y-4">
                                        <Link
                                            href={`/best/free-${slug}`}
                                            className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-600 hover:text-white transition-all border border-transparent hover:border-blue-500/20"
                                        >
                                            <span className="text-xs font-black uppercase tracking-tight">Best Free {category.name}</span>
                                            <Rocket size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </Link>

                                        {allTags.slice(0, 5).map(t => (
                                            <Link
                                                key={t.id}
                                                href={`/best/${slug}-for-${t.slug}`}
                                                className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/30 hover:bg-slate-900 dark:hover:bg-blue-600 hover:text-white transition-all"
                                            >
                                                <span className="text-xs font-black uppercase tracking-tight">{category.name} for {t.name}</span>
                                                <div className="h-6 w-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                                    <Search size={12} />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <AdSlot variant="sidebar" className="mt-8" />
                            </aside>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
