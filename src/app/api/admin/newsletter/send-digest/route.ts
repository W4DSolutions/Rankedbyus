import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email';
import { verifyAdmin } from '@/lib/auth-guards';

export async function POST(request: NextRequest) {
    // Auth Guard
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    try {
        // 1. Fetch Top 5 Tools (Trending - most votes or highest score)
        const { data: topTools, error: toolError } = await supabase
            .from('items')
            .select('id, name, slug, description, score')
            .eq('status', 'approved')
            .order('score', { ascending: false })
            .limit(5);

        if (toolError) throw toolError;

        // 2. Fetch Latest Article
        const { data: latestArticle, error: articleError } = await supabase
            .from('articles')
            .select('title, slug, excerpt')
            .eq('is_published', true)
            .order('published_at', { ascending: false })
            .limit(1)
            .single();

        // 3. Fetch All Active Subscribers
        const { data: subscribers, error: subError } = await supabase
            .from('newsletter_subscribers')
            .select('email')
            .eq('status', 'active');

        if (subError) throw subError;

        if (!subscribers || subscribers.length === 0) {
            return NextResponse.json({ success: true, message: 'No active subscribers found.' });
        }

        // 4. Dispatch Emails (Batch or Loop)
        // Note: For large lists (1000+), use a dedicated bulk mailing service feature.
        // For early MVP, looping with Resend is sufficient.

        const emailPromises = subscribers.map(sub =>
            sendEmail({
                to: sub.email,
                subject: '📊 The Weekly Signal: Top AI Tools & Intelligence',
                template: 'weekly_digest',
                data: {
                    topTools,
                    latestArticle
                }
            })
        );

        await Promise.all(emailPromises);

        return NextResponse.json({
            success: true,
            message: `Newsletter dispatched to ${subscribers.length} agents.`,
            stats: {
                toolsIncluded: topTools.length,
                hasArticle: !!latestArticle
            }
        });

    } catch (error: any) {
        console.error('Newsletter Dispatch Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
