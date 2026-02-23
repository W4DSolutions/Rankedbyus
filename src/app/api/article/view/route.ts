
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const { articleId } = await request.json();

        if (!articleId) {
            return NextResponse.json({ error: 'Missing articleId' }, { status: 400 });
        }

        const supabase = createAdminClient();
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('rbu_session_id')?.value;

        // Fire and forget - tracking shouldn't block UI
        // We do this server-side to keep the admin key secure
        await Promise.all([
            // 1. Increment numeric counter on article
            supabase.rpc('increment_article_view', { article_row_id: articleId }),

            // 2. Log detailed view event
            supabase.from('article_views').insert({
                article_id: articleId,
                session_id: sessionId,
                // created_at is automatic
            })
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking view:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
