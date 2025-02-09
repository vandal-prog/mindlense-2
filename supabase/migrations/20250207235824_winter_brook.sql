/*
  # Add assessment columns to users table

  1. Changes
    - Add `onboarding_completed` boolean column to users table
    - Add `initial_assessment` JSONB column to users table to store assessment answers
    - Set default value for onboarding_completed to false
    - Make both columns nullable to maintain compatibility with existing data

  2. Security
    - Maintain existing RLS policies
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE users ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'initial_assessment'
  ) THEN
    ALTER TABLE users ADD COLUMN initial_assessment jsonb;
  END IF;
END $$;