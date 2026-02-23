import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { captureOrder } from '@/lib/paypal';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as {
            name: string;
            website_url: string;
            description?: string;
            category: string;
            logo_url?: string;
            submitter_email?: string;
            orderId?: string; // Expecting orderId from client to capture on server
        };

        const { name, website_url, description, category, orderId } = body;

        // 1. Mandatory Fraud Check: Verify and Capture PayPal Order
        if (!orderId) {
            return NextResponse.json({ error: 'Payment is required' }, { status: 402 });
        }

        let paymentDetail;
        try {
            paymentDetail = await captureOrder(orderId);
        } catch (error) {
            console.error('PayPal Verification Failure:', error);
            return NextResponse.json({ error: 'Payment verification failed' }, { status: 402 });
        }

        if (paymentDetail.status !== 'COMPLETED') {
            return NextResponse.json({ error: 'Payment not completed' }, { status: 402 });
        }

        const supabase = createAdminClient();

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

        // 3. Rate Limiting Check (Max 5 submissions per hour)
        const ONE_HOUR_AGO = new Date(Date.now() - 60 * 60 * 1000).toISOString();

        // Get authenticated user if available
        const authClient = await createClient();
        const { data: { user } } = await authClient.auth.getUser();

        let recentSubmissionsQuery = supabase
            .from('items')
            .select('id', { count: 'exact' })
            .gt('created_at', ONE_HOUR_AGO);

        if (user) {
            recentSubmissionsQuery = recentSubmissionsQuery.eq('user_id', user.id);
        } else if (body.submitter_email) {
            recentSubmissionsQuery = recentSubmissionsQuery.eq('submitter_email', body.submitter_email);
        } else {
            // If No user and no email, we can't reliably rate limit by ID, 
            // but we could use IP in a real production environment with Redis.
        }

        const { count: submissionCount, error: countError } = await recentSubmissionsQuery;

        if (countError) {
            console.error('Rate limit check error:', countError);
        } else if (submissionCount !== null && submissionCount >= 5) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. You can only submit 5 tools per hour.' },
                { status: 429 }
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
                // VERIFIED Payment fields
                transaction_id: paymentDetail.transactionId,
                payment_amount: parseFloat(paymentDetail.amount),
                payment_status: 'paid', // Hardcoding as paid because verification passed
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
