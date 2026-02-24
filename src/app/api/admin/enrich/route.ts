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

        // REAL AI LOGIC with Gemini
        const { generateToolDescription } = await import('@/lib/ai');
        const { data: category } = await supabase
            .from('categories')
            .select('name')
            .eq('id', tool.category_id)
            .single();

        const aiData = await generateToolDescription(
            tool.name,
            tool.website_url,
            category?.name || 'General AI'
        );

        const strategicHook = aiData.description;

        // Update tool with AI-enhanced data
        const { error: updateError } = await supabase
            .from('items')
            .update({
                description: strategicHook,
            })
            .eq('id', itemId);

        if (updateError) throw updateError;

        // Auto-assign Tags if they exist
        if (aiData.tags && aiData.tags.length > 0) {
            // First clear existing tags for this item if needed, 
            // or just insert new ones (ignoring duplicates)
            for (const tagName of aiData.tags) {
                // Simplified tag insertion logic
                // In a robust system, you'd find/create tag then link in item_tags
                // For now, we'll just focus on the description success
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
