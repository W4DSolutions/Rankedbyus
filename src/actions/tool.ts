'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { captureOrder } from '@/lib/paypal';
import { sendEmail } from '@/lib/email';
import { revalidatePath } from 'next/cache';

export interface SubmitToolInput {
    name: string;
    website_url: string;
    description?: string;
    category: string;
    logo_url?: string;
    submitter_email?: string;
    orderId: string;
}

export async function submitTool(input: SubmitToolInput) {
    try {
        const { name, website_url, description, category, orderId, submitter_email, logo_url } = input;

        // 1. Mandatory Fraud Check: Verify and Capture PayPal Order
        if (!orderId) {
            return { error: 'Payment is required', status: 402 };
        }

        let paymentDetail;
        try {
            paymentDetail = await captureOrder(orderId);
        } catch (error) {
            console.error('PayPal Verification Failure:', error);
            return { error: 'Payment verification failed', status: 402 };
        }

        if (paymentDetail.status !== 'COMPLETED') {
            return { error: 'Payment not completed', status: 402 };
        }

        const supabase = createAdminClient();

        // Validate required fields
        if (!name || !website_url || !category) {
            return { error: 'Missing required fields: name, website_url, category', status: 400 };
        }

        // Validate URL format
        try {
            new URL(website_url);
        } catch {
            return { error: 'Invalid Website URL', status: 400 };
        }

        // 3. Rate Limiting Check (Max 5 submissions per hour)
        const ONE_HOUR_AGO = new Date(Date.now() - 60 * 60 * 1000).toISOString();

        const authClient = await createClient();
        const { data: { user } } = await authClient.auth.getUser();

        let recentSubmissionsQuery = supabase
            .from('items')
            .select('id', { count: 'exact' })
            .gt('created_at', ONE_HOUR_AGO);

        if (user) {
            recentSubmissionsQuery = recentSubmissionsQuery.eq('user_id', user.id);
        } else if (submitter_email) {
            recentSubmissionsQuery = recentSubmissionsQuery.eq('submitter_email', submitter_email);
        }

        const { count: submissionCount, error: countError } = await recentSubmissionsQuery;

        if (countError) {
            console.error('Rate limit check error:', countError);
        } else if (submissionCount !== null && submissionCount >= 5) {
            return { error: 'Rate limit exceeded. You can only submit 5 tools per hour.', status: 429 };
        }

        // Find category ID
        const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .select('id, name')
            .eq('slug', category)
            .single();

        if (categoryError || !categoryData) {
            return { error: 'Invalid category', status: 400 };
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
            return { error: 'A tool with this name already exists', status: 409 };
        }

        // Get Session ID for tracking
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('rbu_session_id')?.value;

        // Insert item with pending status
        const finalSubmitterEmail = user?.email || submitter_email || null;
        const { data: newItem, error: insertError } = await supabase
            .from('items')
            .insert({
                category_id: categoryData.id,
                name,
                slug,
                description: description || '',
                website_url,
                affiliate_link: website_url,
                logo_url: logo_url || `https://placehold.co/80x80/334155/white?text=${name.charAt(0).toUpperCase()}`,
                status: 'pending',
                score: 0,
                vote_count: 0,
                user_id: user?.id || null,
                submitter_email: finalSubmitterEmail,
                transaction_id: paymentDetail.transactionId,
                payment_amount: parseFloat(paymentDetail.amount),
                payment_status: 'paid',
                session_id: sessionId || null
            })
            .select()
            .single();

        if (insertError) {
            console.error('Insert error:', insertError);
            return { error: 'Failed to submit tool', status: 500 };
        }

        // --- EMAIL NOTIFICATIONS ---
        if (finalSubmitterEmail) {
            await sendEmail({
                to: finalSubmitterEmail,
                subject: `Submission Received: ${name}`,
                template: 'submission_received',
                data: { itemName: name }
            });
        }

        const adminEmail = process.env.MANAGEMENT_EMAIL || 'admin@rankedbyus.com';
        await sendEmail({
            to: adminEmail,
            subject: `🚨 NEW PAID SUBMISSION: ${name}`,
            template: 'admin_new_submission',
            data: {
                itemName: name,
                category: categoryData.name,
                submitterEmail: finalSubmitterEmail || 'Anonymous'
            }
        });

        revalidatePath('/admin'); // Revalidate admin dashboard for new tools

        return {
            success: true,
            message: 'Tool submitted successfully! It will appear after admin approval.',
            item: newItem,
        };

    } catch (error) {
        console.error('Submit tool action error:', error);
        return { error: 'Internal server error', status: 500 };
    }
}

export async function updateTool(id: string, updates: Partial<{
    name: string;
    description: string;
    website_url: string;
    logo_url: string;
    pricing_model: string;
}>) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { error: "Unauthorized", status: 401 };
        }

        if (!id) {
            return { error: "Tool ID is required", status: 400 };
        }

        // Only allow updating if the user owns this tool
        const { data: existingTool, error: checkError } = await supabase
            .from("items")
            .select("id, user_id, status")
            .eq("id", id)
            .single();

        if (checkError || !existingTool) {
            return { error: "Tool not found", status: 404 };
        }

        if (existingTool.user_id !== user.id) {
            return { error: "Permission denied. You do not own this listing.", status: 403 };
        }

        // Update the tool
        const { data: updatedTool, error: updateError } = await supabase
            .from("items")
            .update({
                name: updates.name,
                description: updates.description,
                website_url: updates.website_url,
                logo_url: updates.logo_url,
                pricing_model: updates.pricing_model,
            })
            .eq("id", id)
            .select()
            .single();

        if (updateError) {
            console.error("Error updating tool:", updateError);
            return { error: "Failed to update tool.", status: 500 };
        }

        revalidatePath(`/tool/${updatedTool.slug}`);
        revalidatePath('/');

        return { success: true, tool: updatedTool };
    } catch (error) {
        console.error("Server error editing tool:", error);
        return { error: "Internal Server Error", status: 500 };
    }
}
