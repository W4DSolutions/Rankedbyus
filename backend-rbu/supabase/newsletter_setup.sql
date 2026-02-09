-- Create Newsletter Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active', -- active, unsubscribed
    source TEXT, -- homepage, sidebar, etc.
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe (Insert)
CREATE POLICY "Allow anonymous subscription" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Only admin can view subscribers
CREATE POLICY "Allow admin to view subscribers" ON public.newsletter_subscribers
    FOR SELECT USING (auth.role() = 'service_role');
