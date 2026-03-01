import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

import { verifyAdmin } from '@/lib/auth-guards';

export async function POST(request: NextRequest) {
    // Auth Guard
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    try {
        const { itemId } = await request.json();

        if (!itemId) {
            return NextResponse.json({ error: 'Missing itemId' }, { status: 400 });
        }

        // Fetch tool data
        const { data: tool, error: fetchError } = await supabase
            .from('items')
            .select('*')
            .eq('id', itemId)
            .single();

        if (fetchError || !tool) throw new Error('Tool not found');

        // 2. AI GENERATION
        const { generateToolDescription } = await import('@/lib/ai');
        const { data: categoryData } = await supabase
            .from('categories')
            .select('name')
            .eq('id', tool.category_id)
            .single();

        const aiData = await generateToolDescription(
            tool.name,
            tool.website_url,
            categoryData?.name || 'General AI'
        );

        const strategicHook = aiData.description;

        // 3. UPDATE TOOL
        const { error: updateError } = await supabase
            .from('items')
            .update({
                description: strategicHook,
            })
            .eq('id', itemId);

        if (updateError) throw updateError;

        // 4. TAGGING
        if (aiData.tags && aiData.tags.length > 0) {
            const { slugify } = await import('@/lib/utils');

            for (const tagName of aiData.tags) {
                const tagSlug = slugify(tagName);

                // 1. Find or create tag
                const { data: tag, error: tagError } = await supabase
                    .from('tags')
                    .select('id')
                    .eq('slug', tagSlug)
                    .maybeSingle();

                let tagId;
                if (!tag) {
                    const { data: newTag, error: createTagError } = await supabase
                        .from('tags')
                        .insert({ name: tagName, slug: tagSlug })
                        .select('id')
                        .single();

                    if (!createTagError && newTag) {
                        tagId = newTag.id;
                    }
                } else {
                    tagId = tag.id;
                }

                // 2. Link tag to item
                if (tagId) {
                    await supabase
                        .from('item_tags')
                        .upsert({ item_id: itemId, tag_id: tagId }, { onConflict: 'item_id,tag_id' });
                }
            }
        }

        return NextResponse.json({
            success: true,
            enhancedDescription: strategicHook,
            tags: aiData.tags
        });
    } catch (error: any) {
        console.error('AI Enrichment error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
