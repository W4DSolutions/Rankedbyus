
'use client';

import { useState } from 'react';
import {
    MessageSquare,
    CheckCircle2,
    Star,
    X,
    Check,
    Loader2,
    Square,
    CheckSquare
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { AdminReviewActionButtons } from '@/components/AdminReviewActionButtons';

interface Review {
    id: string;
    items?: {
        name: string;
    };
    rating: number;
    comment: string | null;
    created_at: string;
}

interface AdminReviewListProps {
    reviews: Review[];
}

export function AdminReviewList({ reviews: initialReviews }: AdminReviewListProps) {
    const [reviews, setReviews] = useState(initialReviews);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isProcessing, setIsProcessing] = useState(false);

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === reviews.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(reviews.map(r => r.id)));
        }
    };

    const handleBulkAction = async (action: 'approve' | 'reject') => {
        if (selectedIds.size === 0) return;
        if (!confirm(`Are you sure you want to ${action} ${selectedIds.size} reviews?`)) return;

        setIsProcessing(true);
        try {
            const response = await fetch('/api/admin/reviews/bulk-action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ids: Array.from(selectedIds),
                    action
                })
            });

            if (response.ok) {
                // Remove processed reviews
                setReviews(reviews.filter(r => !selectedIds.has(r.id)));
                setSelectedIds(new Set());
            } else {
                alert('Bulk action failed');
            }
        } catch (error) {
            console.error('Bulk action error:', error);
            alert('Something went wrong');
        } finally {
            setIsProcessing(false);
        }
    };

    if (reviews.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-16 text-center">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4">
                    <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">All Clear</h3>
                <p className="mt-2 text-sm text-slate-500 font-medium">No pending user signals requiring moderation.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Bulk Actions Toolbar */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSelectAll}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        {selectedIds.size === reviews.length ? (
                            <CheckSquare size={16} className="text-blue-500" />
                        ) : (
                            <Square size={16} />
                        )}
                        Select All
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {selectedIds.size} Selected
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleBulkAction('reject')}
                        disabled={selectedIds.size === 0 || isProcessing}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                    >
                        Reject
                    </button>
                    <button
                        onClick={() => handleBulkAction('approve')}
                        disabled={selectedIds.size === 0 || isProcessing}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        Approve
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className={cn(
                            "group relative rounded-2xl border bg-white dark:bg-slate-900/50 p-6 shadow-sm transition-all select-none cursor-pointer",
                            selectedIds.has(review.id)
                                ? "border-blue-500 ring-1 ring-blue-500"
                                : "border-slate-200 dark:border-slate-800 hover:border-blue-500/30"
                        )}
                        onClick={() => toggleSelect(review.id)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-start gap-4">
                                <div className={cn(
                                    "mt-1 h-5 w-5 rounded border flex items-center justify-center transition-colors",
                                    selectedIds.has(review.id)
                                        ? "bg-blue-500 border-blue-500 text-white"
                                        : "border-slate-300 dark:border-slate-700 text-transparent"
                                )}>
                                    <Check size={12} strokeWidth={4} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-1">
                                        Origin: {review.items?.name}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                size={12}
                                                className={cn(
                                                    i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200 dark:text-slate-700"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Individual Actions (stop propagation to prevent toggle) */}
                            <div onClick={(e) => e.stopPropagation()}>
                                <AdminReviewActionButtons id={review.id} />
                            </div>
                        </div>
                        <div className="pl-9 relative">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                                {review.comment || (
                                    <span className="italic text-slate-400">No written feedback provided.</span>
                                )}
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-slate-400">
                                <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    {formatDate(review.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
