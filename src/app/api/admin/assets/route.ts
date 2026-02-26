import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdmin } from '@/lib/auth-guards';

export async function POST(request: NextRequest) {
    const isAdmin = await verifyAdmin();

    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, category_id, website_url, description, pricing_model, affiliate_link } = body;

        if (!name || !category_id || !website_url) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabase = createAdminClient();

        // Check if category exists
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id, name, slug')
            .eq('id', category_id)
            .single();

        if (catError || !category) {
            return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
        }

        // Generate slug
        let slug = name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        // Ensure unique slug
        const { data: existing } = await supabase
            .from('items')
            .select('id')
            .eq('slug', slug)
            .maybeSingle();

        if (existing) {
            slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
        }

        // Insert new approved asset
        const { data: newItem, error } = await supabase
            .from('items')
            .insert({
                name,
                category_id,
                slug,
                website_url,
                description: description || '',
                pricing_model: pricing_model || 'Freemium',
                affiliate_link: affiliate_link || website_url,
                status: 'approved',
                logo_url: body.logo_url || null, // Will be handled by client/ToolIcon if null
                featured: false,
                vote_count: 0,
                score: 0,
                click_count: 0,
                review_count: 0,
                average_rating: 0,
                is_verified: body.is_verified || false,
                is_sponsored: body.is_sponsored || false,
                sponsored_until: body.sponsored_until || null,
                created_at: new Date().toISOString()
            })
            .select(`
                *,
                categories:category_id (name, slug)
            `)
            .single();

        if (error) {
            console.error('Create asset error:', error);
            return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
        }

        return NextResponse.json({ asset: newItem });

    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
