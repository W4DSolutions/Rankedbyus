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
        const { title, item_id, excerpt, content, author_name, is_published, published_at } = body;

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and Content are required' }, { status: 400 });
        }

        const supabase = createAdminClient();

        // Generate slug from title
        let slug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        // Ensure unique slug
        const { data: existing } = await supabase
            .from('articles')
            .select('id')
            .eq('slug', slug)
            .maybeSingle();

        if (existing) {
            slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
        }

        const { data: newArticle, error } = await supabase
            .from('articles')
            .insert({
                title,
                item_id: item_id || null,
                slug,
                excerpt: excerpt || '',
                content,
                author_name: author_name || 'RankedByUs Team',
                is_published: is_published !== undefined ? is_published : false,
                published_at: published_at || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select('*')
            .single();

        if (error) {
            console.error('Create article error:', error);
            return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
        }

        return NextResponse.json({ article: newArticle });

    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
