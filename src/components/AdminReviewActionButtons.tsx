'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Loader2 } from 'lucide-react';

interface AdminReviewActionButtonsProps {
    id: string;
}

export function AdminReviewActionButtons({ id }: AdminReviewActionButtonsProps) {
    const [isProcessing, setIsProcessing] = useState<'approve' | 'reject' | null>(null);
    const router = useRouter();

    const handleAction = async (action: 'approve' | 'reject') => {
        if (!confirm(`Are you sure you want to ${action} this review?`)) return;

        setIsProcessing(action);
        try {
            const response = await fetch('/api/admin/review-action', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, action }),
            });

            if (response.ok) {
                router.refresh();
            } else {
                const data = await response.json();
                alert(`Error: ${data.error || 'Failed to process action'}`);
            }
        } catch (error) {
            console.error('Review action error:', error);
            alert('An unexpected error occurred');
        } finally {
            setIsProcessing(null);
        }
    };

    return (
        <div className="flex gap-2">
            <button
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all active:scale-90 disabled:opacity-50"
                onClick={() => handleAction('approve')}
                disabled={isProcessing !== null}
                title="Approve Review"
            >
                {isProcessing === 'approve' ? (
                    <Loader2 size={14} className="animate-spin" />
                ) : (
                    <Check size={16} strokeWidth={3} />
                )}
            </button>
            <button
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90 disabled:opacity-50"
                onClick={() => handleAction('reject')}
                disabled={isProcessing !== null}
                title="Reject Review"
            >
                {isProcessing === 'reject' ? (
                    <Loader2 size={14} className="animate-spin" />
                ) : (
                    <X size={16} strokeWidth={3} />
                )}
            </button>
        </div>
    );
}
