
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const toolsToFeed = {
    'ai-writing-tools': [
        { name: 'Lex', website_url: 'https://lex.page', description: 'A modern word processor that helps you write faster with AI.' },
        { name: 'Type', website_url: 'https://type.ai', description: 'An AI-first document editor for professional writers.' },
        { name: 'Bearly', website_url: 'https://bearly.ai', description: 'AI writing and reading assistant for Chrome and Desktop.' },
        { name: 'Hemingway Editor', website_url: 'https://hemingwayapp.com', description: 'Make your writing bold and clear.' },
        { name: 'HyperWrite', website_url: 'https://hyperwriteai.com', description: 'Your personal AI writing assistant.' },
        { name: 'QuillBot Flow', website_url: 'https://quillbot.com/flow', description: 'All-in-one AI writing assistant for students and professionals.' },
        { name: 'Frase.io', website_url: 'https://frase.io', description: 'AI writing and SEO content tool.' }
    ],
    'ai-image-generators': [
        { name: 'Ideogram', website_url: 'https://ideogram.ai', description: 'Advanced AI image generation with a focus on typography and logos.' },
        { name: 'Recraft', website_url: 'https://recraft.ai', description: 'Generative AI for designers, focused on vector art and icons.' },
        { name: 'Magnific AI', website_url: 'https://magnific.ai', description: 'High-end AI image upscaler and enhancer.' },
        { name: 'Krea AI', website_url: 'https://krea.ai', description: 'Real-time AI creative tool for image generation and enhancement.' },
        { name: 'GetIMG', website_url: 'https://getimg.ai', description: 'Everything you need to create images with AI in one place.' },
        { name: 'SeaArt AI', website_url: 'https://seaart.ai', description: 'Powerful AI art generator for complex creative tasks.' }
    ],
    'ai-video-tools': [
        { name: 'Kling AI', website_url: 'https://klingai.com', description: 'State-of-the-art video generation model.' },
        { name: 'Luma Dream Machine', website_url: 'https://lumalabs.ai/dream-machine', description: 'Next-generation AI video generation from text and images.' },
        { name: 'HeyGen', website_url: 'https://heygen.com', description: 'Create high-quality AI avatars and videos.' },
        { name: 'Runway Gen-3', website_url: 'https://runwayml.com', description: 'Professional grade video generation tools.' },
        { name: 'Veed.io', website_url: 'https://veed.io', description: 'Everything you need to create and edit videos using AI.' },
        { name: 'Sora (Research)', website_url: 'https://openai.com/sora', description: 'Upcoming text-to-video model by OpenAI.' }
    ],
    'ai-code-assistants': [
        { name: 'Supermaven', website_url: 'https://supermaven.com', description: 'The fastest AI code completion with 1M token context.' },
        { name: 'Anysphere', website_url: 'https://cursor.com', description: 'The makers of Cursor, building the future of coding.' },
        { name: 'Bito AI', website_url: 'https://bito.ai', description: 'AI assistant for software developers.' },
        { name: 'TabbyML', website_url: 'https://tabbyml.com', description: 'Self-hosted AI coding assistant.' },
        { name: 'Void Editor', website_url: 'https://voideditor.com', description: 'Open-source AI alternative to Cursor.' }
    ],
    'ai-chatbots': [
        { name: 'Groq Cloud', website_url: 'https://groq.com', description: 'Ultra-fast LPU inference for AI applications.' },
        { name: 'Together AI', website_url: 'https://together.ai', description: 'Platform for open-source AI models.' },
        { name: 'OpenRouter', website_url: 'https://openrouter.ai', description: 'A unified API for all major AI models.' },
        { name: 'Mistral AI', website_url: 'https://mistral.ai', description: 'High-performance open weights models.' },
        { name: 'Cohere', website_url: 'https://cohere.com', description: 'Enterprise AI and LLM platform.' },
        { name: 'X.AI Grok', website_url: 'https://x.ai', description: 'Advanced AI assistant integrated with X platform.' }
    ],
    'esim-providers': [
        { name: 'Airalo', website_url: 'https://airalo.com', description: 'The world\'s first eSIM store for global travelers.' },
        { name: 'Holafly', website_url: 'https://holafly.com', description: 'Unlimited data eSIMs for international travel.' },
        { name: 'Nomad', website_url: 'https://getnomad.app', description: 'Local and regional data plans in 100+ countries.' },
        { name: 'Yesim', website_url: 'https://yesim.app', description: 'Global travel eSIM with data plans everywhere.' },
        { name: 'MobiMatter', website_url: 'https://mobimatter.com', description: 'Compare and buy the best eSIM deals.' }
    ]
};

async function feedTools() {
    const { data: categories } = await supabase.from('categories').select('id, slug');

    for (const slug in toolsToFeed) {
        const category = categories.find(c => c.slug === slug);
        if (!category) {
            console.log(`Category ${slug} not found, skipping.`);
            continue;
        }

        console.log(`Feeding ${slug}...`);
        for (const tool of toolsToFeed[slug]) {
            // Generate slug
            const toolSlug = tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            // Check if exists
            const { data: existing } = await supabase
                .from('items')
                .select('id')
                .eq('slug', toolSlug)
                .maybeSingle();

            if (existing) {
                console.log(`Tool ${tool.name} already exists, skipping.`);
                continue;
            }

            const { error } = await supabase.from('items').insert({
                ...tool,
                category_id: category.id,
                slug: toolSlug,
                status: 'approved',
                vote_count: Math.floor(Math.random() * 50) + 10,
                score: Math.floor(Math.random() * 100) + 50,
                average_rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                review_count: Math.floor(Math.random() * 10) + 2,
                click_count: Math.floor(Math.random() * 200) + 50,
                created_at: new Date().toISOString(),
                affiliate_link: tool.website_url,
                featured: false
            });

            if (error) {
                console.error(`Error adding ${tool.name}:`, error.message);
            } else {
                console.log(`Added ${tool.name}`);
            }
        }
    }
}

feedTools();
