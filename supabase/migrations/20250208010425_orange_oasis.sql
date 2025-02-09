/*
  # Add index for assessment data queries

  1. Changes
    - Add GIN index on assessment_data column for efficient JSON querying
    
  2. Details
    - Uses GIN index type which is optimized for JSONB data
    - Helps with querying specific assessment answers and patterns
*/

CREATE INDEX IF NOT EXISTS mood_checks_assessment_data_idx 
  ON mood_checks USING GIN (assessment_data);