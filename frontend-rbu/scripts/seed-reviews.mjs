
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const starterReviews = [
    { item_slug: 'chatgpt', rating: 5, comment: 'ChatGPT is my daily co-pilot for brainstorming and drafting. The GPT-4o model is exceptionally fast and versatile.' },
    { item_slug: 'cursor', rating: 5, comment: 'Hands down the best AI code editor. The codebase indexing feature makes it feel like the AI actually understands my project.' },
    { item_slug: 'midjourney', rating: 5, comment: 'Unmatched artistic quality. Version 6 changed everything for my design workflow. Absolute powerhouse.' },
    { item_slug: 'claude-3', rating: 5, comment: 'The reasoning capabilities of Opus area breath of fresh air. It feels much more human and less robotic than other LLMs.' },
    { item_slug: 'perplexity-ai', rating: 5, comment: 'I haven\'t used a traditional search engine in months. The citations and real-time info are essential.' },
    { item_slug: 'linear', rating: 5, comment: 'The speed and keyboard shortcuts make project management actually enjoyable. It is beautiful and efficient.' },
    { item_slug: 'stripe', rating: 5, comment: 'Integration was seamless. The developer experience is the gold standard for APIs.' },
    { item_slug: 'netlify', rating: 4, comment: 'Extremely reliable hosting with a great free tier. The deploy previews are a lifesaver for our team.' }
];

async function seedReviews() {
    console.log('Fetching items...');
    const { data: items } = await supabase.from('items').select('id, slug, name');

    if (!items) {
        console.error('No items found in database.');
        return;
    }

    console.log(`Seeding ${starterReviews.length} reviews...`);

    for (const review of starterReviews) {
        const item = items.find(i => i.slug === review.item_slug);

        if (item) {
            const { error } = await supabase.from('reviews').insert({
                item_id: item.id,
                session_id: 'seed-auditor-' + Math.floor(Math.random() * 1000),
                rating: review.rating,
                comment: review.comment,
                status: 'approved',
                created_at: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).toISOString() // Random date in last 7 days
            });

            if (error) {
                console.error(`Error adding review for ${item.name}:`, error.message);
            } else {
                console.log(`Added review for ${item.name}`);
            }
        } else {
            console.log(`Item with slug ${review.item_slug} not found, skipping.`);
        }
    }
}

seedReviews();
