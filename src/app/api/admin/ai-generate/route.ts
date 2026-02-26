import { NextRequest, NextResponse } from 'next/server';
import { generateToolDescription } from '@/lib/ai';
import { verifyAdmin } from '@/lib/auth-guards';

export async function POST(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
