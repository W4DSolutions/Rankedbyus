import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SubmitToolModal } from "@/components/SubmitToolModal";
import { SortSelector, SortOption } from "@/components/SortSelector";
import { ToolCard } from "@/components/ToolCard";
import { SponsoredBanner } from "@/components/SponsoredBanner";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/models";

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
    searchParams: Promise<{ sort?: SortOption, tag?: string }>
}) {
    const supabase = await createClient();
    const { slug } = await params;
    const { sort = 'top', tag } = await searchParams;

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
            item_tags!inner (
                tags (*)
            )
        `)
        .eq('category_id', category.id)
        .eq('status', 'approved');

    if (tag) {
        query = query.eq('item_tags.tags.slug', tag);
    }

    if (sort === 'new') {
        query = query.order('created_at', { ascending: false });
    } else if (sort === 'most-voted') {
        query = query.order('vote_count', { ascending: false });
    } else {
        query = query.order('score', { ascending: false });
    }

    const { data: items } = await query;
    const tools = (items || []) as any[];

    // Fetch all available tags to show in filter bar
    const { data: allTagsData } = await supabase
        .from('tags')
        .select('*')
        .order('name');

    const allTags = (allTagsData || []) as any[];

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
                            <SubmitToolModal />
                        </nav>
                    </div>
                </div>
            </header>

            {/* Category Hero */}
            <section className="border-b border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl">
                            {category.name.includes('Writing') ? '✍️' :
                                category.name.includes('Image') ? '🎨' :
                                    category.name.includes('Video') ? '🎬' :
                                        category.name.includes('Code') ? '💻' : '🔧'}
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white">{category.name}</h2>
                            <p className="mt-2 text-slate-300">{category.description}</p>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-6 text-sm text-slate-400">
                        <span>{tools.length} {tag ? `"${tag}"` : ''} tools ranked</span>
                        <span>•</span>
                        <span>Updated daily</span>
                    </div>
                </div>
            </section>

            {/* Rankings List */}
            <section className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Filter & Sort Bar */}
                    <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                        <div className="flex items-center gap-2 min-w-max">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">Filter by:</span>
                            <Link
                                href={`/category/${slug}${sort ? `?sort=${sort}` : ''}`}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-xs font-medium transition-all border",
                                    !tag ? "bg-slate-700 border-slate-600 text-white shadow-lg" : "border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                                )}
                            >
                                All Tools
                            </Link>
                            {allTags?.map((ctag) => (
                                <Link
                                    key={ctag.id}
                                    href={`/category/${slug}?tag=${ctag.slug}${sort ? `&sort=${sort}` : ''}`}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap",
                                        tag === ctag.slug ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20" : "border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                                    )}
                                >
                                    {ctag.name}
                                </Link>
                            ))}
                        </div>
                        <SortSelector />
                    </div>

                    <SponsoredBanner />

                    {tools.length === 0 ? (
                        <div className="rounded-2xl border border-slate-700/30 bg-slate-800/20 p-20 text-center backdrop-blur-sm">
                            <div className="text-6xl mb-6 opacity-20">
                                {tag ? '🔍' : '📭'}
                            </div>
                            <h3 className="text-2xl font-bold text-white">
                                {tag ? `No tools tagged "${tag}"` : 'This category is empty'}
                            </h3>
                            <p className="mt-3 text-slate-400 max-w-sm mx-auto">
                                {tag ? 'We couldn\'t find any tools with this specific tag. Try another one!' : 'Be the pioneer! Submit the first tool for this category using the button above.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tools.map((tool, index) => (
                                <ToolCard
                                    key={tool.id}
                                    tool={tool}
                                    rank={index + 1}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
