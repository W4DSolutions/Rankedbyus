import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
        }

        const supabase = await createClient();

        const { error } = await (supabase
            .from('newsletter_subscribers') as any)
            .insert([{ email, source: 'homepage' }]);

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'You are already in the elite rank!' }, { status: 400 });
            }
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Newsletter Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
