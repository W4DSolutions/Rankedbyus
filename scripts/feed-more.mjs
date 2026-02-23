
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const travelTools = [
    { name: 'Saily', website_url: 'https://saily.com', description: 'Global eSIM service from the makers of NordVPN.' },
    { name: 'BetterRoaming', website_url: 'https://betterroaming.com', description: 'Affordable international data roaming with eSIM.' },
    { name: 'AloSIM', website_url: 'https://alosim.com', description: 'International eSIM cards for travel data.' },
    { name: 'Ubigi', website_url: 'https://ubigi.com', description: 'Global cellular connectivity with high-quality eSIM.' },
    { name: 'GigSky', website_url: 'https://gigsky.com', description: 'World-class coverage in 190+ countries.' },
    { name: 'GlobaleSIM', website_url: 'https://globalesim.app', description: 'Cheap travel eSIM for USA, Europe and more.' },
    { name: 'SimOptions', website_url: 'https://simoptions.com', description: 'The best marketplace for international eSIMs.' },
    { name: 'Airhub', website_url: 'https://airhubapp.com', description: 'Global eSIM marketplace for tourists.' }
];

const extraSaaS = [
    { name: 'HubSpot', website_url: 'https://hubspot.com', description: 'CRM platform with all the software, integrations, and resources you need to grow your business.' },
    { name: 'Salesforce', website_url: 'https://salesforce.com', description: 'The world\'s #1 customer relationship management (CRM) platform.' },
    { name: 'Stripe', website_url: 'https://stripe.com', description: 'Financial infrastructure for the internet.' },
    { name: 'Calendly', website_url: 'https://calendly.com', description: 'Easy scheduling for you and your team.' },
    { name: 'Intercom (AI)', website_url: 'https://intercom.com', description: 'The first AI-first customer service platform.' },
    { name: 'Gong', website_url: 'https://gong.io', description: 'Revenue intelligence platform for sales teams.' },
    { name: 'Deel', website_url: 'https://deel.com', description: 'The global compliance and payroll platform.' }
];

const extraCloud = [
    { name: 'Vultr', website_url: 'https://vultr.com', description: 'Cloud compute and storage across 32 global locations.' },
    { name: 'Cloudways', website_url: 'https://cloudways.com', description: 'Managed cloud hosting platform for growing businesses.' },
    { name: 'Heroku', website_url: 'https://heroku.com', description: 'PaaS that enables developers to build, run, and operate applications entirely in the cloud.' },
    { name: 'Fly.io', website_url: 'https://fly.io', description: 'Global application platform to run your code close to your users.' },
    { name: 'Railway.app', website_url: 'https://railway.app', description: 'Deploy your apps with zero configuration.' },
    { name: 'Render.com', website_url: 'https://render.com', description: 'The fastest way to host your apps and websites.' }
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
                vote_count: Math.floor(Math.random() * 20),
                score: Math.floor(Math.random() * 40),
                created_at: new Date().toISOString(),
                affiliate_link: tool.website_url,
                featured: false
            });
            console.log(`Added ${tool.name} to ${slug}`);
        }
    };

    await feed(travelTools, 'esim-providers');
    await feed(extraSaaS, 'saas-essentials');
    await feed(extraCloud, 'cloud-hosting');
}

run();
