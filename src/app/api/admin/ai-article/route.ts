import { NextRequest, NextResponse } from 'next/server';
import { generateArticleContent } from '@/lib/ai';
import { verifyAdmin } from '@/lib/auth-guards';

export async function POST(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
