'use client';

import { useState } from 'react';
import { getOrCreateSessionId } from '@/lib/session';
import { formatScore } from '@/lib/formatters';

interface VoteButtonsProps {
    itemId: string;
    initialScore: number;
    initialVoteCount: number;
}

export function VoteButtons({ itemId, initialScore, initialVoteCount }: VoteButtonsProps) {
    const [score, setScore] = useState(initialScore);
    const [voteCount, setVoteCount] = useState(initialVoteCount);
    const [userVote, setUserVote] = useState<1 | -1 | null>(null);
    const [isVoting, setIsVoting] = useState(false);

    const handleVote = async (value: 1 | -1) => {
        if (isVoting) return;

        // Get session ID
        const sessionId = getOrCreateSessionId();

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
                    'X-Session-Id': sessionId,
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
        <div className="flex flex-col items-center gap-1">
            <button
                onClick={() => handleVote(1)}
                disabled={isVoting}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${userVote === 1
                    ? 'bg-green-500 text-white'
                    : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                    } disabled:opacity-50`}
            >
                ▲
            </button>
            <div className="text-sm font-semibold text-white">{score}</div>
            <button
                onClick={() => handleVote(-1)}
                disabled={isVoting}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${userVote === -1
                    ? 'bg-red-500 text-white'
                    : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                    } disabled:opacity-50`}
            >
                ▼
            </button>
        </div>
    );
}
