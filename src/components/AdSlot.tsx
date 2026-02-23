'use client';

import { ExternalLink, Info, Zap, MoveRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ItemWithDetails } from '@/types/models';
import { ToolIcon } from './ToolIcon';

interface AdSlotProps {
    className?: string;
    variant?: 'display' | 'sidebar' | 'native';
    sponsor?: ItemWithDetails | null;
}

export function AdSlot({ className, variant = 'display', sponsor }: AdSlotProps) {
    if (sponsor) {
        // Render Sponsored Tool Ad
        if (variant === 'sidebar') {
            return (
                <div className={cn("rounded-3xl border border-blue-100 dark:border-blue-900/30 bg-white dark:bg-slate-900 p-6 overflow-hidden relative group shadow-sm hover:shadow-md transition-all", className)}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                            <Zap size={10} className="fill-current" /> Sponsored
                        </span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-2 border border-slate-100 dark:border-slate-700">
                            <ToolIcon url={sponsor.logo_url} name={sponsor.name} websiteUrl={sponsor.website_url} width={32} height={32} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase line-clamp-1">{sponsor.name}</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{sponsor.pricing_model || 'Software'}</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-4 line-clamp-3 leading-relaxed">
                        {sponsor.description}
                    </p>
                    <a
                        href={sponsor.affiliate_link || sponsor.website_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 rounded-xl bg-blue-600 text-[10px] font-black text-white uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        Learn More <ExternalLink size={12} />
                    </a>
                </div>
            );
        }

        if (variant === 'native') {
            return (
                <div className={cn("p-8 rounded-[2rem] border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 my-12 relative overflow-hidden group hover:border-blue-400 transition-all", className)}>
                    <div className="absolute top-0 right-0 p-6 opacity-50">
                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-1">Sponsored Suggestion</span>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="h-20 w-20 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-blue-600 shadow-xl border border-blue-100 dark:border-blue-900/30 p-4">
                            <ToolIcon url={sponsor.logo_url} name={sponsor.name} websiteUrl={sponsor.website_url} width={48} height={48} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                                {sponsor.name}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
                                {sponsor.description}
                            </p>
                        </div>
                        <a
                            href={sponsor.affiliate_link || sponsor.website_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whitespace-nowrap px-8 py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                        >
                            Try Now
                        </a>
                    </div>
                </div>
            );
        }

        // Display Variant (Banner)
        return (
            <div className={cn("w-full rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 p-4 my-8 relative overflow-hidden group", className)}>
                <div className="absolute top-2 right-4">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-300">Sponsored</span>
                </div>
                <div className="flex items-center gap-6 max-w-4xl mx-auto">
                    <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center p-2 shadow-sm">
                        <ToolIcon url={sponsor.logo_url} name={sponsor.name} websiteUrl={sponsor.website_url} width={32} height={32} />
                    </div>
                    <div className="flex-1 min-w-0 hidden sm:block">
                        <div className="flex items-baseline gap-2 mb-0.5">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{sponsor.name}</h4>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">• {sponsor.categories?.name || 'Featured Tool'}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{sponsor.description}</p>
                    </div>
                    <a
                        href={sponsor.affiliate_link || sponsor.website_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 px-6 py-2.5 rounded-lg bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                        Visit <MoveRight size={12} />
                    </a>
                </div>
            </div>
        );
    }

    // Default: Placeholder Slots (if no sponsor provided)
    if (variant === 'sidebar') {
        return (
            <div className={cn("rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 overflow-hidden relative group", className)}>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                        Sponsored <Info size={10} />
                    </span>
                </div>
                <div className="h-40 bg-slate-100 dark:bg-slate-950 rounded-2xl mb-4 flex items-center justify-center p-8 text-center group-hover:bg-blue-600/5 transition-colors">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Premium Ad Space Available</p>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase mb-2">Reach 50k+ Tool Hunters Monthly</h4>
                <p className="text-[11px] text-slate-500 font-medium mb-4">Target developers and creators at the moment of decision.</p>
                <button className="w-full py-3 rounded-xl bg-slate-900 dark:bg-blue-600 text-[10px] font-black text-white uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                    Start Campaign <ExternalLink size={12} />
                </button>
            </div>
        );
    }

    if (variant === 'native') {
        return (
            <div className={cn("p-8 rounded-[2rem] border-2 border-dashed border-blue-500/20 bg-blue-500/5 my-12 relative overflow-hidden", className)}>
                <div className="absolute top-0 right-0 p-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-500/40">Market Insight</span>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-blue-600 shadow-xl">
                        <Info size={32} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Optimize Your SaaS Stack with RankedByUs Pro</h4>
                        <p className="text-sm text-slate-500 font-medium italic">Get access to custom audits and cost-benefit analysis tools.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-4 my-8 text-center", className)}>
            <div className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Ad Space</div>
            <div className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-100 dark:bg-slate-950/50 rounded-xl flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">Global Display Slot (728x90)</span>
            </div>
        </div>
    );
}
