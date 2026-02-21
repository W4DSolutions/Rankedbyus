import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/SearchBar";
import { SearchFilters } from "@/components/SearchFilters";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { ItemWithDetails } from "@/types/models";
import { User } from "lucide-react";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
    const { q: query } = await searchParams;
    return {
        title: query ? `Search results for "${query}" - RankedByUs` : 'Search - RankedByUs',
        description: `Browse the best community-ranked tools matching your search for "${query}".`,
        robots: { index: false, follow: true }, // Don't index search results, but follow links
    };
}

export default async function SearchResultsPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string; category?: string; tags?: string; pricing?: string; sort?: string; verified?: string }>
}) {
    const { q: query, category, tags: tagsParam, pricing, sort, verified } = await searchParams;
    const supabase = await createClient();

    // 1. Fetch metadata for filters
    const [categoriesRes, tagsRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('tags').select('*').order('name')
    ]);

    const categories = categoriesRes.data || [];
    const tags = tagsRes.data || [];

    // 2. Prepare Filters
    const selectedTags = tagsParam ? tagsParam.split(',').filter(Boolean) : [];

    const hasFilters = Boolean(query || category || selectedTags.length > 0 || pricing || verified);

    let results: ItemWithDetails[] = [];

    if (hasFilters) {
        let queryBuilder = supabase
            .from('items')
            .select(`
                *,
                categories:category_id!inner (name, slug),
                item_tags (
                    tags (*)
                )
            `)
            .eq('status', 'approved');

        // Text Search
        if (query) {
            queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
        }

        // Category Filter
        if (category) {
            queryBuilder = queryBuilder.eq('categories.slug', category);
        }

        // Pricing Filter
        if (pricing) {
            queryBuilder = queryBuilder.eq('pricing_model', pricing);
        }

        // Verified Filter
        if (verified === 'true') {
            queryBuilder = queryBuilder.gt('vote_count', 10);
        }

        // Tags Filter (Complex: Filter items that have at least one of the selected tags)
        if (selectedTags.length > 0) {
            // First step: Find item IDs that have these tags
            // We use a separate query to get IDs, then filter the main query
            // This avoids the "!inner" problem where we might lose other tags in the response
            const { data: tagMatches } = await supabase
                .from('item_tags')
                .select('item_id, tags!inner(slug)')
                .in('tags.slug', selectedTags);

            const itemIds = tagMatches?.map(tm => tm.item_id) || [];

            if (itemIds.length > 0) {
                queryBuilder = queryBuilder.in('id', itemIds);
            } else {
                // Tags selected but no items match -> force empty result
                queryBuilder = queryBuilder.eq('id', '00000000-0000-0000-0000-000000000000');
            }
        }

        // Primary: Sponsored, Secondary: Selected Sort
        queryBuilder = queryBuilder.order('is_sponsored', { ascending: false });

        if (sort === 'new') {
            queryBuilder = queryBuilder.order('created_at', { ascending: false });
        } else if (sort === 'most-voted') {
            queryBuilder = queryBuilder.order('vote_count', { ascending: false });
        } else {
            queryBuilder = queryBuilder.order('score', { ascending: false });
        }

        const { data } = await queryBuilder;
        results = (data as ItemWithDetails[]) || [];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-blue-600 shadow-lg group-hover:scale-110 transition-transform">
                                <span className="text-xl font-black text-white uppercase">R</span>
                            </div>
                            <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">RankedByUs</h1>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/profile" className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <User size={20} />
                            </Link>
                            <ThemeToggle />
                            <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                                Exit Search
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Filter Sidebar */}
                    <SearchFilters categories={categories} tags={tags} />

                    {/* Results Area */}
                    <div className="flex-1">
                        <div className="mb-8 space-y-6">
                            <SearchBar />
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    {query ? `Results for "${query}"` : 'Explore Catalogue'}
                                </h1>
                                <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">
                                    Found {results.length} assets matching your criteria.
                                </p>
                            </div>
                        </div>

                        {!hasFilters ? (
                            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-16 text-center shadow-sm">
                                <div className="mx-auto h-20 w-20 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center text-4xl mb-6">
                                    🔍
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Initiate Search</h2>
                                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 font-medium">
                                    Select filters from the sidebar or enter a keyword to begin exploring the registry.
                                </p>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-16 text-center">
                                <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4">
                                    <h3 className="text-2xl">⚡️</h3>
                                </div>
                                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">No Signals Found</h2>
                                <p className="mt-2 text-sm text-slate-500 font-medium">Try adjusting your filters or search terms.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {results.map((item, index) => (
                                    <ToolCard
                                        key={item.id}
                                        tool={item}
                                        rank={index + 1}
                                        showCategory={true}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
