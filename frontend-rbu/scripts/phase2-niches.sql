-- Ensure all required columns exist first
ALTER TABLE items ADD COLUMN IF NOT EXISTS pricing_model TEXT;
ALTER TABLE items ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0;
ALTER TABLE items ADD COLUMN IF NOT EXISTS is_sponsored BOOLEAN DEFAULT false;
ALTER TABLE items ADD COLUMN IF NOT EXISTS sponsored_until TIMESTAMP WITH TIME ZONE;

-- Phase 2 Niche Expansion: eSIM & Hosting
-- Insert Categories
INSERT INTO categories (slug, name, description) VALUES
('esim', 'eSIM & Connectivity', 'Global eSIM solutions for travelers and remote professionals.')
ON CONFLICT (slug) DO UPDATE SET description = EXCLUDED.description;

INSERT INTO categories (slug, name, description) VALUES
('cloud-hosting', 'Cloud Hosting', 'Enterprise-grade hosting and deployment platforms for modern applications.')
ON CONFLICT (slug) DO UPDATE SET description = EXCLUDED.description;

-- Insert Tags
INSERT INTO tags (slug, name) VALUES 
('travelers', 'Travelers'),
('startups', 'Startups'),
('react-apps', 'React Apps')
ON CONFLICT (slug) DO NOTHING;

-- Insert eSIM Tools
INSERT INTO items (category_id, name, slug, description, website_url, affiliate_link, pricing_model, status, score) 
SELECT 
  (SELECT id FROM categories WHERE slug = 'esim'),
  'Airalo',
  'airalo',
  'The world’s first eSIM store that solves the pain of high roaming bills by giving you access to eSIMs.',
  'https://airalo.com',
  'https://airalo.com?aff=rbu',
  'Paid',
  'approved',
  98.5
WHERE EXISTS (SELECT 1 FROM categories WHERE slug = 'esim');

INSERT INTO items (category_id, name, slug, description, website_url, affiliate_link, pricing_model, status, score) 
SELECT 
  (SELECT id FROM categories WHERE slug = 'esim'),
  'Nomad',
  'nomad',
  'Connect to the fastest networks globally with Nomad eSIM. Flexible plans for frequent travelers.',
  'https://getnomad.app',
  'https://getnomad.app?aff=rbu',
  'Paid',
  'approved',
  94.2
WHERE EXISTS (SELECT 1 FROM categories WHERE slug = 'esim');

-- Insert Hosting Tools
INSERT INTO items (category_id, name, slug, description, website_url, affiliate_link, pricing_model, status, score) 
SELECT 
  (SELECT id FROM categories WHERE slug = 'cloud-hosting'),
  'Vercel',
  'vercel',
  'The platform for frontend developers, providing the speed and reliability needed to create at the speed of thought.',
  'https://vercel.com',
  'https://vercel.com',
  'Freemium',
  'approved',
  99.1
WHERE EXISTS (SELECT 1 FROM categories WHERE slug = 'cloud-hosting');

INSERT INTO items (category_id, name, slug, description, website_url, affiliate_link, pricing_model, status, score) 
SELECT 
  (SELECT id FROM categories WHERE slug = 'cloud-hosting'),
  'Netlify',
  'netlify',
  'A cloud computing company that offers a development platform that includes build, deploy, and serverless backend services.',
  'https://netlify.com',
  'https://netlify.com',
  'Freemium',
  'approved',
  97.6
WHERE EXISTS (SELECT 1 FROM categories WHERE slug = 'cloud-hosting');

-- Mapping Tags
INSERT INTO item_tags (item_id, tag_id)
SELECT 
  (SELECT id FROM items WHERE slug = 'airalo'),
  (SELECT id FROM tags WHERE slug = 'travelers')
ON CONFLICT DO NOTHING;

INSERT INTO item_tags (item_id, tag_id)
SELECT 
  (SELECT id FROM items WHERE slug = 'nomad'),
  (SELECT id FROM tags WHERE slug = 'travelers')
ON CONFLICT DO NOTHING;

INSERT INTO item_tags (item_id, tag_id)
SELECT 
  (SELECT id FROM items WHERE slug = 'vercel'),
  (SELECT id FROM tags WHERE slug = 'react-apps')
ON CONFLICT DO NOTHING;

INSERT INTO item_tags (item_id, tag_id)
SELECT 
  (SELECT id FROM items WHERE slug = 'vercel'),
  (SELECT id FROM tags WHERE slug = 'startups')
ON CONFLICT DO NOTHING;
