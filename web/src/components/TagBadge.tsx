'use client';

import { cn } from "@/lib/utils";

interface TagBadgeProps {
    name: string;
    slug: string;
    color?: string | null;
    className?: string;
    onClick?: () => void;
}

export function TagBadge({ name, slug, color, className, onClick }: TagBadgeProps) {
    const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors cursor-default";

    // Default blue-ish style
    const defaultStyles = "bg-blue-500/10 text-blue-400 border border-blue-500/20";

    // In the future we can map slug to specific colors
    const colorMapper: Record<string, string> = {
        'free': 'bg-green-500/10 text-green-400 border border-green-500/20',
        'freemium': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        'paid': 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
        'enterprise': 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
        'new': 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
    };

    const appliedStyles = colorMapper[slug] || defaultStyles;

    return (
        <span
            className={cn(baseStyles, appliedStyles, onClick && "cursor-pointer hover:bg-opacity-20", className)}
            onClick={onClick}
        >
            {name}
        </span>
    );
}
