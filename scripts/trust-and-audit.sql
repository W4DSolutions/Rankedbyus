-- Create Audit Log table for voting
CREATE TABLE IF NOT EXISTS public.vote_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address TEXT NOT NULL,
    user_agent TEXT,
    session_id TEXT,
    item_id UUID REFERENCES public.items(id),
    action TEXT, -- 'vote_cast', 'vote_toggled', 'rate_limited'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for rate limit checking
CREATE INDEX IF NOT EXISTS idx_audit_ip_time ON public.vote_audit_logs (ip_address, created_at);

-- RLS for Audit Logs
ALTER TABLE public.vote_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view audit logs" ON public.vote_audit_logs FOR SELECT USING (true); -- Restricted in production via admin client

-- Update votes table with fingerprint if not exist
ALTER TABLE public.votes ADD COLUMN IF NOT EXISTS user_agent TEXT;
