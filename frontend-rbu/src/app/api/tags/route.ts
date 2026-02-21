import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: tags, error } = await supabase
            .from('tags')
            .select('*')
            .order('name');

        if (error) throw error;

        return NextResponse.json({ tags });
    } catch (error) {
        console.error('Error fetching tags:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
