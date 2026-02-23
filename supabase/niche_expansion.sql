-- Niche Expansion: Hosting, eSIM, and SaaS
-- Run this in Supabase SQL Editor to expand categories and add sponsored tools

-- 1. Add New Categories
INSERT INTO public.categories (slug, name, description)
VALUES 
    ('cloud-hosting', 'Cloud Hosting', 'Top-rated web hosting, VPS, and cloud infrastructure providers.'),
    ('esim-providers', 'eSIM for Travel', 'Best digital SIM cards for international travelers and digital nomads.'),
    ('saas-essentials', 'SaaS Essentials', 'Critical business software, CRM, and project management tools.')
ON CONFLICT (slug) DO NOTHING;

-- 2. Add Tools for Hosting
DO $$
DECLARE 
    hosting_cat_id UUID;
BEGIN
    SELECT id INTO hosting_cat_id FROM public.categories WHERE slug = 'cloud-hosting';

    INSERT INTO public.items (category_id, name, slug, description, website_url, affiliate_link, status, featured, score, vote_count)
    VALUES 
        (hosting_cat_id, 'SiteGround', 'siteground', 'Premium hosting with top-tier support and speed optimization.', 'https://siteground.com', 'https://siteground.com/?aff=rbu', 'approved', true, 1250, 450),
        (hosting_cat_id, 'DigitalOcean', 'digitalocean', 'Simple, scalable cloud computing for developers.', 'https://digitalocean.com', null, 'approved', false, 980, 320),
        (hosting_cat_id, 'Hostinger', 'hostinger', 'Affordable and fast hosting for small businesses.', 'https://hostinger.com', null, 'approved', false, 850, 210)
    ON CONFLICT (slug) DO NOTHING;
END $$;

-- 3. Add Tools for eSIM
DO $$
DECLARE 
    esim_cat_id UUID;
BEGIN
    SELECT id INTO esim_cat_id FROM public.categories WHERE slug = 'esim-providers';

    INSERT INTO public.items (category_id, name, slug, description, website_url, affiliate_link, status, featured, score, vote_count)
    VALUES 
        (esim_cat_id, 'Airalo', 'airalo', 'The world first eSIM store for global travelers.', 'https://airalo.com', 'https://airalo.com/rbu', 'approved', true, 1500, 600),
        (esim_cat_id, 'Holafly', 'holafly', 'Unlimited data eSIM cards for international travel.', 'https://holafly.com', null, 'approved', false, 1100, 400)
    ON CONFLICT (slug) DO NOTHING;
END $$;

-- 4. Mark Jasper AI as Featured for the Banner
UPDATE public.items SET featured = true WHERE slug = 'jasper-ai';
