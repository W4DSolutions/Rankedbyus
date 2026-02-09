-- ==========================================
-- RANKED BY US: MASSIVE SEED DATA SCRIPT
-- ==========================================

-- 1. Ensure Categories Exist
INSERT INTO categories (slug, name, description) VALUES
('ai-writing-tools', 'AI Writing Tools', 'Best AI-powered writing assistants for content, emails, and blogs.'),
('ai-image-generators', 'AI Image Generators', 'Top-rated AI tools for creating stunning visual art and photos.'),
('ai-video-tools', 'AI Video Tools', 'Professional AI tools for video editing, avatars, and generation.'),
('ai-code-assistants', 'AI Code Assistants', 'The best AI companions for developers and software engineers.'),
('ai-chatbots', 'AI Chatbots', 'Conversational AI models for research, productivity, and fun.'),
('ai-productivity', 'AI Productivity', 'AI tools to automate workflows and boost daily efficiency.')
ON CONFLICT (slug) DO NOTHING;

-- 2. Populate AI Writing Tools
INSERT INTO items (category_id, name, slug, description, website_url, score, status, featured)
SELECT id, 'Jasper', 'jasper-ai', 'Enterprise-grade AI content platform for marketing teams.', 'https://jasper.ai', 1250, 'approved', true FROM categories WHERE slug = 'ai-writing-tools' UNION ALL
SELECT id, 'Copy.ai', 'copy-ai', 'GTM AI platform for automated sales and marketing workflows.', 'https://copy.ai', 980, 'approved', false FROM categories WHERE slug = 'ai-writing-tools' UNION ALL
SELECT id, 'Grammarly', 'grammarly-go', 'The classic writing assistant, now with powerful generative AI features.', 'https://grammarly.com', 2100, 'approved', false FROM categories WHERE slug = 'ai-writing-tools' UNION ALL
SELECT id, 'Quillbot', 'quillbot', 'Advanced paraphrasing and summarizing tool for students and pros.', 'https://quillbot.com', 1500, 'approved', false FROM categories WHERE slug = 'ai-writing-tools' UNION ALL
SELECT id, 'Writesonic', 'writesonic', 'AI writer for creating SEO-optimized blogs and articles.', 'https://writesonic.com', 840, 'approved', false FROM categories WHERE slug = 'ai-writing-tools' UNION ALL
SELECT id, 'Notion AI', 'notion-ai', 'Integrated AI directly inside your Notion workspace.', 'https://notion.so', 1850, 'approved', false FROM categories WHERE slug = 'ai-writing-tools'
ON CONFLICT (slug) DO NOTHING;

-- 3. Populate AI Image Generators
INSERT INTO items (category_id, name, slug, description, website_url, score, status, featured)
SELECT id, 'Midjourney', 'midjourney', 'The most advanced AI image generator, living inside Discord.', 'https://midjourney.com', 3200, 'approved', true FROM categories WHERE slug = 'ai-image-generators' UNION ALL
SELECT id, 'DALL-E 3', 'dall-e-3', 'OpenAI native image generator with incredible prompt adherence.', 'https://openai.com/dall-e-3', 2800, 'approved', false FROM categories WHERE slug = 'ai-image-generators' UNION ALL
SELECT id, 'Leonardo.ai', 'leonardo-ai', 'Production-quality visual assets for your creative projects.', 'https://leonardo.ai', 1420, 'approved', false FROM categories WHERE slug = 'ai-image-generators' UNION ALL
SELECT id, 'Stable Diffusion', 'stable-diffusion', 'Open Source image model for unlimited local creation.', 'https://stability.ai', 2100, 'approved', false FROM categories WHERE slug = 'ai-image-generators' UNION ALL
SELECT id, 'Canva Magic Media', 'canva-magic', 'Simple AI image generation built into the Canva design suite.', 'https://canva.com', 1100, 'approved', false FROM categories WHERE slug = 'ai-image-generators'
ON CONFLICT (slug) DO NOTHING;

-- 4. Populate AI Chatbots
INSERT INTO items (category_id, name, slug, description, website_url, score, status, featured)
SELECT id, 'ChatGPT', 'chatgpt', 'The AI that started it all. Powered by GPT-4o.', 'https://chat.openai.com', 5000, 'approved', true FROM categories WHERE slug = 'ai-chatbots' UNION ALL
SELECT id, 'Claude', 'claude-ai', 'Anthropic highly intelligent and constitutional AI model.', 'https://claude.ai', 3800, 'approved', true FROM categories WHERE slug = 'ai-chatbots' UNION ALL
SELECT id, 'Perplexity', 'perplexity-ai', 'The AI-powered search engine that provides cited answers.', 'https://perplexity.ai', 2900, 'approved', false FROM categories WHERE slug = 'ai-chatbots' UNION ALL
SELECT id, 'Google Gemini', 'google-gemini', 'Google next-gen AI with massive context window.', 'https://gemini.google.com', 2500, 'approved', false FROM categories WHERE slug = 'ai-chatbots' UNION ALL
SELECT id, 'Poe', 'poe', 'Quick access to multiple AI models in one simple app.', 'https://poe.com', 1200, 'approved', false FROM categories WHERE slug = 'ai-chatbots'
ON CONFLICT (slug) DO NOTHING;

-- 5. Populate AI Code Assistants
INSERT INTO items (category_id, name, slug, description, website_url, score, status, featured)
SELECT id, 'GitHub Copilot', 'github-copilot', 'The worlds most widely adopted AI developer tool.', 'https://github.com/features/copilot', 4200, 'approved', true FROM categories WHERE slug = 'ai-code-assistants' UNION ALL
SELECT id, 'Cursor', 'cursor-editor', 'The AI-native code editor that understands your entire codebase.', 'https://cursor.com', 3100, 'approved', true FROM categories WHERE slug = 'ai-code-assistants' UNION ALL
SELECT id, 'Tabnine', 'tabnine', 'AI assistant for software developers with private code protection.', 'https://tabnine.com', 1450, 'approved', false FROM categories WHERE slug = 'ai-code-assistants' UNION ALL
SELECT id, 'Replit Ghostwriter', 'replit-ghostwriter', 'AI pair programmer living inside the Replit cloud IDE.', 'https://replit.com', 1100, 'approved', false FROM categories WHERE slug = 'ai-code-assistants' UNION ALL
SELECT id, 'Amazon CodeWhisperer', 'aws-codewhisperer', 'AW S proprietary AI assistant for coding and security.', 'https://aws.amazon.com/codewhisperer', 950, 'approved', false FROM categories WHERE slug = 'ai-code-assistants'
ON CONFLICT (slug) DO NOTHING;

-- 6. Populate AI Video Tools
INSERT INTO items (category_id, name, slug, description, website_url, score, status, featured)
SELECT id, 'Runway Gen-2', 'runway-gen2', 'Advanced AI research platform for generating high-quality video.', 'https://runwayml.com', 2200, 'approved', true FROM categories WHERE slug = 'ai-video-tools' UNION ALL
SELECT id, 'HeyGen', 'heygen', 'AI video generation for business with hyper-realistic avatars.', 'https://heygen.com', 1900, 'approved', false FROM categories WHERE slug = 'ai-video-tools' UNION ALL
SELECT id, 'Synthesia', 'synthesia', 'Create videos from plain text in minutes with AI avatars.', 'https://synthesia.io', 1650, 'approved', false FROM categories WHERE slug = 'ai-video-tools' UNION ALL
SELECT id, 'Pika', 'pika-labs', 'AI video generation platform for high-quality cinematic clips.', 'https://pika.art', 1400, 'approved', false FROM categories WHERE slug = 'ai-video-tools' UNION ALL
SELECT id, 'Pictory', 'pictory', 'Automatically create short, highly-sharable branded videos.', 'https://pictory.ai', 850, 'approved', false FROM categories WHERE slug = 'ai-video-tools'
ON CONFLICT (slug) DO NOTHING;

-- 7. Add Initial Tags
INSERT INTO tags (name, slug) VALUES
('Free', 'free'),
('Freemium', 'freemium'),
('Paid', 'paid'),
('API', 'api'),
('Open Source', 'open-source'),
('Mobile App', 'mobile-app')
ON CONFLICT (slug) DO NOTHING;

-- 8. Map Tags to Top Tools (Examples)
INSERT INTO item_tags (item_id, tag_id)
SELECT i.id, t.id FROM items i, tags t WHERE i.slug = 'chatgpt' AND t.slug = 'freemium' UNION ALL
SELECT i.id, t.id FROM items i, tags t WHERE i.slug = 'chatgpt' AND t.slug = 'mobile-app' UNION ALL
SELECT i.id, t.id FROM items i, tags t WHERE i.slug = 'github-copilot' AND t.slug = 'paid' UNION ALL
SELECT i.id, t.id FROM items i, tags t WHERE i.slug = 'midjourney' AND t.slug = 'paid' UNION ALL
SELECT i.id, t.id FROM items i, tags t WHERE i.slug = 'stable-diffusion' AND t.slug = 'open-source' UNION ALL
SELECT i.id, t.id FROM items i, tags t WHERE i.slug = 'perplexity-ai' AND t.slug = 'free'
ON CONFLICT DO NOTHING;
