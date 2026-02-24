import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const supabase = createAdminClient();

    // Get session ID (consistent with voting/reviews)
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('rbu_session_id')?.value;

    // Fetch the tool
    const { data: item, error } = await supabase
        .from('items')
        .select('id, website_url, affiliate_link, click_count')
        .eq('slug', slug)
        .single();

    if (error || !item) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Tracking (fire and forget)
    const { optimizeLink } = await import('@/lib/affiliate');
    const targetUrl = item.affiliate_link || optimizeLink(item.website_url) || '/';

    // Increment click count and log click with enhanced telemetry
    await Promise.all([
        supabase.rpc('increment_click_count', { item_row_id: item.id }),
        supabase.from('clicks').insert({
            item_id: item.id,
            session_id: sessionId,
            referrer: request.headers.get('referer') || 'direct',
            user_agent: request.headers.get('user-agent'),
            path: request.nextUrl.pathname,
            utm_source: request.nextUrl.searchParams.get('utm_source') || 'RankedByUs'
        })
    ]);

    // Redirect to target
    return NextResponse.redirect(new URL(targetUrl));
}
