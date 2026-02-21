-- Add user_id columns
ALTER TABLE items ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE votes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- Create Claim Function
CREATE OR REPLACE FUNCTION claim_session_history(
    p_session_id TEXT,
    p_user_id UUID
)
RETURNS TABLE (
    votes_updated BIGINT,
    reviews_updated BIGINT,
    items_updated BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_votes_count BIGINT;
    v_reviews_count BIGINT;
    v_items_count BIGINT;
BEGIN
    -- update votes
    WITH updated_votes AS (
        UPDATE votes
        SET user_id = p_user_id
        WHERE session_id = p_session_id AND user_id IS NULL
        RETURNING 1
    )
    SELECT COUNT(*) INTO v_votes_count FROM updated_votes;

    -- update reviews
    WITH updated_reviews AS (
        UPDATE reviews
        SET user_id = p_user_id
        WHERE session_id = p_session_id AND user_id IS NULL
        RETURNING 1
    )
    SELECT COUNT(*) INTO v_reviews_count FROM updated_reviews;

    -- update items (submissions)
    WITH updated_items AS (
        UPDATE items
        SET user_id = p_user_id
        WHERE session_id = p_session_id AND user_id IS NULL
        RETURNING 1
    )
    SELECT COUNT(*) INTO v_items_count FROM updated_items;

    RETURN QUERY SELECT v_votes_count, v_reviews_count, v_items_count;
END;
$$;
