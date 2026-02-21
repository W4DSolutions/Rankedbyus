'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Trophy, Zap, BarChart3, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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

    const options: { value: SortOption; label: string; icon: LucideIcon }[] = [
        { value: 'top', label: 'Alpha', icon: Trophy },
        { value: 'new', label: 'Release', icon: Zap },
        { value: 'most-voted', label: 'Volume', icon: BarChart3 },
    ];

    return (
        <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Sort Matrix</span>
            <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-inner min-w-max">
                {options.map((option) => {
                    const Icon = option.icon;
                    const isActive = currentSort === option.value;
                    return (
                        <button
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-95",
                                isActive
                                    ? "bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xl shadow-blue-500/10"
                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800"
                            )}
                        >
                            <Icon size={14} className={cn("transition-transform duration-500", isActive && "rotate-[10deg]")} />
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
