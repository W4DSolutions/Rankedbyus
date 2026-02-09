'use client';

import { useState } from 'react';
import { StarRating } from './StarRating';
import { cn } from '@/lib/utils';

interface ReviewModalProps {
    itemId: string;
    itemName: string;
    onSuccess?: () => void;
}

export function ReviewModal({ itemId, itemName, onSuccess }: ReviewModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-[10px] font-bold text-slate-500 hover:text-blue-400 transition-colors uppercase tracking-widest flex items-center gap-1.5"
            >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Rate & Review
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => !isSubmitting && setIsOpen(false)} />

                    <div className="relative w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
                                </svg>
                            </button>
                        </div>

                        {success ? (
                            <div className="py-12 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-500 mb-6">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Review Submitted!</h3>
                                <p className="text-slate-400">Your review has been sent to moderation. Thank you for making our community better.</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-white mb-2">Review {itemName}</h2>
                                <p className="text-slate-400 mb-8 text-sm">Help others by sharing your experience with this tool.</p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-3">Your Rating</label>
                                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 flex justify-center">
                                            <StarRating
                                                rating={rating}
                                                size="lg"
                                                interactive
                                                onRatingChange={setRating}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="comment" className="block text-sm font-medium text-slate-300 mb-2">
                                            What do you think? (Optional)
                                        </label>
                                        <textarea
                                            id="comment"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows={4}
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                            placeholder="Tell us about the features, pricing, or ease of use..."
                                        />
                                    </div>

                                    {error && (
                                        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-500">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full rounded-2xl bg-blue-600 py-4 text-base font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40 disabled:opacity-50 flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        ) : (
                                            'Submit Review'
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
