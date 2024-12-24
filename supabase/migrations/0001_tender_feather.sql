/*
  # Initial Schema Setup

  1. New Tables
    - `daily_entries`
      - `id` (uuid, primary key)
      - `date` (date)
      - `topics` (text)
      - `participants` (text[])
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `tasks`
      - `id` (uuid, primary key)
      - `text` (text)
      - `type` (text)
      - `content` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `resources`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `type` (text)
      - `url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `discussions`
      - `id` (uuid, primary key)
      - `question` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `answers`
      - `id` (uuid, primary key)
      - `discussion_id` (uuid, foreign key)
      - `content` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
*/

-- Drop existing tables in reverse order of dependencies
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS discussions CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS daily_entries CASCADE;

-- Daily Entries Table
CREATE TABLE daily_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  topics text NOT NULL,
  participants text[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for daily_entries" ON daily_entries FOR ALL USING (true) WITH CHECK (true);

-- Tasks Table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  type text NOT NULL CHECK (type IN ('coding', 'text', 'image', 'link')),
  content text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);

-- Resources Table
CREATE TABLE resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('document', 'link', 'video')),
  url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for resources" ON resources FOR ALL USING (true) WITH CHECK (true);

-- Discussions Table
CREATE TABLE discussions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for discussions" ON discussions FOR ALL USING (true) WITH CHECK (true);

-- Answers Table
CREATE TABLE answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id uuid REFERENCES discussions(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for answers" ON answers FOR ALL USING (true) WITH CHECK (true);

-- Create storage bucket for task images
INSERT INTO storage.buckets (id, name, public)
VALUES ('tasks', 'tasks', true);

-- Enable public access to the bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'tasks');

-- Allow uploads to the bucket
CREATE POLICY "Allow Uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'tasks');