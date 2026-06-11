-- Demo seed data for Supabase
-- Run this in the Supabase SQL editor (make sure pgcrypto extension is enabled if using gen_random_uuid())

-- Profiles (users) - replace these UUIDs if you already have users
INSERT INTO profiles (id, full_name, role, created_at)
VALUES
  ('11111111-1111-4111-8111-111111111111', 'Alice Admin', 'admin', now()),
  ('22222222-2222-4222-8222-222222222222', 'Manny Manager', 'manager', now()),
  ('33333333-3333-4333-8333-333333333333', 'Mona Member', 'member', now())
ON CONFLICT (id) DO NOTHING;

-- Projects
INSERT INTO projects (id, name, lead, team, deadline, progress, status, priority, description, avatars, created_at)
VALUES
  ('a1111111-1111-4111-8111-aaaaaaaaaaaa', 'Website Redesign', 'Alice Admin', 5, '2026-08-15', 40, 'Development', 'High', 'Redesign of corporate website', ARRAY['AA','MM'], now()),
  ('b2222222-2222-4222-8222-bbbbbbbbbbbb', 'Mobile App', 'Manny Manager', 4, '2026-09-30', 20, 'Planning', 'Medium', 'New native mobile app', ARRAY['MM','MN'], now())
ON CONFLICT (id) DO NOTHING;

-- Tasks
INSERT INTO tasks (id, project_id, title, assignee, priority, status, due_date, progress, metadata, created_at)
VALUES
  ('d1111111-1111-4111-8111-dddddddddddd', 'a1111111-1111-4111-8111-aaaaaaaaaaaa', 'Design hero section', 'Mona Member', 'High', 'In Progress', '2026-06-20', 60, '{}'::jsonb, now()),
  ('d2222222-2222-4222-8222-dddddddddddd', 'b2222222-2222-4222-8222-bbbbbbbbbbbb', 'Define API spec', 'Manny Manager', 'Medium', 'Pending', '2026-07-10', 10, '{}'::jsonb, now())
ON CONFLICT (id) DO NOTHING;

-- Task comments
INSERT INTO task_comments (id, task_id, author, body, created_at)
VALUES
  ('c1111111-1111-4111-8111-cccccccccccc', 'd1111111-1111-4111-8111-dddddddddddd', 'Alice Admin', 'Initial wireframes uploaded.', now()),
  ('c2222222-2222-4222-8222-cccccccccccc', 'd1111111-1111-4111-8111-dddddddddddd', 'Mona Member', 'Reviewing the assets now.', now())
ON CONFLICT (id) DO NOTHING;

-- Notes:
-- 1) If you use Supabase Auth, ensure the `profiles.id` values match real `auth.users.id` values for seeded accounts.
-- 2) Adjust dates/IDs as needed. This file is safe to run multiple times due to ON CONFLICT DO NOTHING.
