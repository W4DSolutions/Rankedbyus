import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateArticleContent } from '@/lib/ai';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Simple auth check
        const { data: { user } } = await supabase.auth.getUser();
        // Add admin verification here if needed

        const body = await request.json();
        const { topic, linkedToolName } = body;

        if (!topic) {
            return NextResponse.json({ error: 'Missing topic' }, { status: 400 });
        }

        const aiData = await generateArticleContent(topic, linkedToolName);

        return NextResponse.json({
            success: true,
            data: aiData
        });

    } catch (error: any) {
        console.error('AI Article Route Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate AI article' },
            { status: 500 }
        );
    }
}
