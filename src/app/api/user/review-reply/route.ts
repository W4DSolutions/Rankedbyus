import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { reviewId, reply } = body;

        if (!reviewId || !reply) {
            return NextResponse.json({ error: "Review ID and reply are required" }, { status: 400 });
        }

        // 1. Get the review and check the item ownership
        const { data: review, error: reviewError } = await supabase
            .from("reviews")
            .select(`
                id,
                item_id,
                items (user_id, submitter_email)
            `)
            .eq("id", reviewId)
            .single();

        if (reviewError || !review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        // 2. Verify ownership (user_id or email)
        const item = review.items as any;
        const isOwner = item?.user_id === user.id || item?.submitter_email === user.email;

        if (!isOwner) {
            return NextResponse.json({ error: "Permission denied. You do not own the asset this review is for." }, { status: 403 });
        }

        // 3. Update the review with the founder's reply
        const { error: updateError } = await supabase
            .from("reviews")
            .update({
                owner_reply: reply,
                owner_reply_at: new Date().toISOString()
            })
            .eq("id", reviewId);

        if (updateError) {
            console.error("Error updating review reply:", updateError);
            return NextResponse.json({ error: "Failed to save reply." }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Server error replying to review:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
