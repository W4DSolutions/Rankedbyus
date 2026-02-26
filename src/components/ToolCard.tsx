'use client';

import Link from 'next/link';
import {
    ArrowUpRight,
    TrendingUp,
    ShieldCheck,
    Share2,
    Sparkles,
    Scale
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { VoteButtons } from './VoteButtons';
import { ReviewModal } from './ReviewModal';
import { TagBadge } from './TagBadge';
import { StarRating } from './StarRating';
import { getSupabaseClient } from '@/lib/supabase/client';
import { ToolIcon } from '@/components/ToolIcon';
import { cn } from '@/lib/utils';
import { ItemWithDetails } from '@/types/models';

interface ToolCardProps {
    tool: ItemWithDetails;
    rank?: number;
    showCategory?: boolean;
    priority?: boolean;
}

export function ToolCard({ tool, rank, showCategory, priority }: ToolCardProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentVoteCount, setCurrentVoteCount] = useState(tool.vote_count);
    const [currentScore, setCurrentScore] = useState(tool.score);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = getSupabaseClient();
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
        };
        checkAuth();
    }, []);

    return (
        <div
            id={tool.slug}
            className="group relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-8 backdrop-blur-xl transition-all hover:border-blue-500/30 hover:bg-white dark:hover:bg-slate-900/60 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5"
            itemScope
            itemType="https://schema.org/SoftwareApplication"
        >
            {/* Tactical background detail */}
            <div className="absolute -right-4 -top-4 text-blue-500/5 font-black text-9xl italic pointer-events-none group-hover:text-blue-500/10 transition-colors">
                {rank && `#${rank}`}
            </div>

            {tool.is_sponsored && (!tool.sponsored_until || new Date(tool.sponsored_until) > new Date()) && (
                <div className="absolute top-0 right-0 z-20">
                    <div className="bg-gradient-to-l from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-6 py-2 rounded-bl-3xl shadow-lg flex items-center gap-2">
                        <Sparkles size={12} className="animate-pulse" />
                        Sponsored Analysis
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
                {/* Rank & Vote */}
                <div className="flex flex-col items-center min-w-[100px]">
                    {rank && (
                        <div className={cn(
                            "text-5xl font-black mb-6 select-none uppercase tracking-tighter leading-none",
                            rank === 1 ? 'text-blue-600 dark:text-blue-500 drop-shadow-[0_0_15px_rgba(37,99,235,0.2)]' :
                                rank === 2 ? 'text-slate-400 dark:text-slate-600' :
                                    rank === 3 ? 'text-slate-300 dark:text-slate-700' :
                                        'text-slate-100 dark:text-slate-900'
                        )}>
                            {rank.toString().padStart(2, '0')}
                        </div>
                    )}
                    <VoteButtons
                        itemId={tool.id}
                        initialScore={tool.score}
                        initialVoteCount={tool.vote_count}
                        onVoteChange={(newScore, newCount) => {
                            setCurrentScore(newScore);
                            setCurrentVoteCount(newCount);
                        }}
                    />
                </div>

                {/* Logo */}
                <div className="relative flex-shrink-0 h-28 w-28 rounded-[2.5rem] bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800/50 overflow-hidden flex items-center justify-center p-6 shadow-2xl group-hover:scale-105 transition-transform duration-500 animate-shimmer relative">
                    <ToolIcon
                        url={tool.logo_url}
                        name={tool.name}
                        websiteUrl={tool.website_url}
                        fill
                        unoptimized={true}
                        priority={priority}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="h-full w-full"
                        imgClassName="object-contain p-4"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-3">
                        <Link href={`/tool/${tool.slug}`}>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-tight leading-none" itemProp="name">
                                {tool.name}
                            </h3>
                        </Link>
                        {showCategory && tool.categories && (
                            <Link
                                href={`/category/${tool.categories.slug}`}
                                className="text-[10px] font-black text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white uppercase tracking-widest border-2 border-blue-600/10 px-3 py-1 rounded-xl transition-all"
                            >
                                {tool.categories.name}
                            </Link>
                        )}
                        {tool.pricing_model && (
                            <div className={cn(
                                "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl border-2 transition-all",
                                tool.pricing_model === 'Free'
                                    ? "text-emerald-500 border-emerald-500/10 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white"
                                    : tool.pricing_model === 'Paid'
                                        ? "text-amber-500 border-amber-500/10 bg-amber-500/5 hover:bg-amber-500 hover:text-white"
                                        : "text-blue-500 border-blue-500/10 bg-blue-500/5 hover:bg-blue-500 hover:text-white"
                            )}>
                                {tool.pricing_model}
                            </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {tool.item_tags?.filter(it => it.tags).map((it) => (
                                <TagBadge
                                    key={it.tags.id}
                                    name={it.tags.name}
                                    slug={it.tags.slug}
                                    color={it.tags.color}
                                    href={tool.categories ? `/category/${tool.categories.slug}/${it.tags.slug}` : undefined}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center md:justify-start items-center gap-3 mb-4">
                        <StarRating rating={tool.average_rating} size="sm" />
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            Based on {tool.review_count} Intelligence Signals
                        </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl text-base font-medium mb-8" itemProp="description">
                        {tool.description}
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl transition-all shadow-inner">
                            <TrendingUp size={14} className="text-blue-500" />
                            {currentScore >= 0 ? `+${currentScore}` : currentScore} Power Rating ({currentVoteCount} Signals)
                        </div>
                        <ReviewModal
                            itemId={tool.id}
                            itemName={tool.name}
                            isAuthenticated={isAuthenticated}
                            className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors bg-slate-100/50 dark:bg-slate-900 px-4 py-2 rounded-xl"
                        />
                        {tool.is_verified && (
                            <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-500/5 px-4 py-2 rounded-xl border border-blue-500/10">
                                <ShieldCheck size={14} />
                                Founder Verified
                            </div>
                        )}
                        {!tool.is_verified && (
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 bg-slate-500/5 px-4 py-2 rounded-xl border border-slate-500/10">
                                <ShieldCheck size={14} />
                                Community Audited
                            </div>
                        )}
                        <button
                            onClick={async (e) => {
                                e.preventDefault();
                                const url = `${window.location.origin}/tool/${tool.slug}`;
                                if (navigator.share) {
                                    try {
                                        await navigator.share({
                                            title: `${tool.name} | RankedByUs`,
                                            text: `Check out ${tool.name} on RankedByUs - Community Intelligence Registry.`,
                                            url: url
                                        });
                                    } catch (err) {
                                        // User cancelled or error
                                    }
                                } else {
                                    navigator.clipboard.writeText(url);
                                    alert('Registry link copied to clipboard!');
                                }
                            }}
                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors flex items-center gap-2"
                        >
                            <Share2 size={14} />
                            Share
                        </button>
                        {tool.categories && (
                            <Link
                                href={`/compare/${tool.slug}-vs-leader`}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors flex items-center gap-2"
                                title="Compare against category leader"
                            >
                                <Scale size={14} />
                                Compare
                            </Link>
                        )}
                        {tool.articles && tool.articles.length > 0 && (
                            <Link
                                href={`/article/${tool.articles[0].slug}`}
                                className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors flex items-center gap-2"
                                title="Read our deep analysis"
                            >
                                <Sparkles size={14} className="animate-pulse" />
                                Read Study
                            </Link>
                        )}
                    </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col gap-3 min-w-[200px] w-full md:w-auto pt-4">
                    <a
                        href={`/go/${tool.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 rounded-[1.25rem] bg-slate-900 dark:bg-blue-600 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95 group-hover:scale-105"
                        itemProp="url"
                    >
                        Deploy Interface
                        <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>

                </div>
            </div>
        </div>
    );
}
