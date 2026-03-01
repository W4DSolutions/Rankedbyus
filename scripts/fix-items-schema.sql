-- RESTORE MISSING COLUMNS TO ITEMS TABLE
-- Run this in your Supabase SQL Editor to ensure the Registry can accept submissions.

ALTER TABLE public.items ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS submitter_email TEXT;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS transaction_id TEXT;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid';
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'paypal';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_items_session_id ON public.items(session_id);
CREATE INDEX IF NOT EXISTS idx_items_payment_status ON public.items(payment_status);

-- Clear schema cache (PostgREST)
-- Note: In Supabase, the schema cache usually reloads automatically, 
-- but you can force it by running any DDL like this.
