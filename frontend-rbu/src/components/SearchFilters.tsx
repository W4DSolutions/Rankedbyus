'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Filter, X, Check, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category, Tag } from '@/types/models';

interface SearchFiltersProps {
    categories: Category[];
    tags: Tag[];
}

export function SearchFilters({ categories, tags }: SearchFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get current filters
    const currentCategory = searchParams.get('category');
    const currentTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const currentPricing = searchParams.get('pricing');
    const isVerified = searchParams.get('verified') === 'true';
    const currentQuery = searchParams.get('q');

    // Create a new URLSearchParams object
    const createQueryString = useCallback(
        (name: string, value: string | null) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === null) {
                params.delete(name);
            } else {
                params.set(name, value);
            }
            return params.toString();
        },
        [searchParams]
    );

    // Handle Verified Toggle
    const handleVerifiedToggle = () => {
        router.push(`/search?${createQueryString('verified', isVerified ? null : 'true')}`, { scroll: false });
    };

    // Handle Category Change
    const handleCategoryChange = (slug: string | null) => {
        router.push(`/search?${createQueryString('category', slug)}`, { scroll: false });
    };

    // Handle Pricing Change
    const handlePricingChange = (model: string | null) => {
        router.push(`/search?${createQueryString('pricing', model)}`, { scroll: false });
    };

    // Handle Tag Change
    const handleTagToggle = (slug: string) => {
        const newTags = currentTags.includes(slug)
            ? currentTags.filter(t => t !== slug)
            : [...currentTags, slug];

        const tagsString = newTags.length > 0 ? newTags.join(',') : null;
        router.push(`/search?${createQueryString('tags', tagsString)}`, { scroll: false });
    };

    // Clear All Filters
    const clearFilters = () => {
        const params = new URLSearchParams();
        if (currentQuery) params.set('q', currentQuery);
        router.push(`/search?${params.toString()}`);
    };

    const hasFilters = currentCategory || currentTags.length > 0 || currentPricing || isVerified;

    return (
        <aside className="w-full lg:w-72 lg:flex-shrink-0 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Filter size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Refine Signal</span>
                </div>
                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-widest flex items-center gap-1 transition-colors"
                    >
                        <X size={12} /> Clear
                    </button>
                )}
            </div>

            {/* Verified Filter */}
            <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Quality Assurance</h3>
                <button
                    onClick={handleVerifiedToggle}
                    className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left",
                        isVerified
                            ? "bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400"
                            : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-green-500/30 hover:text-green-600 dark:hover:text-green-400"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className={cn(isVerified && "fill-current")} />
                        Verified Only
                    </div>
                    {isVerified && <Check size={12} strokeWidth={3} />}
                </button>
            </div>

            {/* Categories */}
            <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Niche</h3>
                <div className="space-y-1">
                    <button
                        onClick={() => handleCategoryChange(null)}
                        className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all",
                            !currentCategory
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400"
                        )}
                    >
                        All Categories
                        {!currentCategory && <Check size={12} strokeWidth={3} />}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.slug)}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left",
                                currentCategory === cat.slug
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400"
                            )}
                        >
                            {cat.name}
                            {currentCategory === cat.slug && <Check size={12} strokeWidth={3} />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Pricing Filter */}
            <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Financial Model</h3>
                <div className="space-y-1">
                    {['All', 'Free', 'Freemium', 'Paid'].map((model) => (
                        <button
                            key={model}
                            onClick={() => handlePricingChange(model === 'All' ? null : model)}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left",
                                (currentPricing === model || (!currentPricing && model === 'All'))
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400"
                            )}
                        >
                            {model}
                            {(currentPricing === model || (!currentPricing && model === 'All')) && <Check size={12} strokeWidth={3} />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Attributes</h3>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                        const isSelected = currentTags.includes(tag.slug);
                        return (
                            <button
                                key={tag.id}
                                onClick={() => handleTagToggle(tag.slug)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95",
                                    isSelected
                                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white"
                                        : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600"
                                )}
                            >
                                {tag.name}
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}
