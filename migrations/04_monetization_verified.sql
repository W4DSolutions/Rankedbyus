
-- Phase 5: Monetization & Launch Prep
-- Add verification status to tools
ALTER TABLE items ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Add index for verified tools
CREATE INDEX IF NOT EXISTS idx_items_is_verified ON items(is_verified);

-- Add claim_requests table if it doesn't exist (it was referenced in admin/page.tsx)
-- Assuming it exists based on the code, but let's ensure it has an 'approved' status
-- Actually, let's just make sure we can track which user verified it if we want, 
-- but for now, a simple boolean is enough.
