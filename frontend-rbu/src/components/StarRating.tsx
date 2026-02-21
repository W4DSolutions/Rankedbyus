'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
    className?: string;
}

export function StarRating({
    rating,
    maxRating = 5,
    size = 'md',
    interactive = false,
    onRatingChange,
    className
}: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const sizes = {
        xs: 10,
        sm: 12,
        md: 20,
        lg: 32
    };

    return (
        <div className={cn("flex items-center gap-1", className)}>
            {[...Array(maxRating)].map((_, i) => {
                const starValue = i + 1;
                const isActive = hoverRating !== null ? starValue <= hoverRating : starValue <= Math.round(rating);

                return (
                    <button
                        key={i}
                        type="button"
                        disabled={!interactive}
                        onClick={() => interactive && onRatingChange?.(starValue)}
                        onMouseEnter={() => interactive && setHoverRating(starValue)}
                        onMouseLeave={() => interactive && setHoverRating(null)}
                        className={cn(
                            "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-full p-1",
                            interactive ? "hover:scale-110 cursor-pointer" : "cursor-default"
                        )}
                        aria-label={`Rate ${starValue} out of ${maxRating}`}
                        aria-pressed={isActive}
                    >
                        <Star
                            size={sizes[size]}
                            className={cn(
                                "transition-all duration-300",
                                isActive
                                    ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
                                    : "text-slate-200 dark:text-slate-700 fill-transparent"
                            )}
                            aria-hidden="true"
                        />
                    </button>
                );
            })}
            {rating > 0 && !interactive && (
                <span className={cn(
                    "ml-2 font-black text-slate-900 dark:text-white",
                    size === 'sm' ? "text-[10px]" : "text-sm"
                )}>
                    {(rating || 0).toFixed(1)}
                </span>
            )}
        </div>
    );
}
