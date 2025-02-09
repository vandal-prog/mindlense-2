/*
  # Clean up welcome experience columns
  
  1. Changes
    - Add has_seen_welcome boolean column to users table
    - Add initial_mood jsonb column to users table
    - Set default values for existing users
  
  2. Security
    - Maintains existing RLS policies
*/

DO $$ 
BEGIN
  -- Drop columns if they exist to ensure clean state
  ALTER TABLE users DROP COLUMN IF EXISTS has_seen_welcome;
  ALTER TABLE users DROP COLUMN IF EXISTS initial_mood;

  -- Add columns with proper defaults
  ALTER TABLE users ADD COLUMN has_seen_welcome boolean DEFAULT false;
  ALTER TABLE users ADD COLUMN initial_mood jsonb;
END $$;

-- Ensure all users will see the welcome modal
UPDATE users SET has_seen_welcome = false;