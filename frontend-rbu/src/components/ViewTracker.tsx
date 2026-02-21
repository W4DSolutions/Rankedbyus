
'use client';

import { useEffect, useRef } from 'react';

export function ViewTracker({ articleId }: { articleId: string }) {
    const tracked = useRef(false);

    useEffect(() => {
        if (tracked.current) return;

        const trackView = async () => {
            try {
                await fetch('/api/article/view', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ articleId }),
                });
            } catch (err) {
                // Silently fail for tracking errors
                console.error('Failed to diverse view count', err);
            }
        };

        trackView();
        tracked.current = true;
    }, [articleId]);

    return null; // Invisible component
}
