'use client';

import Link from 'next/link';
import { VoteButtons } from './VoteButtons';
import { ReviewModal } from './ReviewModal';
import { TagBadge } from './TagBadge';
import { StarRating } from './StarRating';
import { cn } from '@/lib/utils';
import { ItemWithDetails } from '@/types/models';

interface ToolCardProps {
    tool: ItemWithDetails;
    rank?: number;
    showCategory?: boolean;
}

export function ToolCard({ tool, rank, showCategory }: ToolCardProps) {
    const isTopThree = rank && rank <= 3;

    return (
        <div
            id={tool.slug}
            className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6 backdrop-blur-md transition-all hover:border-blue-500/40 hover:bg-slate-800/60"
            itemScope
            itemType="https://schema.org/SoftwareApplication"
        >
            {/* Glass reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Rank & Vote */}
                <div className="flex flex-col items-center min-w-[80px]">
                    {rank && (
                        <div className={cn(
                            "text-4xl font-black mb-4 select-none",
                            rank === 1 ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]' :
                                rank === 2 ? 'text-slate-300' :
                                    rank === 3 ? 'text-amber-600' :
                                        'text-slate-600'
                        )}>
                            {rank}
                        </div>
                    )}
                    <VoteButtons
                        itemId={tool.id}
                        initialScore={tool.score}
                        initialVoteCount={tool.vote_count}
                    />
                </div>

                {/* Logo */}
                <div className="flex-shrink-0 h-24 w-24 rounded-3xl bg-slate-900 border border-slate-700/50 overflow-hidden flex items-center justify-center p-3 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                    <img
                        src={tool.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=1e293b&color=fff&size=128&bold=true`}
                        alt={tool.name}
                        className="h-full w-full object-contain rounded-xl"
                        itemProp="image"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
                        <h3 className="text-2xl font-black text-white hover:text-blue-400 transition-colors uppercase tracking-tight" itemProp="name">
                            {tool.name}
                        </h3>
                        {showCategory && tool.categories && (
                            <Link
                                href={`/category/${tool.categories.slug}`}
                                className="text-[10px] font-bold text-blue-400/60 hover:text-blue-400 uppercase tracking-widest border border-blue-500/20 px-2 py-0.5 rounded"
                            >
                                {tool.categories.name}
                            </Link>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {tool.item_tags?.map((it: any) => (
                                <TagBadge
                                    key={it.tags.id}
                                    name={it.tags.name}
                                    slug={it.tags.slug}
                                    color={it.tags.color}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center md:justify-start mb-3">
                        <StarRating rating={tool.average_rating} size="sm" />
                        <span className="ml-2 text-[10px] text-slate-500 font-bold uppercase tracking-tighter self-center">
                            ({tool.review_count} reviews)
                        </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed max-w-3xl text-sm md:text-base" itemProp="description">
                        {tool.description}
                    </p>

                    <div className="mt-6 flex flex-wrap justify-center md:justify-start items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            {tool.vote_count} Community Votes
                        </div>
                        <ReviewModal itemId={tool.id} itemName={tool.name} />
                        <div className="flex items-center gap-2 text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Verified for 2026
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col gap-3 min-w-[180px] w-full md:w-auto">
                    <a
                        href={tool.affiliate_link || tool.website_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40 active:scale-95"
                        itemProp="url"
                    >
                        Visit Tool
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
