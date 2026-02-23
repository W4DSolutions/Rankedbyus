
-- Add session_id to items table to track user submissions
ALTER TABLE items ADD COLUMN session_id TEXT;
CREATE INDEX idx_items_session_id ON items(session_id);

-- Optional: Add session_id to newsletter_subscribers for consistency
ALTER TABLE newsletter_subscribers ADD COLUMN session_id TEXT;
CREATE INDEX idx_newsletter_subscribers_session_id ON newsletter_subscribers(session_id);
