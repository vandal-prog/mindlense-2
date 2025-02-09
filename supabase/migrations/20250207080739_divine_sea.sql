/*
  # Initial Schema for MindLens MVP

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `created_at` (timestamp)
      - `risk_level` (text)
    - `sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `category` (text)
      - `created_at` (timestamp)
    - `messages`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key)
      - `content` (text)
      - `type` (text)
      - `created_at` (timestamp)
    - `mood_checks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `score` (integer)
      - `notes` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamptz DEFAULT now(),
  risk_level text DEFAULT 'low'
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

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

-- Sessions table
CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  category text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

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

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

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
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mood_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own mood checks"
  ON mood_checks
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());