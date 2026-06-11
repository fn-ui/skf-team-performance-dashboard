-- Supabase schema for projects, tasks, and task_comments

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  lead text,
  team int,
  deadline date,
  progress int DEFAULT 0,
  status text DEFAULT 'Active',
  priority text,
  description text,
  avatars text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  title text NOT NULL,
  assignee text,
  priority text,
  status text DEFAULT 'Pending',
  due_date date,
  progress int DEFAULT 0,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Task comments (simple denormalized comments table)
CREATE TABLE IF NOT EXISTS task_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  author text,
  body text,
  created_at timestamptz DEFAULT now()
);

-- Example RLS policies (adjust to your auth setup)
-- Note: Replace `profiles` and `role` checks with your actual profile structure.

-- Enable RLS on projects/tasks if you plan to use row-level security
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert and select their own tasks (example using auth.uid())
-- CREATE POLICY "Allow authenticated select on tasks" ON tasks
--   FOR SELECT USING (true);

-- CREATE POLICY "Insert tasks for authenticated users" ON tasks
--   FOR INSERT WITH CHECK (auth.role() IN ('admin','manager','member'));

-- Admin full access policy (example)
-- CREATE POLICY "Admins can modify all" ON tasks
--   USING (auth.role() = 'admin')
--   WITH CHECK (auth.role() = 'admin');

-- Customize policies according to your app's authorization model.

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee);
CREATE INDEX IF NOT EXISTS idx_projects_lead ON projects(lead);
