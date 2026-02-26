-- FORCE REFRESH: Vote Audit Logs
-- This script ensures the table is created with the correct columns by dropping it first.
-- WARNING: This will clear existing audit logs, but since this is a new feature, 
-- it's necessary to ensure schema integrity.

-- 1. Clean Slate
DROP TABLE IF EXISTS public.vote_audit_logs CASCADE;

-- 2. Create Table
CREATE TABLE public.vote_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
    user_id UUID, -- Standard UUID to avoid auth schema permission issues
    session_id TEXT,
    action TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Indexes
CREATE INDEX idx_vote_audit_logs_item_id ON public.vote_audit_logs(item_id);
CREATE INDEX idx_vote_audit_logs_user_id ON public.vote_audit_logs(user_id);
CREATE INDEX idx_vote_audit_logs_ip ON public.vote_audit_logs(ip_address);

-- 4. Security
ALTER TABLE public.vote_audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins see all, users see their own
CREATE POLICY "view_audit_logs" 
ON public.vote_audit_logs FOR SELECT 
TO authenticated 
USING (
    (auth.jwt() ->> 'role' = 'admin') OR 
    (auth.uid() = user_id)
);

-- Anyone can log (required for IP-based rate limiting)
CREATE POLICY "log_audit_actions"
ON public.vote_audit_logs FOR INSERT
TO anon, authenticated
WITH CHECK (true);
