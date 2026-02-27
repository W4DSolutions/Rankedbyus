'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function subscribeToNewsletter(email: string, source: string = 'homepage') {
    try {
        if (!email || !email.includes('@')) {
            return { error: 'Valid email required', status: 400 };
        }

        const supabase = await createClient();
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('rbu_session_id')?.value;

        // Using a single transaction for efficiency
        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert({
                email,
                source,
                status: 'active',
                session_id: sessionId || null
            } as any);

        if (error) {
            console.error('Supabase Newsletter Error:', error);
            if (error.code === '23505') {
                return { error: 'You are already in the elite rank!', status: 400 };
            }
            return { error: 'Signal transmission failed', status: 500 };
        }

        return { success: true, message: 'Welcome to the grid.' };
    } catch (error) {
        console.error('Newsletter action error:', error);
        return { error: 'Internal server error', status: 500 };
    }
}
