-- RPC functions for items

-- List items for a user
CREATE OR REPLACE FUNCTION list_items(p_user_id UUID)
RETURNS SETOF items
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT *
  FROM items
  WHERE user_id = p_user_id
  ORDER BY created_at DESC;
$$;

-- Create a new item (returns the new item ID)
CREATE OR REPLACE FUNCTION create_item(
  p_title TEXT,
  p_description TEXT,
  p_user_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO items (title, description, user_id)
  VALUES (p_title, p_description, p_user_id)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
