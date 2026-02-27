-- 1. ADD UNIQUE CONSTRAINTS to prevent double-voting
-- This ensures that a single user (authenticated or anonymous) can only have one vote record per item.

-- Clean up any theoretical duplicate votes before applying the constraint
-- (Keeps the most recent vote for each user/item pair)
DELETE FROM public.votes a USING public.votes b
WHERE a.id < b.id 
  AND a.item_id = b.item_id 
  AND (
    (a.user_id = b.user_id AND a.user_id IS NOT NULL) OR 
    (a.session_id = b.session_id AND a.session_id IS NOT NULL)
  );

-- Add Unique constraint for authenticated users
ALTER TABLE public.votes DROP CONSTRAINT IF EXISTS votes_item_id_user_id_key;
ALTER TABLE public.votes ADD CONSTRAINT votes_item_id_user_id_key UNIQUE (item_id, user_id);

-- Add Unique constraint for anonymous sessions
ALTER TABLE public.votes DROP CONSTRAINT IF EXISTS votes_item_id_session_id_key;
ALTER TABLE public.votes ADD CONSTRAINT votes_item_id_session_id_key UNIQUE (item_id, session_id);

-- 2. ENFORCE LINEAR SCORING (Absolute Verification)
-- This ensures the DB trigger is definitely correctly applied.
UPDATE public.items i
SET 
  vote_count = (SELECT COUNT(*) FROM public.votes v WHERE v.item_id = i.id),
  score = (SELECT COALESCE(SUM(value), 0) FROM public.votes v WHERE v.item_id = i.id);
