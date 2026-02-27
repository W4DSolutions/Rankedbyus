
'use client';

import { useEffect, useRef } from 'react';

import { trackArticleView } from '@/actions/article';

export function ViewTracker({ articleId }: { articleId: string }) {
    const tracked = useRef(false);

    useEffect(() => {
        if (tracked.current) return;

        const trackView = async () => {
            try {
                await trackArticleView(articleId);
            } catch (err) {
                // Silently fail for tracking errors
                console.error('Failed to track view', err);
            }
        };

        trackView();
        tracked.current = true;
    }, [articleId]);

    return null; // Invisible component
}
