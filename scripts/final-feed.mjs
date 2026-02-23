
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const finalTools = {
    'ai-image-generators': [
        { name: 'Photoroom', website_url: 'https://photoroom.com', description: 'Remove backgrounds and create professional product photos.' },
        { name: 'Leonardo AI', website_url: 'https://leonardo.ai', description: 'Generate production-quality assets for your creative projects.' },
        { name: 'Flair AI', website_url: 'https://flair.ai', description: 'The AI design tool for branded content.' },
        { name: 'Stockimg AI', website_url: 'https://stockimg.ai', description: 'Generate high quality stock photos, logos, and more.' },
        { name: 'Looka', website_url: 'https://looka.com', description: 'Design a logo and build a brand you love with AI.' },
        { name: 'Brandmark', website_url: 'https://brandmark.io', description: 'Create a unique, professional logo for your business.' },
        { name: 'Khroma', website_url: 'https://khroma.co', description: 'The AI color tool for designers.' },
        { name: 'Artbreeder', website_url: 'https://artbreeder.com', description: 'Collaborative AI tool for creating portraits and landscapes.' },
        { name: 'Wonder AI', website_url: 'https://wonder.ai', description: 'Turn words into mesmerizing digital artworks.' }
    ],
    'ai-video-tools': [
        { name: 'InVideo', website_url: 'https://invideo.io', description: 'The fastest way to create professional videos online.' },
        { name: 'Sora', website_url: 'https://openai.com/sora', description: 'Create realistic and imaginative scenes from text instructions.' },
        { name: 'Kaiber', website_url: 'https://kaiber.ai', description: 'An AI creative lab made by artists, for artists.' },
        { name: 'D-ID', website_url: 'https://d-id.com', description: 'Create and interact with talking avatars at the click of a button.' },
        { name: 'Veed', website_url: 'https://veed.io', description: 'Everything you need to create and edit videos using AI.' },
        { name: 'Synthesia', website_url: 'https://synthesia.io', description: 'Clear and concise professional videos without the cameras.' },
        { name: 'Elai', website_url: 'https://elai.io', description: 'Create AI videos from text in minutes.' },
        { name: 'Hour One', website_url: 'https://hourone.ai', description: 'Professional AI video generator for training and marketing.' },
        { name: 'Tavus', website_url: 'https://tavus.io', description: 'Scale personalized video outreach automatically.' },
        { name: 'Captions AI', website_url: 'https://captions.ai', description: 'AI-powered video editor for social media creators.' }
    ],
    'ai-code-assistants': [
        { name: 'Sourcegraph Cody', website_url: 'https://sourcegraph.com/cody', description: 'AI coding assistant that understands your entire codebase.' },
        { name: 'Blackbox AI', website_url: 'https://blackbox.ai', description: 'The best AI code assistant for fast development.' },
        { name: 'MutableAI', website_url: 'https://mutable.ai', description: 'Build production quality code with AI.' },
        { name: 'Pieces', website_url: 'https://pieces.app', description: 'Save, enrich, and reuse code snippets with AI.' },
        { name: 'Codiga', website_url: 'https://codiga.io', description: 'Smart code analysis and automated code reviews.' },
        { name: 'Codeium', website_url: 'https://codeium.com', description: 'The modern coding superpower with ultra-fast autocomplete.' },
        { name: 'Amazon Q Developer', website_url: 'https://aws.amazon.com/q/developer', description: 'Generative AI-powered assistant for the software development lifecycle.' },
        { name: 'GitKraken AI', website_url: 'https://gitkraken.com', description: 'AI-enhanced Git experiences for developers.' },
        { name: 'Codenvy', website_url: 'https://codenvy.com', description: 'Cloud-based development workspaces and AI assistance.' },
        { name: 'Continue dev', website_url: 'https://continue.dev', description: 'The open-source autopilot for VS Code and JetBrains.' }
    ],
    'ai-chatbots': [
        { name: 'You.com', website_url: 'https://you.com', description: 'The AI search engine you control.' },
        { name: 'Monica AI', website_url: 'https://monica.im', description: 'Your all-in-one AI assistant chrome extension.' },
        { name: 'Sider AI', website_url: 'https://sider.ai', description: 'Your AI sidekick for reading and writing on any website.' },
        { name: 'Merlin AI', website_url: 'https://getmerlin.in', description: '1-click access to ChatGPT on any website.' },
        { name: 'HuggingChat', website_url: 'https://huggingface.co/chat', description: 'Open source chat interface powered by Hugging Face.' },
        { name: 'Inflection Pi', website_url: 'https://pi.ai', description: 'A supportive and empathetic personal AI.' },
        { name: 'Character.ai', website_url: 'https://character.ai', description: 'Personalized AI characters for chat and creativity.' },
        { name: 'ChatPDF Plus', website_url: 'https://chatpdf.com', description: 'Power search and interactive chat for your documents.' },
        { name: 'AskUI', website_url: 'https://askui.com', description: 'AI-driven UI automation and chat.' }
    ],
    'esim-providers': [
        { name: 'Nomad Global', website_url: 'https://getnomad.app', description: 'Stay connected with local and international data plans.' },
        { name: 'SimOptions Global', website_url: 'https://simoptions.com', description: 'Prepaid eSIM for international travelers everywhere.' },
        { name: 'Better Roaming', website_url: 'https://betterroaming.com', description: 'Global connectivity simplified for the modern traveler.' },
        { name: 'Maya Mobile', website_url: 'https://maya.net', description: 'Unlimited mobile data with travel eSIM technology.' },
        { name: 'BNESIM', website_url: 'https://bnesim.com', description: 'Award winning global connectivity and communication.' },
        { name: 'MobiMatter Plus', website_url: 'https://mobimatter.com', description: 'Premium marketplace for travel eSIM deals.' },
        { name: 'GlobaleSIM App', website_url: 'https://globalesim.app', description: 'The easiest way to get an eSIM for your destination.' }
    ],
    'saas-essentials': [
        { name: 'Framer', website_url: 'https://framer.com', description: 'Start your next site with AI and build it in minutes.' },
        { name: 'Webflow', website_url: 'https://webflow.com', description: 'Build professional, custom websites in a completely visual canvas.' },
        { name: 'Zapier', website_url: 'https://zapier.com', description: 'Automation that moves you forward.' },
        { name: 'Make.com', website_url: 'https://make.com', description: 'The tool to build and automate anything in one click.' },
        { name: 'Linear App', website_url: 'https://linear.app', description: 'The issue tracker you will actually like using.' },
        { name: 'Notion Plus', website_url: 'https://notion.so', description: 'Connected workspace for your docs, tasks, and projects.' },
        { name: 'Slack Pro', website_url: 'https://slack.com', description: 'The collaboration hub that brings people together.' },
        { name: 'Zoom AI', website_url: 'https://zoom.us', description: 'AI-powered video conferencing and collaboration.' }
    ]
};

async function run() {
    const { data: categories } = await supabase.from('categories').select('id, slug');

    for (const slug in finalTools) {
        const cat = categories.find(c => c.slug === slug);
        if (!cat) continue;

        console.log(`Feeding ${slug}...`);
        for (const tool of finalTools[slug]) {
            const toolSlug = tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            const { data: existing } = await supabase
                .from('items')
                .select('id')
                .eq('slug', toolSlug)
                .maybeSingle();

            if (existing) continue;

            const { error } = await supabase.from('items').insert({
                ...tool,
                category_id: cat.id,
                slug: toolSlug,
                status: 'approved',
                vote_count: Math.floor(Math.random() * 40) + 10,
                score: Math.floor(Math.random() * 80) + 20,
                average_rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                review_count: Math.floor(Math.random() * 15) + 3,
                click_count: Math.floor(Math.random() * 300) + 100,
                created_at: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
                affiliate_link: tool.website_url,
                featured: Math.random() > 0.8
            });

            if (error) {
                console.error(`Error adding ${tool.name}:`, error.message);
            } else {
                console.log(`Added ${tool.name}`);
            }
        }
    }
}

run();
