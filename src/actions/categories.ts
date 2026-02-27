'use server';

import { createClient } from '@/lib/supabase/server';

export async function getCategories() {
    try {
        const supabase = await createClient();

        const { data: categories, error } = await supabase
            .from('categories')
            .select('id, name, slug, description')
            .order('name', { ascending: true });

        if (error) {
            console.error('Categories fetch error:', error);
            return { categories: [], error: 'Failed to fetch categories' };
        }

        return { categories: categories || [] };

    } catch (error) {
        console.error('Categories action error:', error);
        return { categories: [], error: 'Internal server error' };
    }
}
