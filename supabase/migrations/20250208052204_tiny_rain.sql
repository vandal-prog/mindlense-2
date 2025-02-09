/*
  # Add welcome experience columns
  
  1. Changes
    - Add has_seen_welcome boolean column to users table
    - Add initial_mood jsonb column to users table
  
  2. Security
    - Maintains existing RLS policies
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'has_seen_welcome'
  ) THEN
    ALTER TABLE users ADD COLUMN has_seen_welcome boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'initial_mood'
  ) THEN
    ALTER TABLE users ADD COLUMN initial_mood jsonb;
  END IF;
END $$;

-- Set has_seen_welcome to false for all users to ensure they see the welcome modal
UPDATE users SET has_seen_welcome = false WHERE has_seen_welcome IS NULL;