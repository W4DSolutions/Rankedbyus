import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdmin } from '@/lib/auth-guards';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const isAdmin = await verifyAdmin();

    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const supabase = createAdminClient();

        const { data: updatedArticle, error } = await supabase
            .from('articles')
            .update({
                ...body,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select('*')
            .single();

        if (error) {
            console.error('Update article error:', error);
            return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
        }

        return NextResponse.json({ article: updatedArticle });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const isAdmin = await verifyAdmin();

    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const supabase = createAdminClient();
        const { error } = await supabase
            .from('articles')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete article error:', error);
            return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
