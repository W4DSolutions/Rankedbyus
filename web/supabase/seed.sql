-- Seed initial categories
INSERT INTO public.categories (slug, name, description, seo_meta) VALUES
  ('ai-writing-tools', 'AI Writing Tools', 'Best AI-powered writing assistants for content creation, copywriting, and more', '{"title": "Best AI Writing Tools - Ranked by Users", "keywords": ["AI writing", "content creation", "copywriting"]}'),
  ('ai-image-generators', 'AI Image Generators', 'Top-rated AI tools for creating stunning images and artwork', '{"title": "Best AI Image Generators - Community Ranked", "keywords": ["AI art", "image generation", "AI design"]}'),
  ('ai-video-tools', 'AI Video Tools', 'Leading AI solutions for video editing and generation', '{"title": "Best AI Video Tools - User Rankings", "keywords": ["AI video", "video editing", "video generation"]}'),
  ('ai-code-assistants', 'AI Code Assistants', 'Best AI-powered coding companions and development tools', '{"title": "Best AI Code Assistants - Developer Ranked", "keywords": ["AI coding", "code completion", "programming assistant"]}');

-- Seed initial tools for AI Writing Tools category
INSERT INTO public.items (
  category_id, 
  name, 
  slug, 
  description, 
  website_url, 
  affiliate_link, 
  logo_url,
  status,
  score,
  vote_count
) VALUES
  (
    (SELECT id FROM public.categories WHERE slug = 'ai-writing-tools'),
    'ChatGPT',
    'chatgpt',
    'Advanced AI chatbot for writing, coding, and creative tasks',
    'https://chat.openai.com',
    'https://chat.openai.com',
    'https://placehold.co/80x80/6366f1/white?text=GPT',
    'approved',
    487,
    523
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'ai-writing-tools'),
    'Jasper AI',
    'jasper-ai',
    'AI content platform for marketing teams and creators',
    'https://jasper.ai',
    'https://jasper.ai',
    'https://placehold.co/80x80/8b5cf6/white?text=JAS',
    'approved',
    412,
    445
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'ai-writing-tools'),
    'Copy.ai',
    'copy-ai',
    'AI-powered copywriting tool for marketing content',
    'https://copy.ai',
    'https://copy.ai',
    'https://placehold.co/80x80/ec4899/white?text=CPY',
    'approved',
    389,
    402
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'ai-writing-tools'),
    'Writesonic',
    'writesonic',
    'AI writer for articles, blogs, and social media',
    'https://writesonic.com',
    'https://writesonic.com',
    'https://placehold.co/80x80/10b981/white?text=WRT',
    'approved',
    356,
    378
  );

-- Add a few tools to other categories
INSERT INTO public.items (
  category_id, 
  name, 
  slug, 
  description, 
  website_url, 
  affiliate_link, 
  logo_url,
  status,
  score,
  vote_count
) VALUES
  (
    (SELECT id FROM public.categories WHERE slug = 'ai-image-generators'),
    'Midjourney',
    'midjourney',
    'AI art generator for stunning creative images',
    'https://midjourney.com',
    'https://midjourney.com',
    'https://placehold.co/80x80/a855f7/white?text=MJ',
    'approved',
    521,
    567
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'ai-image-generators'),
    'DALL-E 3',
    'dall-e-3',
    'OpenAI powerful image generation from text',
    'https://openai.com/dall-e-3',
    'https://openai.com/dall-e-3',
    'https://placehold.co/80x80/f59e0b/white?text=DE',
    'approved',
    498,
    542
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'ai-code-assistants'),
    'GitHub Copilot',
    'github-copilot',
    'AI pair programmer that helps you write code faster',
    'https://github.com/features/copilot',
    'https://github.com/features/copilot',
    'https://placehold.co/80x80/3b82f6/white?text=GH',
    'approved',
    612,
    678
  );

-- Add one pending submission (for testing admin panel)
INSERT INTO public.items (
  category_id, 
  name, 
  slug, 
  description, 
  website_url, 
  affiliate_link, 
  logo_url,
  status
) VALUES
  (
    (SELECT id FROM public.categories WHERE slug = 'ai-video-tools'),
    'Runway ML',
    'runway-ml',
    'Professional AI video editing and generation platform',
    'https://runwayml.com',
    'https://runwayml.com',
    'https://placehold.co/80x80/ef4444/white?text=RW',
    'pending'
  );
