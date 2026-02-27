'use client';

import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { formatScore } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

import { submitVote, getUserVote } from '@/actions/vote';

interface VoteButtonsProps {
    itemId: string;
    initialScore: number;
    initialVoteCount?: number;
    onVoteChange?: (newScore: number, newCount: number) => void;
}

export function VoteButtons({ itemId, initialScore, initialVoteCount = 0, onVoteChange }: VoteButtonsProps) {
    const router = useRouter();
    const [score, setScore] = useState(initialScore);
    const [voteCount, setVoteCount] = useState(initialVoteCount);
    const [userVote, setUserVote] = useState<1 | -1 | null>(null);
    const [isVoting, setIsVoting] = useState(false);

    // Sync state with props during render phase to avoid cascading renders
    const [prevInitial, setPrevInitial] = useState({ score: initialScore, count: initialVoteCount });
    if (initialScore !== prevInitial.score || initialVoteCount !== prevInitial.count) {
        setPrevInitial({ score: initialScore, count: initialVoteCount });

        // ONLY update score/count if we are NOT currently in the middle of a vote
        // This prevents stale props from a router.refresh() from overwriting our verified state
        if (!isVoting) {
            setScore(initialScore);
            setVoteCount(initialVoteCount);
        }
    }

    useEffect(() => {
        const fetchUserStatus = async () => {
            try {
                const data = await getUserVote(itemId);
                setUserVote(data.user_vote as 1 | -1 | null);
            } catch (error) {
                console.error('Error fetching user vote:', error);
            }
        };

        fetchUserStatus();
    }, [itemId]);

    const handleVote = async (value: 1 | -1) => {
        if (isVoting) return;

        // Force auth for voting (Client-side check)
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
        const countDelta = wasVoted ? -1 : (userVote ? 0 : 1);

        const optimisticScore = score + scoreDelta;
        const optimisticCount = voteCount + countDelta;

        setScore(optimisticScore);
        setVoteCount(optimisticCount);
        onVoteChange?.(optimisticScore, optimisticCount);
        setUserVote(newVote);
        setIsVoting(true);

        try {
            const result = await submitVote({
                item_id: itemId,
                value: newVote as 1 | -1 | null,
            });

            if ('error' in result) {
                throw new Error(result.error);
            }

            // Update with actual server truth
            if (result.success && result.new_score !== undefined) {
                setScore(result.new_score);
                setVoteCount(result.vote_count || optimisticCount);
                // Propagate to parent IMMEDIATELY
                onVoteChange?.(result.new_score, result.vote_count || optimisticCount);
            }

            router.refresh();
        } catch (error: any) {
            // Revert
            setScore(score);
            setVoteCount(voteCount);
            setUserVote(userVote);
            onVoteChange?.(score, voteCount);
            alert(`Signal Failure: ${error.message || 'The registry could not ingest your vote.'}`);
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
