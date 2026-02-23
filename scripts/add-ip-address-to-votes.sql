
-- Add ip_address column to votes table
ALTER TABLE votes ADD COLUMN IF NOT EXISTS ip_address TEXT;

-- Create index for faster IP-based lookups
CREATE INDEX IF NOT EXISTS idx_votes_ip_address ON votes(ip_address);

-- Optional: Add unique constraint to prevent multiple votes per item per IP
-- This enforces strict one-vote-per-IP rule at the database level
-- ALTER TABLE votes ADD CONSTRAINT unique_vote_per_ip UNIQUE (item_id, ip_address);
