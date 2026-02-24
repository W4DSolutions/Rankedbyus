import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { displayName } = await request.json();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!displayName || displayName.trim().length < 2) {
            return NextResponse.json({ error: 'Display name must be at least 2 characters' }, { status: 400 });
        }

        const { error } = await supabase.auth.updateUser({
            data: { full_name: displayName.trim() }
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, displayName: displayName.trim() });
    } catch (error: any) {
        console.error('Profile Update API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
