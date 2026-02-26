-- FIX: Voting Score Trigger (Linear Alignment)
-- This script aligns the database trigger with the requested linear scoring model (+1/-1).
-- It removes the 'trending bonus' which was causing unpredictable score jumps.

CREATE OR REPLACE FUNCTION public.sync_item_vote_stats()
RETURNS trigger AS $$
DECLARE
  v_upvotes int;
  v_downvotes int;
BEGIN
  -- 1. Calculate absolute community signals
  SELECT 
    COUNT(*) FILTER (WHERE value = 1), 
    COUNT(*) FILTER (WHERE value = -1)
  INTO v_upvotes, v_downvotes
  FROM public.votes 
  WHERE item_id = COALESCE(NEW.item_id, OLD.item_id);

  -- 2. Update Item with linear precision
  -- Score = Upvotes - Downvotes (Absolute Delta)
  -- Vote Count = Total Signals
  UPDATE public.items
  SET 
    vote_count = v_upvotes + v_downvotes,
    score = (v_upvotes - v_downvotes)
  WHERE id = COALESCE(NEW.item_id, OLD.item_id);

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Re-enable the trigger (just in case)
DROP TRIGGER IF EXISTS tr_sync_vote_stats ON public.votes;
CREATE TRIGGER tr_sync_vote_stats
AFTER INSERT OR UPDATE OR DELETE ON public.votes
FOR EACH ROW EXECUTE FUNCTION public.sync_item_vote_stats();

-- MIGRATION: Recalculate all existing scores to ensure registry integrity
UPDATE public.items i
SET 
  vote_count = (SELECT COUNT(*) FROM public.votes v WHERE v.item_id = i.id),
  score = (
    SELECT COALESCE(SUM(value), 0) FROM public.votes v WHERE v.item_id = i.id
  );
