
'use client';

import { useState } from 'react';
import { Review } from '@/types/models';
import { StarRating } from '@/components/StarRating';
import { ReviewHelpfulButton } from '@/components/ReviewHelpfulButton';
import { Inbox, ChevronDown, ChevronUp } from 'lucide-react';

interface ReviewListProps {
    reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Sort logic handled by parent (server) query, but we assume they are passed in correct order.
    // Display logic: show 4 initially, or all if expanded.
    const displayedReviews = isExpanded ? reviews : reviews.slice(0, 4);
    const hasMore = reviews.length > 4;

    if (reviews.length === 0) {
        return (
            <div className="rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-24 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-700 mb-8">
                    <Inbox size={40} strokeWidth={1} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">No signals detected</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">Be the first to record a tactical review for this asset.</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="grid gap-8">
                {displayedReviews.map((review) => (
                    <div key={review.id} className="group rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-10 backdrop-blur-sm shadow-sm hover:shadow-2xl hover:border-blue-500/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white font-black text-xs border border-slate-200 dark:border-slate-700">
                                    {review.session_id.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Verified Auditor</div>
                                        <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            TX_{review.id.split('-')[0]}
                                        </div>
                                    </div>
                                    <StarRating rating={review.rating} size="sm" />
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 text-right">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
                                </div>
                                <ReviewHelpfulButton
                                    reviewId={review.id}
                                    initialCount={review.helpful_count || 0}
                                    className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                />
                            </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed text-xl font-medium relative">
                            <span className="absolute -left-4 top-0 text-slate-100 dark:text-slate-800 text-6xl leading-none select-none font-serif">&quot;</span>
                            <span className="relative z-10">{review.comment}</span>
                        </p>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-black uppercase tracking-widest text-[10px] hover:border-blue-500/50 hover:shadow-lg transition-all"
                    >
                        {isExpanded ? (
                            <>
                                Show Less Signals <ChevronUp size={14} />
                            </>
                        ) : (
                            <>
                                View All Signals <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
