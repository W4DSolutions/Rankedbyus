'use server';

import { createClient } from '@/lib/supabase/server';

export async function searchTools(query: string, limit: number = 10) {
    try {
        const supabase = await createClient();

        if (!query || query.length < 2) {
            // Return top tools if no query
            const { data: popular } = await supabase
                .from('items')
                .select(`
                    *,
                    categories:category_id (name, slug),
                    item_tags (
                        tags (*)
                    )
                `)
                .eq('status', 'approved')
                .limit(limit)
                .order('score', { ascending: false });

            return { results: popular || [] };
        }

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
            .limit(limit)
            .order('score', { ascending: false });

        if (error) {
            console.error('Search action error:', error);
            return { results: [], error: error.message };
        }

        return { results: items || [] };
    } catch (error) {
        console.error('Search action panic:', error);
        return { results: [], error: 'Internal server error' };
    }
}
