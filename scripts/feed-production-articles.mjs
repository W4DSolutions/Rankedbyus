
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

const ARTICLES = [
    {
        item_slug: 'vercel',
        title: 'Why Vercel is the Uncontested King of Frontend Deployment in 2026',
        slug: 'vercel-deep-dive-2026',
        excerpt: 'An in-depth analysis of Vercel\'s infrastructure, edge network, and why it remains the top choice for React developers.',
        content: `In the rapidly evolving landscape of web development, staying at the top requires more than just good performance—it requires a seamless developer experience (DX). Vercel has mastered this art.

## The Edge Case

Vercel's edge network isn't just about speed; it's about intelligence. With the release of Next.js 16, the integration between the framework and the platform has reached a point of synergy that competitors struggle to match.

### Key Performance Indicators
- **Cold Start Velocity**: <10ms for Edge Functions
- **Global Propagation**: Under 3 seconds
- **Rollback Safety**: Immediate state restoration

## Why Startups Choose Vercel

Startups need to ship fast without breaking things. Vercel's Preview Deployments are the gold standard for collaborative development. Every branch gets a URL, every team member gets a voice.

### Strategic Alignment
If you are building with React, Next.js, or Svelte, Vercel is not just a hosting provider—it's a performance multiplicator.`,
        is_published: true,
        author_name: 'Alex Rivers'
    },
    {
        item_slug: 'airalo',
        title: 'Airalo Review: Is It Still the Best eSIM for Global Travelers?',
        slug: 'airalo-honest-review-2026',
        excerpt: 'We tested Airalo across 15 countries to see if their connectivity and pricing still hold up against new rivals like Nomad.',
        content: `Roaming charges used to be the worst part of international travel. Airalo changed that narrative years ago. But in 2026, with the market flooded with eSIM providers, does the pioneer still lead the pack?

## Global Reach

Airalo covers over 200 countries and regions. During our testing in Japan, Brazil, and Germany, the setup was flawless. 

### The Data Breakdown
- **5G Availability**: 85% of tested locations
- **App Experience**: 5/5 Stars
- **Customer Support**: Responsive within 15 minutes

## Pricing vs. Performance

While Nomad and Holafly offer competitive rates, Airalo's Airmoney system provides better long-term value for frequent flyers. 

### Final Verdict
Airalo remains the most reliable companion for digital nomads who cannot afford a drop in connectivity.`,
        is_published: true,
        author_name: 'Jordan Case'
    },
    {
        item_slug: 'nomad',
        title: 'Nomad vs Airalo: The 2026 Connectivity Battle',
        slug: 'nomad-vs-airalo-2026-battle',
        excerpt: 'A tactical comparison of the two biggest names in the eSIM space. Which one should you pick for your next trip?',
        content: `Choosing between Nomad and Airalo is often a matter of cents, but in 2026, the features are starting to diverge.

## Network Slicing

Nomad has introduced aggressive network slicing for heavy data users, making it a better choice for developers working remotely on large repositories.

### Comparison Metrics
- **Latency**: Nomad (avg 45ms) vs Airalo (avg 52ms)
- **Bulk Pricing**: Nomad wins on 20GB+ plans
- **Ease of Use**: Airalo wins with better UI flow

## Conclusion

If you are a casual traveler, Airalo is king. If you are a high-bandwidth user, Nomad is your workhorse.`,
        is_published: true,
        author_name: 'Jordan Case'
    },
    {
        item_slug: 'github-copilot',
        title: 'GitHub Copilot Study: The 2026 Developer Productivity Report',
        slug: 'github-copilot-productivity-report',
        excerpt: 'Is the most popular AI pair programmer still worth the subscription? We analyze the 2026 feature set.',
        content: `GitHub Copilot Study: The 2026 Developer Productivity Report

GitHub Copilot has been the undisputed leader in AI-assisted coding since its inception. In 2026, the tool has evolved from a simple code completion engine into a full-scale development orchestrator.

## The Copilot Workspace

The introduction of "Copilot Workspace" has changed how we think about Pull Requests. The AI now understands the intent of an entire issue and can generate complex, multi-file diffs that follow your project's specific architectural patterns.

### Why Devs Stay
- Deep Context: Integration with your entire GitHub repository and codebase history.
- Unit Test Generation: Now achieving 90% accuracy in boilerplate coverage.
- Security Auditing: Real-time vulnerability detection that prevents risky code from ever hitting a commit.

## Conclusion

While Cursor offers a more "native" integrated experience, Copilot remains the gold standard for enterprise teams locked into the GitHub ecosystem.`,
        is_published: true,
        author_name: 'Alex Rivers'
    },
    {
        item_slug: 'chatgpt',
        title: 'ChatGPT-5 vs the World: State of LLMs in Early 2026',
        slug: 'chatgpt-5-vs-world-2026',
        excerpt: 'OpenAI has pushed the boundaries again. We look at ChatGPT-5\'s reasoning capabilities and its place in the market.',
        content: `OpenAI's release of ChatGPT-5 (Advanced Reasoning) has sent shockwaves through the industry. While Claude and Gemini were closing the gap in 2025, the new "Deep Logic" engine in GPT-5 has established a new ceiling for AI reasoning.

## Multimodal Dominance

The ability to interact with real-time video and "see" what the user sees with sub-50ms latency makes ChatGPT the most human-like assistant ever built.

### Feature Breakdown
- **Logic Score**: 98th percentile on complex architectural reasoning tests.
- **Vision**: Instant real-world object recognition and code debugging from screenshots.
- **Memory**: Persistent long-term memory that spans months of interaction.
- **Voice**: Zero-latency emotional intelligence in voice interactions.

## Verdict

It is no longer just a chatbot; it is a collaborative partner. If you need raw intelligence, ChatGPT sits at the top.`,
        is_published: true,
        author_name: 'Alex Rivers'
    },
    {
        item_slug: 'midjourney',
        title: 'Mastering Midjourney v7: The Future of Generative Art',
        slug: 'midjourney-v7-masterclass',
        excerpt: 'From photo-realism to consistency, we explore why Midjourney remains the artist\'s favorite AI tool.',
        content: `Generative art has come a long way from the "spaghetti hands" of 2022. Midjourney v7, released in early 2026, focuses on absolute spatial control and hyper-consistency.

## The New Direct-Control Interface

Midjourney has finally moved beyond Discord with a world-class web interface that allows for "Area-Specific Remastering." Artists can now select parts of an image and re-prompt them without losing the overall composition.

### Key Improvements
- **Text Rendering**: Perfect typography within generated art.
- **Lighting Engine**: Dynamic ray-traced lighting that responds to your prompt instructions.
- **Style Reference**: Upload 5 images to create a persistent "Style DNA" for your brand.

## Conclusion

For professional designers, Midjourney v7 isn't just a tool—it's a high-resolution extension of their imagination.`,
        is_published: true,
        author_name: 'Jordan Case'
    }
];

async function seedArticles() {
    console.log('📚 Seeding Articles...');

    // Get item IDs
    const slugs = ARTICLES.map(a => a.item_slug);
    const { data: items, error: fetchError } = await supabase
        .from('items')
        .select('id, slug')
        .in('slug', slugs);

    if (fetchError || !items) {
        console.error('Error fetching items for articles:', fetchError);
        return;
    }

    const itemMap = {};
    items.forEach(item => {
        itemMap[item.slug] = item.id;
    });

    for (const article of ARTICLES) {
        const itemId = itemMap[article.item_slug];
        if (!itemId) {
            console.warn(`Item not found for article: ${article.item_slug}`);
            continue;
        }

        const { error } = await supabase.from('articles').insert({
            item_id: itemId,
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            content: article.content,
            is_published: article.is_published,
            author_name: article.author_name,
            created_at: new Date().toISOString()
        });

        if (error) {
            if (error.code === '23505') { // Unique constraint violation
                console.log(`Article ${article.slug} already exists.`);
            } else {
                console.error(`Error inserting article ${article.slug}:`, error.message);
            }
        } else {
            console.log(`✅ Added article: ${article.title}`);
        }
    }
    console.log('✨ Articles seeded.');
}

seedArticles();
