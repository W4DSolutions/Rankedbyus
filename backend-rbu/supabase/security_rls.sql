-- ==========================================
-- RANKED BY US: SECURITY HARDENING (RLS)
-- ==========================================

-- 1. Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_tags ENABLE ROW LEVEL SECURITY;

-- 2. CATEGORIES POLICIES
-- Anyone can read categories
CREATE POLICY "Allow public read access for categories" ON categories
FOR SELECT USING (true);

-- Only service_role can modify categories (our server-side logic)
CREATE POLICY "Allow service_role full access for categories" ON categories
FOR ALL TO service_role USING (true);


-- 3. ITEMS POLICIES
-- Anyone can read approved items
CREATE POLICY "Allow public read access for approved items" ON items
FOR SELECT USING (status = 'approved');

-- Users can insert new items (pending approval)
CREATE POLICY "Allow public to submit new tools" ON items
FOR INSERT WITH CHECK (status = 'pending');

-- Only service_role can modify items
CREATE POLICY "Allow service_role full access for items" ON items
FOR ALL TO service_role USING (true);


-- 4. VOTES POLICIES
-- Anyone can read votes
CREATE POLICY "Allow public read access for votes" ON votes
FOR SELECT USING (true);

-- Users can insert votes (server-side logic handles session validation)
-- But we add a safety check for the value
CREATE POLICY "Allow public to cast votes" ON votes
FOR INSERT WITH CHECK (value IN (-1, 1));

-- Only service_role can modify/delete votes (prevents users from undoing others' votes)
CREATE POLICY "Allow service_role full access for votes" ON votes
FOR ALL TO service_role USING (true);


-- 5. REVIEWS POLICIES
-- Anyone can read approved reviews
CREATE POLICY "Allow public read access for approved reviews" ON reviews
FOR SELECT USING (status = 'approved');

-- Users can submit reviews (pending status)
CREATE POLICY "Allow public to submit reviews" ON reviews
FOR INSERT WITH CHECK (status = 'pending');

-- Only service_role can modify reviews
CREATE POLICY "Allow service_role full access for reviews" ON reviews
FOR ALL TO service_role USING (true);


-- 6. TAGS POLICIES
-- Public read only
CREATE POLICY "Allow public read access for tags" ON tags
FOR SELECT USING (true);

CREATE POLICY "Allow service_role full access for tags" ON tags
FOR ALL TO service_role USING (true);

-- 7. ITEM_TAGS POLICIES
-- Public read only
CREATE POLICY "Allow public read access for item_tags" ON item_tags
FOR SELECT USING (true);

CREATE POLICY "Allow service_role full access for item_tags" ON item_tags
FOR ALL TO service_role USING (true);
