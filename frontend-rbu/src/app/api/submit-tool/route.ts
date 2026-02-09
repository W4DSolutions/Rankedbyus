import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { name, website_url, description, category } = body;

        // Validate required fields
        if (!name || !website_url || !category) {
            return NextResponse.json(
                { error: 'Missing required fields: name, website_url, category' },
                { status: 400 }
            );
        }

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

        // Insert item with pending status
        // @ts-ignore - Supabase type inference issue
        const { data: newItem, error: insertError } = await supabase
            .from('items')
            .insert({
                // @ts-expect-error - Supabase types not generated
                category_id: categoryData.id,
                name,
                slug,
                description: description || '',
                website_url,
                affiliate_link: website_url,
                logo_url: `https://placehold.co/80x80/334155/white?text=${name.charAt(0).toUpperCase()}`,
                status: 'pending' as any,
                score: 0,
                vote_count: 0,
            } as any)
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
