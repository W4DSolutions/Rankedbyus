import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query || query.length < 2) {
            return NextResponse.json({ results: [] });
        }

        const supabase = await createClient();

        // Search in items (name and description)
        // We use ilike for simple case-insensitive search
        // For better results, one could use Supabase full-text search if configured
        const { data: items, error } = await supabase
            .from('items')
            .select(`
                *,
                categories:category_id (name, slug),
                item_tags (
                    tags (*)
                )
            `)
            .eq('status', 'approved')
            .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
            .limit(10)
            .order('score', { ascending: false });

        if (error) {
            console.error('Search error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ results: items || [] });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
