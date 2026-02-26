-- RankedByUs Real Data Expansion Script
-- Deep Analysis of High-Quality AI Tools & Tactical Ecosystem

-- 1. Ensure Categories are correctly populated
INSERT INTO categories (name, slug, description)
VALUES 
    ('AI Development', 'ai-development', 'Tools for building, debugging, and deploying AI applications.'),
    ('Intelligent Search', 'intelligent-search', 'Next-generation search engines and research assistants.'),
    ('Creative Generation', 'creative-generation', 'AI-powered image, video, and audio creation suites.'),
    ('Workflow Automation', 'workflow-automation', 'Automate business processes and daily repetitive tasks.'),
    ('Personal Assistants', 'personal-assistants', 'General-purpose AI companions for productivity and planning.')
ON CONFLICT (slug) DO NOTHING;

-- 2. Populate Tags
INSERT INTO tags (name, slug)
VALUES 
    ('Coding', 'coding'),
    ('LLM', 'llm'),
    ('Research', 'research'),
    ('Open Source', 'open-source'),
    ('Productivity', 'productivity'),
    ('Image Gen', 'image-gen'),
    ('Privacy First', 'privacy-first')
ON CONFLICT (slug) DO NOTHING;

-- 3. Populate High-Quality Real-World Tools
-- We will insert them as approved and featured to give immediate impact

DO $$ 
DECLARE 
    dev_cat_id uuid;
    search_cat_id uuid;
    creative_cat_id uuid;
    auto_cat_id uuid;
    item_id uuid;
BEGIN
    SELECT id INTO dev_cat_id FROM categories WHERE slug = 'ai-development';
    SELECT id INTO search_cat_id FROM categories WHERE slug = 'intelligent-search';
    SELECT id INTO creative_cat_id FROM categories WHERE slug = 'creative-generation';
    SELECT id INTO auto_cat_id FROM categories WHERE slug = 'workflow-automation';

    -- 3.1 Cursor
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (dev_cat_id, 'Cursor', 'cursor', 'The AI-native code editor. Built to make you 10x more productive in any codebase.', 'https://cursor.com', 'https://www.google.com/s2/favicons?domain=cursor.com&sz=128', 'approved', true, 1250, 450, 4.9)
    RETURNING id INTO item_id;
    
    INSERT INTO item_tags (item_id, tag_id) SELECT item_id, id FROM tags WHERE slug IN ('coding', 'productivity');

    -- 3.2 Claude 3.5 Sonnet (By Anthropic)
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (dev_cat_id, 'Claude 3.5 Sonnet', 'claude-3-5-sonnet', 'The smartest LLM model from Anthropic. Renowned for its coding capabilities and nuanced writing.', 'https://claude.ai', 'https://www.google.com/s2/favicons?domain=claude.ai&sz=128', 'approved', true, 2100, 890, 5.0)
    RETURNING id INTO item_id;

    INSERT INTO item_tags (item_id, tag_id) SELECT item_id, id FROM tags WHERE slug IN ('llm', 'research');

    -- 3.3 Perplexity
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (search_cat_id, 'Perplexity AI', 'perplexity', 'Where knowledge begins. A conversational search engine that provides cited answers to complex questions.', 'https://perplexity.ai', 'https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128', 'approved', true, 1800, 720, 4.8)
    RETURNING id INTO item_id;

    INSERT INTO item_tags (item_id, tag_id) SELECT item_id, id FROM tags WHERE slug IN ('research', 'productivity');

    -- 3.4 Midjourney
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (creative_cat_id, 'Midjourney', 'midjourney', 'An independent research lab exploring new mediums of thought. The industry standard for high-fidelity AI imagery.', 'https://midjourney.com', 'https://www.google.com/s2/favicons?domain=midjourney.com&sz=128', 'approved', true, 1600, 540, 4.8)
    RETURNING id INTO item_id;

    INSERT INTO item_tags (item_id, tag_id) SELECT item_id, id FROM tags WHERE slug IN ('image-gen');

    -- 3.5 v0.dev (By Vercel)
    INSERT INTO items (category_id, name, slug, description, website_url, logo_url, status, featured, score, vote_count, average_rating)
    VALUES (dev_cat_id, 'v0.dev', 'v0-dev', 'Vercel generative UI. Copy-paste high-quality React components built from simple prompts.', 'https://v0.dev', 'https://www.google.com/s2/favicons?domain=v0.dev&sz=128', 'approved', false, 800, 310, 4.7)
    RETURNING id INTO item_id;

    INSERT INTO item_tags (item_id, tag_id) SELECT item_id, id FROM tags WHERE slug IN ('coding', 'productivity');

END $$;
