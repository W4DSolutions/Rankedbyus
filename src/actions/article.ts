'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';

export async function trackArticleView(articleId: string) {
    try {
        if (!articleId) {
            return { error: 'Missing articleId', status: 400 };
        }

        const supabase = createAdminClient();
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('rbu_session_id')?.value;

        // Fire and forget - tracking shouldn't block UI
        await Promise.all([
            // 1. Increment numeric counter on article
            supabase.rpc('increment_article_view', { article_row_id: articleId }),

            // 2. Log detailed view event
            supabase.from('article_views').insert({
                article_id: articleId,
                session_id: sessionId,
            })
        ]);

        return { success: true };
    } catch (error) {
        console.error('Error tracking view action:', error);
        return { error: 'Internal Server Error', status: 500 };
    }
}
