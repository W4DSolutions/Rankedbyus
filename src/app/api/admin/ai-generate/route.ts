import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateToolDescription } from '@/lib/ai';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check admin session (simple check for now, assuming middleware handles basic auth)
        const { data: { user } } = await supabase.auth.getUser();

        // Add your admin verification logic here
        // if (!user || user.email !== 'admin@rankedbyus.com') ...

        const body = await request.json();
        const { name, url, category } = body;

        if (!name || !url) {
            return NextResponse.json({ error: 'Missing name or url' }, { status: 400 });
        }

        const aiData = await generateToolDescription(name, url, category || 'AI Tool');

        return NextResponse.json({
            success: true,
            data: aiData
        });

    } catch (error: any) {
        console.error('AI Generate Route Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate AI content' },
            { status: 500 }
        );
    }
}
