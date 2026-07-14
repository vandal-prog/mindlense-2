/*
  # Complete Soleful Database Setup
  This migration sets up the complete database schema for Soleful
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamptz DEFAULT now(),
  risk_level text DEFAULT 'low',
  onboarding_completed boolean DEFAULT false,
  initial_assessment jsonb,
  has_seen_welcome boolean DEFAULT false,
  has_seen_privacy boolean DEFAULT false,
  initial_mood jsonb
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users policies
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

-- Sessions table
CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  category text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on sessions table
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Sessions policies
CREATE POLICY "Users can CRUD own sessions"
  ON sessions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  content text NOT NULL,
  type text NOT NULL CHECK (type IN ('user', 'ai')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Messages policies
CREATE POLICY "Users can CRUD messages in their sessions"
  ON messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sessions 
      WHERE sessions.id = messages.session_id 
      AND sessions.user_id = auth.uid()
    )
  );

-- Mood checks table
CREATE TABLE mood_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 1 AND score <= 10),
  notes text,
  created_at timestamptz DEFAULT now(),
  assessment_data jsonb
);

-- Enable RLS on mood_checks table
ALTER TABLE mood_checks ENABLE ROW LEVEL SECURITY;

-- Mood checks policies
CREATE POLICY "Users can CRUD own mood checks"
  ON mood_checks
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS mood_checks_assessment_data_idx 
  ON mood_checks USING GIN (assessment_data);

CREATE INDEX IF NOT EXISTS mood_checks_user_id_idx 
  ON mood_checks (user_id);

CREATE INDEX IF NOT EXISTS mood_checks_created_at_idx 
  ON mood_checks (created_at DESC);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx 
  ON sessions (user_id);

CREATE INDEX IF NOT EXISTS messages_session_id_idx 
  ON messages (session_id);

-- Create a function to automatically create user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Remove stale profile rows (e.g. orphaned after auth user was deleted)
  DELETE FROM public.users
  WHERE email = NEW.email AND id != NEW.id;

  INSERT INTO public.users (id, email, name, created_at, onboarding_completed, has_seen_welcome, has_seen_privacy)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NOW(),
    false,
    false,
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, users.name);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant necessary permissions for the function
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON public.users TO service_role;

-- Create trigger to automatically create user record
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
