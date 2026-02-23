
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const travelTools = [
    { name: 'Airalo (Global)', website_url: 'https://airalo.com', description: 'Stay connected, wherever you travel, at affordable rates.' },
    { name: 'Instabridge', website_url: 'https://instabridge.com', description: 'Free WiFi and affordable data plans via eSIM.' },
    { name: 'Simly', website_url: 'https://simly.io', description: 'The simplest way to get an eSIM for your next trip.' },
    { name: 'eSIM Plus', website_url: 'https://esimplus.me', description: 'Virtual numbers and eSIM data plans for global travel.' },
    { name: 'VoyE', website_url: 'https://voye.global', description: 'Reliable and affordable global connectivity.' },
    { name: 'Keepgo', website_url: 'https://keepgo.com', description: 'Lifetime prepaid data eSIM for global travelers.' }
];

const cloudTools = [
    { name: 'Kinsta', website_url: 'https://kinsta.com', description: 'Premium managed WordPress, application, and database hosting.' },
    { name: 'WP Engine', website_url: 'https://wpengine.com', description: 'The world\'s most trusted WordPress technology company.' },
    { name: 'A2 Hosting', website_url: 'https://a2hosting.com', description: 'High speed shared and managed hosting solutions.' },
    { name: 'InMotion Hosting', website_url: 'https://inmotionhosting.com', description: 'Premium web hosting and customer support.' },
    { name: 'DreamHost', website_url: 'https://dreamhost.com', description: 'Award-winning web hosting and domain names.' }
];

async function run() {
    const { data: categories } = await supabase.from('categories').select('id, slug');

    const feed = async (tools, slug) => {
        const cat = categories.find(c => c.slug === slug);
        if (!cat) return;
        for (const tool of tools) {
            const toolSlug = tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const { data: exists } = await supabase.from('items').select('id').eq('slug', toolSlug).maybeSingle();
            if (exists) continue;
            await supabase.from('items').insert({
                ...tool,
                category_id: cat.id,
                slug: toolSlug,
                status: 'approved',
                vote_count: Math.floor(Math.random() * 30),
                score: Math.floor(Math.random() * 60),
                created_at: new Date().toISOString(),
                affiliate_link: tool.website_url,
                featured: false
            });
            console.log(`Added ${tool.name} to ${slug}`);
        }
    };

    await feed(travelTools, 'esim-providers');
    await feed(cloudTools, 'cloud-hosting');
}

run();
