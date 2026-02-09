import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://rankedbyus.com').replace(/\/$/, '');

    // Fetch all approved categories
    const { data: categories } = await supabase
        .from('categories')
        .select('slug, created_at');

    const categoryEntries: MetadataRoute.Sitemap = (categories || []).map((category: any) => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: category.created_at || new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    // Fetch all approved items
    const { data: items } = await supabase
        .from('items')
        .select('slug, created_at')
        .eq('status', 'approved');

    const itemEntries: MetadataRoute.Sitemap = (items || []).map((item: any) => ({
        url: `${baseUrl}/tool/${item.slug}`,
        lastModified: item.created_at || new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date().toISOString(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        ...categoryEntries,
        ...itemEntries,
    ];
}
