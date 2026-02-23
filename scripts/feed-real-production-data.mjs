
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manual env parsing
const envPath = path.resolve(__dirname, '../.env.local');
let envConfig = {};

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            envConfig[key.trim()] = value.trim().replace(/"/g, '');
        }
    });
} catch (e) {
    console.error('Could not read .env.local:', e);
}

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envConfig.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials. check .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// --- Data Source ---

const CATEGORIES = [
    { name: "AI Writing Tools", slug: "ai-writing-tools", description: "Best AI-powered writing assistants for content, emails, and blogs." },
    { name: "AI Image Generators", slug: "ai-image-generators", description: "Top-rated AI tools for creating stunning visual art and photos." },
    { name: "AI Video Tools", slug: "ai-video-tools", description: "Professional AI tools for video editing, avatars, and generation." },
    { name: "AI Code Assistants", slug: "ai-code-assistants", description: "The best AI companions for developers and software engineers." },
    { name: "AI Chatbots", slug: "ai-chatbots", description: "Conversational AI models for research, productivity, and fun." },
    { name: "Cloud Hosting", slug: "cloud-hosting", description: "Top-rated web hosting, VPS, and cloud infrastructure providers." },
    { name: "eSIM for Travel", slug: "esim-providers", description: "Best digital SIM cards for international travelers and digital nomads." },
    { name: "SaaS Essentials", slug: "saas-essentials", description: "Critical business software, CRM, and project management tools." }
];

const TOOLS = [
    // Your massive list of tools here. I'll include 'massive-data.js' content directly.
    // Writing
    { name: "Jasper", slug: "jasper-ai", category: "ai-writing-tools", website: "https://jasper.ai", pricing_model: "Paid" },
    { name: "Grammarly", slug: "grammarly-go", category: "ai-writing-tools", website: "https://grammarly.com", pricing_model: "Freemium" },
    { name: "Copy.ai", slug: "copy-ai", category: "ai-writing-tools", website: "https://copy.ai", pricing_model: "Freemium" },
    { name: "Writesonic", slug: "writesonic", category: "ai-writing-tools", website: "https://writesonic.com", pricing_model: "Freemium" },
    { name: "Quillbot", slug: "quillbot", category: "ai-writing-tools", website: "https://quillbot.com", pricing_model: "Freemium" },
    { name: "Rytr", slug: "rytr", category: "ai-writing-tools", website: "https://rytr.me", pricing_model: "Freemium" },
    { name: "Anyword", slug: "anyword", category: "ai-writing-tools", website: "https://anyword.com", pricing_model: "Paid" },
    { name: "Wordtune", slug: "wordtune", category: "ai-writing-tools", website: "https://wordtune.com", pricing_model: "Freemium" },
    // Image
    { name: "Midjourney", slug: "midjourney", category: "ai-image-generators", website: "https://midjourney.com", pricing_model: "Paid" },
    { name: "DALL-E 3", slug: "dalle-3", category: "ai-image-generators", website: "https://openai.com/dalle-3", pricing_model: "Paid" },
    { name: "Stable Diffusion", slug: "stable-diffusion", category: "ai-image-generators", website: "https://stability.ai", pricing_model: "Open Source" },
    { name: "Leonardo.ai", slug: "leonardo-ai", category: "ai-image-generators", website: "https://leonardo.ai", pricing_model: "Freemium" },
    { name: "Adobe Firefly", slug: "adobe-firefly", category: "ai-image-generators", website: "https://firefly.adobe.com", pricing_model: "Freemium" },
    // Video
    { name: "Runway", slug: "runway-gen3", category: "ai-video-tools", website: "https://runwayml.com", pricing_model: "Freemium" },
    { name: "Pika", slug: "pika-labs", category: "ai-video-tools", website: "https://pika.art", pricing_model: "Freemium" },
    { name: "HeyGen", slug: "heygen", category: "ai-video-tools", website: "https://heygen.com", pricing_model: "Paid" },
    { name: "Synthesia", slug: "synthesia", category: "ai-video-tools", website: "https://synthesia.io", pricing_model: "Paid" },
    // Code
    { name: "GitHub Copilot", slug: "github-copilot", category: "ai-code-assistants", website: "https://github.com/features/copilot", pricing_model: "Paid" },
    { name: "Cursor", slug: "cursor", category: "ai-code-assistants", website: "https://cursor.com", pricing_model: "Freemium" },
    { name: "Tabnine", slug: "tabnine", category: "ai-code-assistants", website: "https://tabnine.com", pricing_model: "Freemium" },
    { name: "Codeium", slug: "codeium", category: "ai-code-assistants", website: "https://codeium.com", pricing_model: "Freemium" },
    // Chatbots
    { name: "ChatGPT", slug: "chatgpt", category: "ai-chatbots", website: "https://chat.openai.com", pricing_model: "Freemium" },
    { name: "Claude 3", slug: "claude-ai", category: "ai-chatbots", website: "https://claude.ai", pricing_model: "Freemium" },
    { name: "Perplexity AI", slug: "perplexity", category: "ai-chatbots", website: "https://perplexity.ai", pricing_model: "Freemium" },
    { name: "Google Gemini", slug: "gemini", category: "ai-chatbots", website: "https://gemini.google.com", pricing_model: "Freemium" },
    // Hosting
    { name: "Vercel", slug: "vercel", category: "cloud-hosting", website: "https://vercel.com", pricing_model: "Freemium" },
    { name: "AWS", slug: "aws", category: "cloud-hosting", website: "https://aws.amazon.com", pricing_model: "Paid" },
    { name: "Netlify", slug: "netlify", category: "cloud-hosting", website: "https://netlify.com", pricing_model: "Freemium" },
    { name: "DigitalOcean", slug: "digital-ocean", category: "cloud-hosting", website: "https://digitalocean.com", pricing_model: "Paid" },
    { name: "Railway", slug: "railway", category: "cloud-hosting", website: "https://railway.app", pricing_model: "Freemium" },
    // eSIM
    { name: "Airalo", slug: "airalo", category: "esim-providers", website: "https://airalo.com", pricing_model: "Paid" },
    { name: "Holafly", slug: "holafly", category: "esim-providers", website: "https://holafly.com", pricing_model: "Paid" },
    { name: "Nomad", slug: "nomad", category: "esim-providers", website: "https://getnomad.app", pricing_model: "Paid" },
    // SaaS
    { name: "Notion", slug: "notion", category: "saas-essentials", website: "https://notion.so", pricing_model: "Freemium" },
    { name: "Slack", slug: "slack", category: "saas-essentials", website: "https://slack.com", pricing_model: "Freemium" },
    { name: "Linear", slug: "linear", category: "saas-essentials", website: "https://linear.app", pricing_model: "Freemium" },
    { name: "Stripe", slug: "stripe", category: "saas-essentials", website: "https://stripe.com", pricing_model: "Paid" }
];

const REVIEW_PHRASES = [
    { text: "Absolutely essential for my workflow.", rating: [5] },
    { text: "Great tool, but the learning curve is steep.", rating: [4, 3] },
    { text: "Changed the way I work completely. Highly recommended!", rating: [5] },
    { text: "Solid performance, reasonable price.", rating: [4, 5] },
    { text: "I use this every day. Can't imagine working without it.", rating: [5] },
    { text: "Good features, but support could be better.", rating: [3, 4] },
    { text: "The potential is there, but it's still a bit buggy.", rating: [3] },
    { text: "Best in class for what it does.", rating: [5] },
    { text: "Saved me hours of work this week alone.", rating: [5] },
    { text: "Decent alternative to the market leader.", rating: [4] },
    { text: "I switched from a competitor and haven't looked back.", rating: [5] },
    { text: "Updates are frequent and meaningful.", rating: [5] },
    { text: "A bit expensive for individual users, but great for teams.", rating: [4] },
    { text: "Interface is clean and intuitive.", rating: [5, 4] },
    { text: "Does exactly what it says on the tin.", rating: [4, 5] }
];

function generateReview(itemName) {
    const template = REVIEW_PHRASES[Math.floor(Math.random() * REVIEW_PHRASES.length)];
    const rating = template.rating[Math.floor(Math.random() * template.rating.length)];
    return {
        rating,
        comment: template.text
    };
}

async function clearDatabase() {
    console.log('🧹 Clearing existing data...');
    // Delete in order to respect FK constraints
    await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('votes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('item_tags').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('articles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✨ Database cleared.');
}

async function seed() {
    await clearDatabase();

    const categoryMap = {}; // slug -> id

    console.log('📂 Seeding Categories...');
    for (const cat of CATEGORIES) {
        const { data, error } = await supabase.from('categories').insert(cat).select('id').single();
        if (error) {
            console.error(`Error inserting category ${cat.name}:`, error);
        } else {
            categoryMap[cat.slug] = data.id;
        }
    }

    console.log(`🛠️ Seeding ${TOOLS.length} Tools...`);

    for (const tool of TOOLS) {
        console.log(`Processing ${tool.name}...`);

        // 1. Insert Tool
        const { data: itemData, error: itemError } = await supabase.from('items').insert({
            name: tool.name,
            slug: tool.slug,
            category_id: categoryMap[tool.category],
            website_url: tool.website,
            description: `The standard-setting ${tool.category.replace(/-/g, ' ')} solution. Trusted by thousands of professionals worldwide.`,
            pricing_model: tool.pricing_model || 'Freemium',
            status: 'approved',
            featured: ["chatgpt", "midjourney", "github-copilot", "vercel", "notion"].includes(tool.slug),
            created_at: new Date().toISOString()
        }).select('id').single();

        if (itemError) {
            console.error(`Error inserting item ${tool.name}:`, itemError);
            continue;
        }

        const itemId = itemData.id;

        // 2. Generate Real Votes (Target: ~1100)
        // We'll insert in batches to avoid rate limits/timeouts
        const voteTarget = 1100 + Math.floor(Math.random() * 100); // 1100-1200 range
        console.log(`   -> Generating ${voteTarget} votes...`);

        const voteBatches = [];
        let currentVoteBatch = [];

        for (let i = 0; i < voteTarget; i++) {
            currentVoteBatch.push({
                item_id: itemId,
                session_id: `seed-voter-${Math.random().toString(36).substring(7)}`,
                value: 1, // Mostly upvotes for top tools
                created_at: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString() // Past 90 days
            });

            if (currentVoteBatch.length >= 100) {
                voteBatches.push(currentVoteBatch);
                currentVoteBatch = [];
            }
        }
        if (currentVoteBatch.length > 0) voteBatches.push(currentVoteBatch);

        // Execute Vote Batches
        for (const batch of voteBatches) {
            await supabase.from('votes').insert(batch);
        }

        // 3. Generate Real Reviews (Target: ~600)
        const reviewTarget = 600 + Math.floor(Math.random() * 50); // 600-650 range
        console.log(`   -> Generating ${reviewTarget} reviews...`);

        const reviewBatches = [];
        let currentReviewBatch = [];
        let totalRating = 0;

        for (let i = 0; i < reviewTarget; i++) {
            const { rating, comment } = generateReview(tool.name);
            totalRating += rating;

            currentReviewBatch.push({
                item_id: itemId,
                session_id: `seed-reviewer-${Math.random().toString(36).substring(7)}`,
                rating: rating,
                comment: comment,
                status: 'approved',
                created_at: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString()
            });

            if (currentReviewBatch.length >= 50) {
                reviewBatches.push(currentReviewBatch);
                currentReviewBatch = [];
            }
        }
        if (currentReviewBatch.length > 0) reviewBatches.push(currentReviewBatch);

        for (const batch of reviewBatches) {
            await supabase.from('reviews').insert(batch);
        }

        // 4. Update Item Aggregates
        // Calculate verified counts
        const avgRating = (totalRating / reviewTarget).toFixed(1);
        const score = (voteTarget * 5) + (reviewTarget * 10) + (totalRating * 2);

        await supabase.from('items').update({
            vote_count: voteTarget,
            review_count: reviewTarget,
            average_rating: parseFloat(avgRating),
            score: score
        }).eq('id', itemId);

        console.log(`   -> Done! Score: ${score}, Rating: ${avgRating}`);
    }

    console.log('✅ Seeding Complete!');
}

seed();
