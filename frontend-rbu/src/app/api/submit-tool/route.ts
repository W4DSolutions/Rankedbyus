import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const supabase = createAdminClient();
        const body = await request.json() as {
            name: string;
            website_url: string;
            description?: string;
            category: string;
            logo_url?: string;
            submitter_email?: string;
            // Payment info
            transaction_id?: string;
            payment_amount?: number;
            payment_status?: string;
        };
        const { name, website_url, description, category } = body;

        // Validate required fields
        if (!name || !website_url || !category) {
            return NextResponse.json(
                { error: 'Missing required fields: name, website_url, category' },
                { status: 400 }
            );
        }

        // Validate URL format
        try {
            new URL(website_url);
        } catch {
            return NextResponse.json({ error: 'Invalid Website URL' }, { status: 400 });
        }

        // TODO: Implement Rate Limiting (e.g. 5 submissions per hour per IP)

        // Find category ID
        const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', category)
            .single();

        if (categoryError || !categoryData) {
            return NextResponse.json(
                { error: 'Invalid category' },
                { status: 400 }
            );
        }

        // Generate slug from name
        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        // Check if slug already exists
        const { data: existingItem } = await supabase
            .from('items')
            .select('id')
            .eq('slug', slug)
            .single();

        if (existingItem) {
            return NextResponse.json(
                { error: 'A tool with this name already exists' },
                { status: 409 }
            );
        }

        // Get authenticated user if available
        const authClient = await createClient();
        const { data: { user } } = await authClient.auth.getUser();

        // Get Session ID for tracking
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('rbu_session_id')?.value;

        // Insert item with pending status
        const { data: newItem, error: insertError } = await supabase
            .from('items')
            .insert({
                category_id: categoryData.id,
                name,
                slug,
                description: description || '',
                website_url,
                affiliate_link: website_url,
                logo_url: body.logo_url || `https://placehold.co/80x80/334155/white?text=${name.charAt(0).toUpperCase()}`,
                status: 'pending',
                score: 0,
                vote_count: 0,
                user_id: user?.id || null, // Link to authenticated user
                submitter_email: user?.email || body.submitter_email || null, // Auto-fill email if logged in
                // Payment fields
                transaction_id: body.transaction_id || null,
                payment_amount: body.payment_amount || 0.00,
                payment_status: body.payment_status || 'unpaid',
            })
            .select()
            .single();

        if (insertError) {
            console.error('Insert error:', insertError);
            return NextResponse.json(
                { error: 'Failed to submit tool' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Tool submitted successfully! It will appear after admin approval.',
            item: newItem,
        });

    } catch (error) {
        console.error('Submit tool error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
