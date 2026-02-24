'use client';

import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { formatScore } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { getSupabaseClient } from '@/lib/supabase/client';

interface VoteButtonsProps {
    itemId: string;
    initialScore: number;
}

export function VoteButtons({ itemId, initialScore }: VoteButtonsProps) {
    const [score, setScore] = useState(initialScore);
    const [userVote, setUserVote] = useState<1 | -1 | null>(null);
    const [isVoting, setIsVoting] = useState(false);

    useEffect(() => {
        const fetchUserVote = async () => {
            try {
                const response = await fetch(`/api/vote?item_id=${itemId}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserVote(data.user_vote);
                }
            } catch (error) {
                console.error('Error fetching user vote:', error);
            }
        };

        fetchUserVote();
    }, [itemId]);

    const handleVote = async (value: 1 | -1) => {
        if (isVoting) return;

        const supabase = getSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
            return;
        }

        // Optimistic update
        const wasVoted = userVote === value;
        const newVote = wasVoted ? null : value;
        const scoreDelta = wasVoted ? -value : (userVote ? value - userVote : value);

        setScore((prev) => prev + scoreDelta);
        setUserVote(newVote);
        setIsVoting(true);

        try {
            const response = await fetch('/api/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item_id: itemId,
                    value: newVote,
                }),
            });

            if (!response.ok) {
                throw new Error('Vote failed');
            }

            const data = await response.json();

            // Update with actual server response
            if (data.new_score !== undefined) {
                setScore(data.new_score);
            }
        } catch (error) {
            // Revert optimistic update on error
            setScore((prev) => prev - scoreDelta);
            setUserVote(userVote);
            console.error('Vote error:', error);
        } finally {
            setIsVoting(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-1 group/vote">
            <button
                onClick={() => handleVote(1)}
                disabled={isVoting}
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${userVote === 1
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-blue-500 hover:text-white'
                    } disabled:opacity-50 active:scale-95`}
            >
                <ChevronUp className={cn("transition-transform", userVote === 1 && "scale-110")} />
            </button>
            <div className="text-sm font-black text-slate-900 dark:text-white my-1">{formatScore(score)}</div>
            <button
                onClick={() => handleVote(-1)}
                disabled={isVoting}
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${userVote === -1
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-red-500 hover:text-white'
                    } disabled:opacity-50 active:scale-95`}
            >
                <ChevronDown className={cn("transition-transform", userVote === -1 && "scale-110")} />
            </button>
        </div>
    );
}
