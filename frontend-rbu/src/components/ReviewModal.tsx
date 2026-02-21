'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Star, CheckCircle2, X, MessageSquarePlus } from 'lucide-react';
import { StarRating } from './StarRating';
import { cn } from '@/lib/utils';

interface ReviewModalProps {
    itemId: string;
    itemName: string;
    onSuccess?: () => void;
    className?: string;
    isAuthenticated?: boolean;
}

export function ReviewModal({ itemId, itemName, onSuccess, className, isAuthenticated = true }: ReviewModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Use Portal to render modal at document body level to avoid stacking context issues
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ item_id: itemId, rating, comment }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    setIsOpen(false);
                    setSuccess(false);
                    setComment('');
                    setRating(5);
                    onSuccess?.();
                }, 2000);
            } else {
                setError(data.error || 'Failed to submit review');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const modalContent = (
        <div
            className="fixed inset-0 z-[9999] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="flex min-h-screen items-center justify-center p-4 text-center">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                    onClick={() => !isSubmitting && setIsOpen(false)}
                    aria-hidden="true"
                />

                {/* Modal Card */}
                <div className="relative w-full max-w-lg rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 md:p-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 focus:outline-none text-left my-8">
                    <div className="absolute top-0 right-0 p-6 z-10">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            disabled={isSubmitting}
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {success ? (
                        <div className="py-12 text-center" role="status" aria-live="polite">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-green-500/10 text-green-500 mb-8 animate-bounce">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tighter">Voice Recorded</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Your audit has been submitted for community verification.</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-10">
                                <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                                    <Star size={16} fill="currentColor" aria-hidden="true" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Community Audit</span>
                                </div>
                                <h2 id="modal-title" className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Review {itemName}</h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Share your tactical experience with the community.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div role="group" aria-labelledby="rating-label" className="border-0 p-0 m-0 min-w-0">
                                    <div id="rating-label" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Precision Rating</div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50 flex justify-center shadow-inner">
                                        <StarRating
                                            rating={rating}
                                            size="lg"
                                            interactive
                                            onRatingChange={setRating}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="comment" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                        Strategic Metadata (Optional)
                                    </label>
                                    <textarea
                                        id="comment"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows={4}
                                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-5 py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium resize-none shadow-sm"
                                        placeholder="What absolute features defined your workflow?"
                                    />
                                </div>

                                {error && (
                                    <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-xs font-bold text-red-500 flex items-center gap-3" role="alert">
                                        <X size={16} aria-hidden="true" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded-2xl bg-slate-900 dark:bg-blue-600 py-5 text-sm font-black text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 active:scale-95 uppercase tracking-[0.2em] focus:ring-4 focus:ring-blue-500/20 focus:outline-none"
                                >
                                    {isSubmitting ? (
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mx-auto" aria-label="Submitting review..." />
                                    ) : (
                                        'Publish Review'
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button
                onClick={() => {
                    if (!isAuthenticated) {
                        window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
                    } else {
                        setIsOpen(true);
                    }
                }}
                className={cn(
                    "group inline-flex items-center gap-2 transition-all active:scale-95",
                    className || "rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/30 shadow-sm"
                )}
                aria-label={!isAuthenticated ? `Sign in to review ${itemName}` : `Write a review for ${itemName}`}
            >
                <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {!isAuthenticated ? (
                        <span role="img" aria-label="Locked" className="text-xs group-hover:rotate-12 transition-transform">🔒</span>
                    ) : (
                        <MessageSquarePlus size={12} className="group-hover:rotate-12 transition-transform" />
                    )}
                </div>
                {!isAuthenticated ? 'Sign in to Review' : 'Write Review'}
            </button>

            {isOpen && mounted && createPortal(modalContent, document.body)}
        </>
    );
}
