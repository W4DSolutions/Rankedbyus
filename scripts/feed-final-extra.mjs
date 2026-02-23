
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const bulkExtra = {
    'ai-writing-tools': [
        { name: 'Wordtune Plus', website_url: 'https://wordtune.com', description: 'AI writing assistant that helps you rewrite your thoughts.' },
        { name: 'ProWritingAid', website_url: 'https://prowritingaid.com', description: 'Grammar checker and manuscript editor for professional writers.' },
        { name: 'Outwrite', website_url: 'https://outwrite.com', description: 'Everything you need to write more clearly and concisely.' },
        { name: 'Scribbr', website_url: 'https://scribbr.com', description: 'Academic writing and proofreading tools powered by AI.' },
        { name: 'Writer Pro', website_url: 'https://writer.com', description: 'The generative AI platform for the enterprise.' }
    ],
    'ai-image-generators': [
        { name: 'Artbreeder V2', website_url: 'https://artbreeder.com', description: 'Next-gen collaborative tool for creating portraits and landscapes.' },
        { name: 'Deep Dream Generator', website_url: 'https://deepdreamgenerator.com', description: 'Create stunning images with the help of deep learning.' },
        { name: 'NightCafe Studio', website_url: 'https://nightcafe.studio', description: 'AI Art Generator. Create amazing AI art with the ease of text.' },
        { name: 'Fotor AI Art', website_url: 'https://fotor.com', description: 'Experience the magic of AI photo editing and generation.' },
        { name: 'DeepAI Image', website_url: 'https://deepai.org', description: 'Artificial Intelligence tools for naturally creative people.' }
    ],
    'ai-video-tools': [
        { name: 'Wondershare Virbo', website_url: 'https://virbo.wondershare.com', description: 'Generate professional AI avatar videos from text.' },
        { name: 'DeepBrain AI Video', website_url: 'https://deepbrain.io', description: 'Create realistic AI videos with photo-realistic avatars.' },
        { name: 'Colossyan Creator', website_url: 'https://colossyan.com', description: 'Create professional videos from text in minutes.' },
        { name: 'Synthesia Studio', website_url: 'https://synthesia.io', description: 'The worlds #1 AI Video Generator.' },
        { name: 'Pipio', website_url: 'https://pipio.ai', description: 'Create professional AI spokesperson videos.' }
    ],
    'ai-code-assistants': [
        { name: 'Codacy', website_url: 'https://codacy.com', description: 'The coding superpower for development teams.' },
        { name: 'Snyk Code', website_url: 'https://snyk.io', description: 'Developer-first security that helps you build secure code.' },
        { name: 'DeepCode', website_url: 'https://snyk.io/deepcode', description: 'Next-generation AI semantic code analysis.' },
        { name: 'Ghostwriter (Replit)', website_url: 'https://replit.com/ai', description: 'The primary AI assistant for the Replit IDE.' },
        { name: 'JetBrains AI Assistant', website_url: 'https://jetbrains.com/ai', description: 'AI assistant integrated directly into JetBrains IDEs.' }
    ],
    'ai-chatbots': [
        { name: 'Phind Developer', website_url: 'https://phind.com', description: 'The AI search engine for developers.' },
        { name: 'Metaphor Systems', website_url: 'https://metaphor.systems', description: 'Building the next generation of search with LLMs.' },
        { name: 'Andi Search', website_url: 'https://andisearch.com', description: 'The smart search engine that uses generative AI.' },
        { name: 'Poe Fast', website_url: 'https://poe.com', description: 'Fast, AI-powered chat across multiple models.' },
        { name: 'Grok Beta', website_url: 'https://x.ai', description: 'Advanced AI assistant with real-time world knowledge via X.' }
    ],
    'cloud-hosting': [
        { name: 'Hetzner Cloud', website_url: 'https://hetzner.com/cloud', description: 'Professional cloud hosting with German precision and top efficiency.' },
        { name: 'Linode (Akamai)', website_url: 'https://linode.com', description: 'Reliable cloud hosting from the Akamai delivery network.' },
        { name: 'OVHcloud Public', website_url: 'https://ovhcloud.com', description: 'Open and powerful cloud computing solutions.' },
        { name: 'Vultr Bare Metal', website_url: 'https://vultr.com', description: 'Dedicated physical servers without the overhead.' },
        { name: 'DigitalOcean Premium', website_url: 'https://digitalocean.com', description: 'Simple cloud computing for developers and startups.' }
    ],
    'esim-providers': [
        { name: 'Ubigi Global', website_url: 'https://ubigi.com', description: 'High-quality cellular connectivity for your device.' },
        { name: 'GigSky Travel', website_url: 'https://gigsky.com', description: 'Seamless mobile data everywhere you go.' },
        { name: 'Simly eSIM', website_url: 'https://simly.io', description: 'Simple and affordable international data.' },
        { name: 'Airhub Marketplace', website_url: 'https://airhubapp.com', description: 'A unified portal for global eSIM travel data.' },
        { name: 'Oomly', website_url: 'https://oomly.com', description: 'Travel the world with eSIM and stay connected.' }
    ],
    'saas-essentials': [
        { name: 'ClickUp 3.0', website_url: 'https://clickup.com', description: 'The all-in-one productivity platform for the future of work.' },
        { name: 'Monday Sales CRM', website_url: 'https://monday.com/crm', description: 'Manage your sales pipeline and close deals faster.' },
        { name: 'Asana Premium', website_url: 'https://asana.com', description: 'Work management for high-achieving teams.' },
        { name: 'Miro Board', website_url: 'https://miro.com', description: 'The visual collaboration platform for every team.' },
        { name: 'Pitch', website_url: 'https://pitch.com', description: 'The new standard for modern presentation software.' }
    ]
};

async function run() {
    const { data: categories } = await supabase.from('categories').select('id, slug');
    for (const slug in bulkExtra) {
        const cat = categories.find(c => c.slug === slug);
        if (!cat) continue;
        for (const tool of bulkExtra[slug]) {
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
            console.log(`Added ${tool.name}`);
        }
    }
}
run();
