/*
  # Add has_seen_privacy column to users table

  1. Changes
    - Add has_seen_privacy boolean column to users table with default false
    - Safe migration using IF NOT EXISTS check
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'has_seen_privacy'
  ) THEN
    ALTER TABLE users ADD COLUMN has_seen_privacy boolean DEFAULT false;
  END IF;
END $$;