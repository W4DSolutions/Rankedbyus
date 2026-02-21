
-- Add pricing_model column to items table if it doesn't exist
ALTER TABLE items ADD COLUMN IF NOT EXISTS pricing_model TEXT;

-- Update some items to have pricing models so filters work
UPDATE items SET pricing_model = 'Free' WHERE slug LIKE '%free%';
UPDATE items SET pricing_model = 'Freemium' WHERE pricing_model IS NULL AND (id IN (SELECT id FROM items LIMIT 50));
UPDATE items SET pricing_model = 'Paid' WHERE pricing_model IS NULL;

-- Ensure tags and item_tags are populated
-- (This part depends on what tags exist, but let's add some basics if they don't)
INSERT INTO tags (name, slug, color)
VALUES 
('Open Source', 'open-source', '#3b82f6'),
('Enterprise', 'enterprise', '#1e293b'),
('Mobile App', 'mobile-app', '#10b981'),
('Browser Extension', 'browser-extension', '#f59e0b'),
('API Available', 'api-available', '#8b5cf6')
ON CONFLICT (slug) DO NOTHING;

-- Link some items to tags so Attribute filter works
INSERT INTO item_tags (item_id, tag_id)
SELECT i.id, t.id 
FROM items i, tags t
WHERE i.status = 'approved' 
AND t.slug = 'open-source'
AND (i.name ILIKE '%open%' OR i.description ILIKE '%open%')
ON CONFLICT DO NOTHING;

INSERT INTO item_tags (item_id, tag_id)
SELECT i.id, t.id 
FROM items i, tags t
WHERE i.status = 'approved' 
AND t.slug = 'enterprise'
AND (i.name ILIKE '%pro%' OR i.description ILIKE '%enterprise%' OR i.pricing_model = 'Paid')
LIMIT 40
ON CONFLICT DO NOTHING;
