'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setShowDropdown(false);
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <div className="relative w-full max-w-xl mx-auto" ref={dropdownRef}>
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setShowDropdown(true)}
                    placeholder="Search for AI writing tools, generators..."
                    className="w-full rounded-2xl border border-slate-700 bg-slate-800/50 px-6 py-4 pl-12 text-white placeholder-slate-400 backdrop-blur-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-xl"
                />
                <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                {isSearching && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
                    </div>
                )}
            </form>

            {showDropdown && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
                    <div className="max-h-[400px] overflow-y-auto">
                        {results.map((result) => (
                            <Link
                                key={result.id}
                                href={`/category/${result.categories?.slug}#${result.slug}`}
                                onClick={() => setShowDropdown(false)}
                                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-700/50 transition-colors border-b border-slate-700/50 last:border-0"
                            >
                                <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-xl">
                                    {result.logo_url ? (
                                        <img src={result.logo_url} alt={result.name} className="h-full w-full object-contain" />
                                    ) : (
                                        result.name[0]
                                    )}
                                </div>
                                <div>
                                    <div className="font-semibold text-white">{result.name}</div>
                                    <div className="text-xs text-slate-400">{result.categories?.name}</div>
                                </div>
                                <div className="ml-auto text-sm font-medium text-blue-400">
                                    ★ {result.score.toFixed(1)}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {showDropdown && query.length >= 2 && results.length === 0 && !isSearching && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-slate-700 bg-slate-800 p-6 text-center text-slate-400 z-50 shadow-2xl">
                    No tools found for "{query}"
                </div>
            )}
        </div>
    );
}
