/*
  # Add welcome flag to users table
  
  1. Changes
    - Add has_seen_welcome boolean column to users table
    - Set default value to false for new users
*/

-- Add has_seen_welcome column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'has_seen_welcome'
  ) THEN
    ALTER TABLE users ADD COLUMN has_seen_welcome boolean DEFAULT false;
  END IF;
END $$;

-- Update existing users to have has_seen_welcome set to false
UPDATE users SET has_seen_welcome = false WHERE has_seen_welcome IS NULL;