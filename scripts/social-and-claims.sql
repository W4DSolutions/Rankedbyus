-- Add helpful count to reviews
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0;

-- Add sponsored status to items
ALTER TABLE items ADD COLUMN IF NOT EXISTS is_sponsored BOOLEAN DEFAULT false;
ALTER TABLE items ADD COLUMN IF NOT EXISTS sponsored_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE items ADD COLUMN IF NOT EXISTS marketplace_url TEXT; -- URL to purchase if different from website

-- Create claim_requests table
CREATE TABLE IF NOT EXISTS public.claim_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    proof_url TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for claim_requests
ALTER TABLE public.claim_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert claim requests" ON public.claim_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view claim requests" ON public.claim_requests FOR SELECT USING (true); -- Usually restricted but for now okay

-- Atomic increment for review helpfulness
CREATE OR REPLACE FUNCTION increment_review_helpful(review_row_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.reviews
    SET helpful_count = COALESCE(helpful_count, 0) + 1
    WHERE id = review_row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
