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

    return [
        {
            url: baseUrl,
            lastModified: new Date().toISOString(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        ...categoryEntries,
    ];
}
