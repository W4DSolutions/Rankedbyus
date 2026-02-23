import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id, name, description, website_url, logo_url, pricing_model } = body;

        if (!id) {
            return NextResponse.json({ error: "Tool ID is required" }, { status: 400 });
        }

        // Only allow updating if the user owns this tool
        const { data: existingTool, error: checkError } = await supabase
            .from("items")
            .select("id, user_id, status")
            .eq("id", id)
            .single();

        if (checkError || !existingTool) {
            return NextResponse.json({ error: "Tool not found" }, { status: 404 });
        }

        if (existingTool.user_id !== user.id) {
            return NextResponse.json({ error: "Permission denied. You do not own this listing." }, { status: 403 });
        }

        // Update the tool
        const { data: updatedTool, error: updateError } = await supabase
            .from("items")
            .update({
                name: name !== undefined ? name : undefined,
                description: description !== undefined ? description : undefined,
                website_url: website_url !== undefined ? website_url : undefined,
                logo_url: logo_url !== undefined ? logo_url : undefined,
                pricing_model: pricing_model !== undefined ? pricing_model : undefined,
                // Optional: require re-review if they edit a core field? 
                // status: existingTool.status === 'approved' ? 'pending' : existingTool.status
            })
            .eq("id", id)
            .select()
            .single();

        if (updateError) {
            console.error("Error updating tool:", updateError);
            return NextResponse.json({ error: "Failed to update tool." }, { status: 500 });
        }

        return NextResponse.json({ success: true, tool: updatedTool }, { status: 200 });
    } catch (error) {
        console.error("Server error editing tool:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
