
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const moreTools = {
    'saas-essentials': [
        { name: 'Airtable', website_url: 'https://airtable.com', description: 'The platform to build next-gen apps. Business apps that combine the power of a database with the familiarity of a spreadsheet.' },
        { name: 'Monday.com', website_url: 'https://monday.com', description: 'A platform that allows teams to build custom work management software.' },
        { name: 'Asana', website_url: 'https://asana.com', description: 'Keep your team organized and on track with the easiest way to manage projects.' },
        { name: 'Trello', website_url: 'https://trello.com', description: 'Collaborate, manage projects, and reach new productivity peaks.' },
        { name: 'ClickUp', website_url: 'https://clickup.com', description: 'The all-in-one productivity platform for teams.' },
        { name: 'Intercom', website_url: 'https://intercom.com', description: 'The AI-first Customer Service Platform.' },
        { name: 'Loom', website_url: 'https://loom.com', description: 'Video messaging for work.' }
    ],
    'ai-chatbots': [
        { name: 'Poe', website_url: 'https://poe.com', description: 'Fast, AI-powered chat with multiple models.' },
        { name: 'ChatPDF', website_url: 'https://chatpdf.com', description: 'The easiest way to chat with any PDF.' }
    ]
};

async function feed() {
    const { data: categories } = await supabase.from('categories').select('id, slug');
    for (const slug in moreTools) {
        const cat = categories.find(c => c.slug === slug);
        if (!cat) continue;
        for (const tool of moreTools[slug]) {
            const toolSlug = tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const { data: exists } = await supabase.from('items').select('id').eq('slug', toolSlug).maybeSingle();
            if (exists) continue;

            await supabase.from('items').insert({
                ...tool,
                category_id: cat.id,
                slug: toolSlug,
                status: 'approved',
                vote_count: Math.floor(Math.random() * 30),
                score: Math.floor(Math.random() * 50),
                created_at: new Date().toISOString()
            });
            console.log(`Added ${tool.name}`);
        }
    }
}
feed();
