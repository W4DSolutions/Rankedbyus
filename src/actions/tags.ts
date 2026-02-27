'use server';

import { createClient } from '@/lib/supabase/server';

export async function getTags() {
    try {
        const supabase = await createClient();
        const { data: tags, error } = await supabase
            .from('tags')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching tags:', error);
            return { tags: [], error: 'Failed to fetch tags' };
        }

        return { tags: tags || [] };
    } catch (error) {
        console.error('Tags action error:', error);
        return { tags: [], error: 'Internal Server Error' };
    }
}
