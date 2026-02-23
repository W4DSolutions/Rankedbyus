'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
    name: string;
    slug: string;
    color?: string | null;
    className?: string;
    onClick?: () => void;
    href?: string;
}

export function TagBadge({ name, slug, className, onClick, href }: TagBadgeProps) {
    const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-black uppercase tracking-widest transition-all cursor-default";

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

    const content = (
        <span
            className={cn(baseStyles, appliedStyles, (onClick || href) && "cursor-pointer hover:bg-opacity-20", className)}
            onClick={onClick}
        >
            {name}
        </span>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
}
