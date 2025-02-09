/*
  # Add assessment data to mood checks

  1. Changes
    - Add `assessment_data` column to `mood_checks` table to store the full assessment responses
    
  2. Details
    - Uses JSONB type to store flexible assessment data structure
    - Allows null values for backward compatibility
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mood_checks' AND column_name = 'assessment_data'
  ) THEN
    ALTER TABLE mood_checks ADD COLUMN assessment_data jsonb;
  END IF;
END $$;