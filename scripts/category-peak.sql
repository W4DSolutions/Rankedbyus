-- RankedByUs "Grand Registry" Saturation Script
-- Goal: Ensure 3 top-tier assets for every category (both legacy and UI-defined)

INSERT INTO categories (name, slug, description)
VALUES 
    ('AI Writing Tools', 'ai-writing-tools', 'Generate high-quality copy, bogs, and technical documentation.'),
    ('AI Image Generators', 'ai-image-generators', 'Create stunning visual assets from text descriptions.'),
    ('AI Video Tools', 'ai-video-tools', 'Cinematic video generation and AI-powered editing suites.'),
    ('AI Code Assistants', 'ai-code-assistants', 'Intelligent IDEs and autocomplete engines for developers.'),
    ('Cloud Hosting', 'cloud-hosting', 'Modern deployment platforms for the AI era.'),
    ('ESIM Providers', 'esim-providers', 'Digital connectivity solutions for global nomads.'),
    ('SaaS Essentials', 'saas-essentials', 'Critical software for running high-performance teams.')
ON CONFLICT (slug) DO UPDATE SET description = EXCLUDED.description;

DO $$ 
DECLARE 
    cat_id uuid;
    item_id uuid;
    tag_id uuid;
BEGIN
    -- 1. AI WRITING TOOLS
    SELECT id INTO cat_id FROM categories WHERE slug = 'ai-writing-tools';
    -- Jasper
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'Jasper', 'jasper-ai', 'The leading AI writing assistant for enterprise teams.', 'https://jasper.ai', 'https://www.google.com/s2/favicons?domain=jasper.ai&sz=128', 'approved', true, 1800, 620, 4.8)
    ON CONFLICT (slug) DO NOTHING;
    -- Writesonic
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'Writesonic', 'writesonic', 'AI writer for creating SEO-optimized content 10x faster.', 'https://writesonic.com', 'https://www.google.com/s2/favicons?domain=writesonic.com&sz=128', 'approved', false, 1200, 410, 4.7)
    ON CONFLICT (slug) DO NOTHING;
    -- Copy.ai
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'Copy.ai', 'copy-ai', 'AI marketing platform for creating high-converting copy.', 'https://copy.ai', 'https://www.google.com/s2/favicons?domain=copy.ai&sz=128', 'approved', false, 1100, 380, 4.6)
    ON CONFLICT (slug) DO NOTHING;

    -- 2. AI IMAGE GENERATORS
    SELECT id INTO cat_id FROM categories WHERE slug = 'ai-image-generators';
    -- DALL-E 3
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'DALL-E 3', 'dalle-3', 'OpenAI native image generation following complex instructions.', 'https://openai.com/dall-e-3', 'https://www.google.com/s2/favicons?domain=openai.com&sz=128', 'approved', true, 2200, 950, 4.9)
    ON CONFLICT (slug) DO NOTHING;
    -- Stable Diffusion
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'Stable Diffusion', 'stable-diffusion', 'Open source image generation with total control and privacy.', 'https://stability.ai', 'https://www.google.com/s2/favicons?domain=stability.ai&sz=128', 'approved', false, 1900, 820, 5.0)
    ON CONFLICT (slug) DO NOTHING;
    -- Leonardo.ai
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'Leonardo.ai', 'leonardo-ai', 'Production-quality visual assets with fine-tuned models.', 'https://leonardo.ai', 'https://www.google.com/s2/favicons?domain=leonardo.ai&sz=128', 'approved', false, 1400, 420, 4.8)
    ON CONFLICT (slug) DO NOTHING;

    -- 3. AI VIDEO TOOLS
    SELECT id INTO cat_id FROM categories WHERE slug = 'ai-video-tools';
    -- Sora (Placeholder)
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'OpenAI Sora', 'sora', 'The legendary text-to-video model that redefined AI physics.', 'https://openai.com/sora', 'https://www.google.com/s2/favicons?domain=openai.com&sz=128', 'approved', true, 3500, 1200, 5.0)
    ON CONFLICT (slug) DO NOTHING;
    -- Pika Labs
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'Pika', 'pika-art', 'An idea-to-video platform that brings your imagination to motion.', 'https://pika.art', 'https://www.google.com/s2/favicons?domain=pika.art&sz=128', 'approved', false, 1200, 390, 4.7)
    ON CONFLICT (slug) DO NOTHING;
    -- HeyGen
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'HeyGen', 'heygen', 'AI video generation for hyper-realistic avatars and translation.', 'https://heygen.com', 'https://www.google.com/s2/favicons?domain=heygen.com&sz=128', 'approved', false, 1500, 530, 4.8)
    ON CONFLICT (slug) DO NOTHING;

    -- 4. AI CODE ASSISTANTS
    SELECT id INTO cat_id FROM categories WHERE slug = 'ai-code-assistants';
    -- GitHub Copilot
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'GitHub Copilot', 'github-copilot', 'The world longest running AI pair programmer for every IDE.', 'https://github.com/features/copilot', 'https://www.google.com/s2/favicons?domain=github.com&sz=128', 'approved', true, 2600, 1100, 4.9)
    ON CONFLICT (slug) DO NOTHING;
    -- Tabnine
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'Tabnine', 'tabnine', 'Privacy-focused AI code completion for enterprise teams.', 'https://tabnine.com', 'https://www.google.com/s2/favicons?domain=tabnine.com&sz=128', 'approved', false, 1100, 320, 4.6)
    ON CONFLICT (slug) DO NOTHING;
    -- Replit Ghostwriter
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'Replit Agent', 'replit-agent', 'Build and deploy full applications from zero to live in a browser.', 'https://replit.com', 'https://www.google.com/s2/favicons?domain=replit.com&sz=128', 'approved', false, 1400, 380, 4.7)
    ON CONFLICT (slug) DO NOTHING;

    -- 5. CLOUD HOSTING
    SELECT id INTO cat_id FROM categories WHERE slug = 'cloud-hosting';
    -- Vercel
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'Vercel', 'vercel', 'The frontend cloud. Best-in-class performance for Next.js apps.', 'https://vercel.com', 'https://www.google.com/s2/favicons?domain=vercel.com&sz=128', 'approved', true, 2800, 1400, 5.0)
    ON CONFLICT (slug) DO NOTHING;
    -- Supabase
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'Supabase', 'supabase', 'The open source Firebase alternative. Build in a weekend, scale to millions.', 'https://supabase.com', 'https://www.google.com/s2/favicons?domain=supabase.com&sz=128', 'approved', true, 2400, 1050, 4.9)
    ON CONFLICT (slug) DO NOTHING;
    -- Railway
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'Railway', 'railway', 'Deploy anytime, anywhere. Infrastructure that makes development feel like magic.', 'https://railway.app', 'https://www.google.com/s2/favicons?domain=railway.app&sz=128', 'approved', false, 1600, 520, 4.8)
    ON CONFLICT (slug) DO NOTHING;

    -- 6. ESIM PROVIDERS
    SELECT id INTO cat_id FROM categories WHERE slug = 'esim-providers';
    -- Airalo
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'Airalo', 'airalo', 'The world’s first eSIM store that solves high roaming bills.', 'https://airalo.com', 'https://www.google.com/s2/favicons?domain=airalo.com&sz=128', 'approved', true, 1900, 680, 4.8)
    ON CONFLICT (slug) DO NOTHING;
    -- Holafly
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'Holafly', 'holafly', 'Unlimited data eSIMs for international travel in 160+ destinations.', 'https://esim.holafly.com', 'https://www.google.com/s2/favicons?domain=holafly.com&sz=128', 'approved', false, 1100, 310, 4.6)
    ON CONFLICT (slug) DO NOTHING;
    -- Nomad
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'Nomad', 'getnomad', 'High-speed data plans for travelers in 110+ countries.', 'https://getnomad.app', 'https://www.google.com/s2/favicons?domain=getnomad.app&sz=128', 'approved', false, 900, 240, 4.5)
    ON CONFLICT (slug) DO NOTHING;

    -- 7. SAAS ESSENTIALS
    SELECT id INTO cat_id FROM categories WHERE slug = 'saas-essentials';
    -- Linear
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'Linear', 'linear', 'The issue tracker you’ll actually enjoy using. Built for high-performance teams.', 'https://linear.app', 'https://www.google.com/s2/favicons?domain=linear.app&sz=128', 'approved', true, 2500, 980, 5.0)
    ON CONFLICT (slug) DO NOTHING;
    -- Notion
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'Notion', 'notion', 'Your connected workspace for docs, projects, and knowledge.', 'https://notion.so', 'https://www.google.com/s2/favicons?domain=notion.so&sz=128', 'approved', true, 2800, 1600, 4.9)
    ON CONFLICT (slug) DO NOTHING;
    -- Slack
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (cat_id, 'Slack', 'slack', 'Where work happens. The industry standard for team communication.', 'https://slack.com', 'https://www.google.com/s2/favicons?domain=slack.com&sz=128', 'approved', false, 3100, 2200, 4.7)
    ON CONFLICT (slug) DO NOTHING;

END $$;
