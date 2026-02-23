const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const data = require('./massive-data');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrate() {
    console.log("🚀 Starting Massive Migration...");

    // 1. Process Categories
    const categoryMap = {};
    for (const cat of data.categories) {
        console.log(`Processing category: ${cat.name}`);
        const { data: catData, error } = await supabase
            .from('categories')
            .upsert({
                name: cat.name,
                slug: cat.slug,
                description: cat.description
            }, { onConflict: 'slug' })
            .select('id, slug')
            .single();

        if (error) {
            console.error(`Error with category ${cat.name}:`, error);
        } else {
            categoryMap[catData.slug] = catData.id;
        }
    }

    // 2. Process Tools
    console.log(`🚀 Processing ${data.tools.length} Tools...`);
    for (const tool of data.tools) {
        const catId = categoryMap[tool.category] || categoryMap['saas-essentials']; // Fallback

        // Construct logo URL from website if not provided
        const domain = new URL(tool.website).hostname.replace('www.', '');
        const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

        console.log(`Processing tool: ${tool.name} (${tool.slug})`);
        const { error } = await supabase
            .from('items')
            .upsert({
                category_id: catId,
                name: tool.name,
                slug: tool.slug,
                description: tool.description || `${tool.name} is a leading solution in the ${tool.category} space.`,
                website_url: tool.website,
                logo_url: logoUrl,
                score: tool.score || 0,
                status: 'approved',
                featured: tool.featured || false,
                vote_count: Math.floor((tool.score || 0) / 4) // Simulate some votes
            }, { onConflict: 'slug' });

        if (error) {
            console.error(`Error with tool ${tool.name}:`, error);
        }
    }

    console.log("🏁 Migration Complete!");
}

migrate();
