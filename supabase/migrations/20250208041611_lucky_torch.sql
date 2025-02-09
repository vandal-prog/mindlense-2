DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'has_seen_privacy'
  ) THEN
    ALTER TABLE users ADD COLUMN has_seen_privacy boolean DEFAULT false;
  END IF;
END $$;