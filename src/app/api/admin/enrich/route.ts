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

        // SIMULATED AI LOGIC
        // In a production environment, you would call OpenAI/Gemini here
        // to analyze the description and website_url.

        const tags = ['Elite Performance', 'Enterprise Grade', 'AI-First'];
        const strategicHook = tool.description?.includes('AI')
            ? `Strategically engineered AI-native platform designed for ${tool.name} high-tier operational scale.`
            : `Professional-grade infrastructure optimized for ${tool.name} mission-critical workflows.`;

        // Update tool with AI-enhanced data
        const { error: updateError } = await supabase
            .from('items')
            .update({
                description: strategicHook,
                // We could also auto-assign tags here in item_tags
            })
            .eq('id', itemId);

        if (updateError) throw updateError;

        return NextResponse.json({
            success: true,
            enhancedDescription: strategicHook
        });
    } catch (error: any) {
        console.error('AI Enrichment error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
