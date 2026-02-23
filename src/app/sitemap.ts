import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://rankedbyus.com').replace(/\/$/, '');

    // 1. Fetch all approved categories
    const { data: categories } = await supabase
        .from('categories')
        .select('id, slug, created_at');

    const categoryMap = new Map((categories || []).map(c => [c.id, c.slug]));

    const categoryEntries: MetadataRoute.Sitemap = (categories || []).map((category: { slug: string; created_at: string }) => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: category.created_at || new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    // 2. Fetch all approved items
    const { data: items } = await supabase
        .from('items')
        .select('id, slug, created_at, category_id, pricing_model')
        .eq('status', 'approved');

    const itemEntries: MetadataRoute.Sitemap = (items || []).map((item: any) => ({
        url: `${baseUrl}/tool/${item.slug}`,
        lastModified: item.created_at || new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    // 3. Smart Generation for "Best X for Y" and "Free X" pages
    // We only want to generate pages that actually have content.

    // 3a. Find categories that have FREE items
    const freeCategoryIds = new Set<string>();
    (items || []).forEach((item: any) => {
        if (item.pricing_model === 'Free' && item.category_id) {
            freeCategoryIds.add(item.category_id);
        }
    });

    const bestFreeEntries: MetadataRoute.Sitemap = [];
    freeCategoryIds.forEach(catId => {
        const slug = categoryMap.get(catId);
        if (slug) {
            bestFreeEntries.push({
                url: `${baseUrl}/best/free-${slug}`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            });
        }
    });

    // 3b. Find valid Category + Tag combinations (including "Best [Cat] for [Tag]" and "/category/[Cat]/[Tag]")
    const { data: itemTags } = await supabase
        .from('item_tags')
        .select(`
            tag_id,
            tags!inner (slug),
            items!inner (category_id, status)
        `)
        .eq('items.status', 'approved');

    const validCatTagCombos = new Set<string>();

    (itemTags || []).forEach((it: any) => {
        const catId = it.items?.category_id;
        const tagSlug = it.tags?.slug;

        if (catId && tagSlug && categoryMap.has(catId)) {
            const catSlug = categoryMap.get(catId);
            validCatTagCombos.add(`${catSlug}|${tagSlug}`);
        }
    });

    const comboEntries: MetadataRoute.Sitemap = [];
    validCatTagCombos.forEach(combo => {
        const [catSlug, tagSlug] = combo.split('|');

        // /category/[cat]/[tag]
        comboEntries.push({
            url: `${baseUrl}/category/${catSlug}/${tagSlug}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        });

        // /best/[cat]-for-[tag]
        comboEntries.push({
            url: `${baseUrl}/best/${catSlug}-for-${tagSlug}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        });
    });

    // 4. Comparison Pages
    const compareEntries: MetadataRoute.Sitemap = (items || []).map((item: any) => ({
        url: `${baseUrl}/compare/${item.slug}-vs-leader`,
        lastModified: item.created_at || new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
    }));

    // 5. Articles
    const { data: articles } = await supabase
        .from('articles')
        .select('slug, updated_at, published_at')
        .eq('is_published', true)
        .lte('published_at', new Date().toISOString());

    const articleEntries: MetadataRoute.Sitemap = (articles || []).map((article: any) => ({
        url: `${baseUrl}/article/${article.slug}`,
        lastModified: article.updated_at || article.published_at || new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date().toISOString(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly' as const,
            priority: 0.5,
        },
        ...categoryEntries,
        ...itemEntries,
        ...bestFreeEntries,
        ...comboEntries,
        ...compareEntries,
        ...articleEntries,
    ];
}
