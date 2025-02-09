/*
  # Update user table RLS policies
  
  1. Changes
    - Add policy for inserting new users during signup
    - Add policy for upsert operations
  
  2. Security
    - Maintains existing read/update policies
    - Adds controlled insert/upsert capabilities
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create comprehensive policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable upsert for users"
  ON users
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow public access for initial user creation during signup
CREATE POLICY "Allow public insert during signup"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (auth.uid() = id);