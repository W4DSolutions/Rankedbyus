'use client';

import { useState } from 'react';
import { CheckCircle2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn exists

interface ReviewHelpfulButtonProps {
    reviewId: string;
    initialCount: number;
    className?: string; // Optional className prop
}

export function ReviewHelpfulButton({ reviewId, initialCount, className }: ReviewHelpfulButtonProps) {
    const [count, setCount] = useState(initialCount);
    const [hasVoted, setHasVoted] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleHelpful = async () => {
        if (hasVoted || isUpdating) return;

        setIsUpdating(true);
        // Optimistic update
        setCount(prev => prev + 1);
        setHasVoted(true);

        try {
            await fetch('/api/review/helpful', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reviewId }),
            });
        } catch (error) {
            // Revert optimistically
            setCount(prev => prev - 1);
            setHasVoted(false);
            console.error('Failed to mark helpful:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <button
            onClick={handleHelpful}
            disabled={hasVoted || isUpdating}
            className={cn(
                "text-[9px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors",
                hasVoted ? "text-green-600 dark:text-green-500" : "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
                className
            )}
            title={hasVoted ? "You marked this as helpful" : "Mark as helpful"}
        >
            {hasVoted ? <CheckCircle size={10} /> : <CheckCircle2 size={10} />}
            Helpful ({count})
        </button>
    );
}
