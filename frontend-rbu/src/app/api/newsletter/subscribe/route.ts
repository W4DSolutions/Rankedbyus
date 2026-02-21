import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body as { email: string };

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
        }

        const supabase = await createClient();

        // Using a single transaction for efficiency
        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert({
                email,
                source: 'homepage',
                status: 'active'
            } as any); // Still as any because types aren't generated, but cleaner object

        if (error) {
            console.error('Supabase Newsletter Error:', error);
            if (error.code === '23505') {
                return NextResponse.json({ error: 'You are already in the elite rank!' }, { status: 400 });
            }
            return NextResponse.json({ error: 'Signal transmission failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Welcome to the grid.' });
    } catch (error) {
        console.error('Newsletter Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
