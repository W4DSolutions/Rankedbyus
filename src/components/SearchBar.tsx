'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, Loader2, Star } from 'lucide-react';
import { ItemWithDetails } from '@/types/models';
import { ToolIcon } from '@/components/ToolIcon';

function SearchBarContent() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ItemWithDetails[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 2) {
                setResults([]);
                setShowDropdown(false);
                return;
            }

            setIsSearching(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                if (data.results) {
                    setResults(data.results);
                    setShowDropdown(true);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    // Pre-fill query from URL if we are on the search page
    useEffect(() => {
        if (pathname === '/search') {
            const q = searchParams.get('q');
            if (q) setQuery(q);
        }
    }, [pathname, searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setShowDropdown(false);

            // If we are already on the search page, preserve current filters
            if (pathname === '/search') {
                const params = new URLSearchParams(searchParams.toString());
                params.set('q', query.trim());
                router.push(`/search?${params.toString()}`);
            } else {
                router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            }
        }
    };

    return (
        <div className="relative w-full max-w-xl mx-auto" ref={dropdownRef}>
            <form onSubmit={handleSubmit} className="relative group">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setShowDropdown(true)}
                    placeholder="Search for AI writing tools, generators..."
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-6 py-4 pl-12 text-slate-900 dark:text-white placeholder-slate-400 backdrop-blur-xl focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-xl shadow-blue-500/5 font-medium group-hover:border-slate-300 dark:group-hover:border-slate-700"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Search size={18} strokeWidth={2.5} />
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isSearching ? (
                        <Loader2 className="animate-spin h-4 w-4 text-blue-500" />
                    ) : (
                        <div className="hidden sm:flex items-center gap-1 font-black text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <span className="text-[12px]">⌘</span>
                            <span>K</span>
                        </div>
                    )}
                </div>
            </form>

            {showDropdown && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900 shadow-2xl overflow-hidden z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {results.map((result) => (
                            <Link
                                key={result.id}
                                href={`/tool/${result.slug}`}
                                onClick={() => setShowDropdown(false)}
                                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 group/result"
                            >
                                <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden p-2 group-hover/result:scale-105 transition-transform">
                                    <ToolIcon
                                        url={result.logo_url}
                                        name={result.name}
                                        websiteUrl={result.website_url}
                                        width={48}
                                        height={48}
                                        unoptimized={true}
                                        className="h-full w-full"
                                        imgClassName="object-contain"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="font-black text-slate-900 dark:text-white group-hover/result:text-blue-600 dark:group-hover/result:text-blue-400 transition-colors uppercase tracking-tight leading-none">{result.name}</div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{result.categories?.name}</div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-1 text-sm font-black text-slate-900 dark:text-white">
                                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                        {(result.average_rating || 0).toFixed(1)}
                                    </div>
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Score: {result.score}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {showDropdown && query.length >= 2 && results.length === 0 && !isSearching && (
                <div className="absolute top-full left-0 right-0 mt-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-slate-500 z-50 shadow-2xl font-bold italic">
                    No elite tools found for &quot;{query}&quot;
                </div>
            )}
        </div>
    );
}

export function SearchBar() {
    return (
        <Suspense fallback={<div className="w-full max-w-xl mx-auto h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />}>
            <SearchBarContent />
        </Suspense>
    );
}
