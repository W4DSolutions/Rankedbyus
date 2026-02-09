'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export type SortOption = 'top' | 'new' | 'most-voted';

export function SortSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = (searchParams.get('sort') as SortOption) || 'top';

    const handleSortChange = (sort: SortOption) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', sort);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const options: { value: SortOption; label: string }[] = [
        { value: 'top', label: 'Top Rated' },
        { value: 'new', label: 'Newest' },
        { value: 'most-voted', label: 'Most Voted' },
    ];

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sort by:</span>
            <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50 backdrop-blur-sm">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${currentSort === option.value
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
