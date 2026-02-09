'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminReviewActionButtonsProps {
    id: string;
}

export function AdminReviewActionButtons({ id }: AdminReviewActionButtonsProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();

    const handleAction = async (action: 'approve' | 'reject') => {
        if (!confirm(`Are you sure you want to ${action} this review?`)) return;

        setIsProcessing(true);
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
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex gap-2">
            <button
                className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                onClick={() => handleAction('approve')}
                disabled={isProcessing}
            >
                Approve
            </button>
            <button
                className="rounded-lg border border-red-600 bg-red-600/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-600/20 transition-colors disabled:opacity-50"
                onClick={() => handleAction('reject')}
                disabled={isProcessing}
            >
                Reject
            </button>
        </div>
    );
}
