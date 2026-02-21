'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Tag } from '@/types/models';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, Filter, ShieldCheck, Zap } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface CategoryFiltersProps {
    tags: Tag[];
    currentTagSlug?: string;
    baseUrl: string; // e.g. /category/ai-writing-tools
}

export function CategoryFilters({ tags, currentTagSlug, baseUrl }: CategoryFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentPricing = searchParams.get('pricing');
    const isVerified = searchParams.get('verified') === 'true';

    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const pricingRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pricingRef.current && !pricingRef.current.contains(event.target as Node)) {
                setIsPricingOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updateQuery = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === null) {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        // Preserve sorting if it exists
        if (searchParams.get('sort')) {
            params.set('sort', searchParams.get('sort')!);
        }

        return params.toString();
    };

    const handlePricingChange = (model: string | null) => {
        const queryString = updateQuery('pricing', model);
        const url = `${pathname}?${queryString}`;
        router.push(url, { scroll: false });
        setIsPricingOpen(false);
    };

    const toggleVerified = () => {
        const queryString = updateQuery('verified', isVerified ? null : 'true');
        const url = `${pathname}?${queryString}`;
        router.push(url, { scroll: false });
    };

    // Calculate active filters count
    const activeFiltersCount = (currentTagSlug ? 1 : 0) + (currentPricing ? 1 : 0) + (isVerified ? 1 : 0);

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                {/* Mobile Filter Header */}
                <div className="flex items-center gap-2 lg:hidden text-slate-500 mb-2">
                    <Filter size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Filters ({activeFiltersCount})</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Tags (Quick Filter) */}
                    <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 lg:pb-0 scrollbar-hide mask-fade-right">
                        <Link
                            href={`${baseUrl}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
                            className={cn(
                                "flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap",
                                !currentTagSlug
                                    ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20"
                                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-blue-400"
                            )}
                        >
                            All
                        </Link>
                        {tags.map((tag) => (
                            <Link
                                key={tag.id}
                                href={`${baseUrl}/${tag.slug}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
                                className={cn(
                                    "flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap",
                                    currentTagSlug === tag.slug
                                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-blue-400"
                                )}
                            >
                                {tag.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                    {/* Verified Toggle */}
                    <button
                        onClick={toggleVerified}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                            isVerified
                                ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-green-500/30 hover:text-green-600"
                        )}
                    >
                        <ShieldCheck size={14} className={cn(isVerified && "fill-current")} />
                        Verified Only
                    </button>

                    {/* Pricing Dropdown */}
                    <div className="relative" ref={pricingRef}>
                        <button
                            onClick={() => setIsPricingOpen(!isPricingOpen)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                currentPricing
                                    ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900"
                                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-blue-500/30 hover:text-blue-600"
                            )}
                        >
                            <Zap size={14} className={cn(currentPricing && "fill-current")} />
                            {currentPricing || 'Pricing'}
                            <ChevronDown size={12} className={cn("transition-transform", isPricingOpen && "rotate-180")} />
                        </button>

                        {isPricingOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-1">
                                    <button
                                        onClick={() => handlePricingChange(null)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors",
                                            !currentPricing ? "bg-slate-100 dark:bg-slate-800 text-blue-600" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        )}
                                    >
                                        All Models
                                        {!currentPricing && <Check size={12} />}
                                    </button>
                                    {['Free', 'Freemium', 'Paid'].map((model) => (
                                        <button
                                            key={model}
                                            onClick={() => handlePricingChange(model)}
                                            className={cn(
                                                "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors",
                                                currentPricing === model ? "bg-slate-100 dark:bg-slate-800 text-blue-600" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                            )}
                                        >
                                            {model}
                                            {currentPricing === model && <Check size={12} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
