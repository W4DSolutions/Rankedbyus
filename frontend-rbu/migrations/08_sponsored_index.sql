-- Create index for faster sponsored item lookups
CREATE INDEX IF NOT EXISTS idx_items_is_sponsored ON items(is_sponsored) WHERE is_sponsored = true;

-- Create index for sponsored until date to efficiently filter expired sponsorships
CREATE INDEX IF NOT EXISTS idx_items_sponsored_until ON items(sponsored_until);
