import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SubmitToolModal } from "@/components/SubmitToolModal";
import { SortSelector, SortOption } from "@/components/SortSelector";
import { ToolCard } from "@/components/ToolCard";
import { CategoryFilters } from "@/components/CategoryFilters";
import { SponsoredBanner } from "@/components/SponsoredBanner";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { createClient } from "@/lib/supabase/server";
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
    Tag as TagIcon
} from "lucide-react";
import type { Category, ItemWithDetails, Tag } from "@/types/models";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; tag: string }> }): Promise<Metadata> {
    const supabase = await createClient();
    const { slug, tag: tagSlug } = await params;

    const { data: categoryData } = await supabase
        .from('categories')
        .select('name')
        .eq('slug', slug)
        .single();

    const { data: tagData } = await supabase
        .from('tags')
        .select('name')
        .eq('slug', tagSlug)
        .single();

    if (!categoryData || !tagData) return { title: 'Page Not Found' };

    const categoryName = (categoryData as { name: string }).name;
    const tagName = (tagData as { name: string }).name;

    return {
        title: `Best ${tagName} ${categoryName} (2026 Ranked) - RankedByUs`,
        description: `Compare the top-rated ${tagName.toLowerCase()} ${categoryName.toLowerCase()}. Verified user reviews, detailed features, and community rankings for 2026.`,
        openGraph: {
            title: `The Best ${tagName} ${categoryName} | 2026 Rankings`,
            description: `Don't waste time on bad tools. See which ${tagName} ${categoryName} the community actually trusts.`,
            type: 'website',
        },
    };
}

export default async function TaggedCategoryPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string; tag: string }>,
    searchParams: Promise<{ sort?: SortOption, pricing?: string, verified?: string }>
}) {
    const supabase = await createClient();
    const { slug, tag: tagSlug } = await params;
    const { sort = 'top', pricing, verified } = await searchParams;

    // 1. Fetch Category & Tag Details
    const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    const { data: tagData, error: tagError } = await supabase
        .from('tags')
        .select('*')
        .eq('slug', tagSlug)
        .single();

    if (categoryError || !categoryData || tagError || !tagData) {
        notFound();
    }

    const category = categoryData as Category;
    const currentTag = tagData as Tag;

    // 2. Fetch Items (Filtered by Category AND Tag)
    let query = supabase
        .from('items')
        .select(`
            *,
            item_tags!inner (
                tags (*)
            )
        `)
        .eq('category_id', category.id)
        .eq('status', 'approved')
        .eq('item_tags.tags.slug', tagSlug);

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

    const { data: items } = await query;
    const tools = (items || []) as ItemWithDetails[];

    // 3. Fetch all tags for the filter bar (to allow switching)
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
                            <Link href="/#categories" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Registry
                            </Link>
                            <SubmitToolModal className="rounded-xl bg-slate-900 dark:bg-blue-600 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/10 active:scale-95" />
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden border-b border-slate-200 dark:border-slate-800">
                <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-600/10" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href={`/category/${category.slug}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to {category.name}
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 relative">
                            {(() => {
                                if (category.name.includes('Writing')) return <PenTool size={36} strokeWidth={1.5} />;
                                if (category.name.includes('Image')) return <Palette size={36} strokeWidth={1.5} />;
                                if (category.name.includes('Video')) return <Video size={36} strokeWidth={1.5} />;
                                if (category.name.includes('Code')) return <Code2 size={36} strokeWidth={1.5} />;
                                if (category.name.includes('Hosting')) return <Cloud size={36} strokeWidth={1.5} />;
                                if (category.name.includes('eSIM')) return <Globe size={36} strokeWidth={1.5} />;
                                if (category.name.includes('SaaS')) return <Rocket size={36} strokeWidth={1.5} />;
                                return <Wrench size={36} strokeWidth={1.5} />;
                            })()}
                            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-white dark:border-slate-900">
                                <TagIcon size={14} />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Niche Analysis</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{tools.length} Verified</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-4">
                                Best <span className="text-blue-600 dark:text-blue-500">{currentTag.name}</span><br />
                                {category.name}
                            </h2>
                            <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                Specifically analyzing {currentTag.name.toLowerCase()} options in the {category.name.toLowerCase()} sector. Ranked by active users.
                            </p>
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
                            currentTagSlug={tagSlug}
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
                                    <Search size={48} strokeWidth={1} />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
                                    No {currentTag.name} Results
                                </h3>
                                <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
                                    No assets in this category match the &quot;{currentTag.name}&quot; classification yet.
                                </p>
                                <SubmitToolModal className="mt-10 rounded-2xl bg-slate-900 dark:bg-blue-600 px-10 py-5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95" />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {tools.map((tool, index) => (
                                <div key={tool.id}>
                                    <ToolCard
                                        tool={tool}
                                        rank={index + 1}
                                    />
                                    {/* Ad Slot after Rank #3 */}
                                    {index === 2 && (
                                        <div className="mt-6 mb-6">
                                            <AdPlaceholder />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
