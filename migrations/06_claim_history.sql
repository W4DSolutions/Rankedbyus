-- Create a function to claim history
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
