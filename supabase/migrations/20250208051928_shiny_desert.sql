/*
  # Add welcome and mood tracking columns
  
  1. Changes
    - Add has_seen_welcome boolean column to users table
    - Add initial_mood jsonb column to users table to store first mood selection
  
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

-- Update existing users to have has_seen_welcome set to false
UPDATE users SET has_seen_welcome = false WHERE has_seen_welcome IS NULL;