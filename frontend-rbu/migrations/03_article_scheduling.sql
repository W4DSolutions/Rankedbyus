
-- Add published_at column to articles table for scheduling
ALTER TABLE articles ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Update existing published articles to have published_at = created_at
UPDATE articles SET published_at = created_at WHERE is_published = true AND published_at IS NULL;

-- Create index for faster querying of published articles
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
