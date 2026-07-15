
CREATE EXTENSION IF NOT EXISTS pgcrypto;

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

CREATE TABLE IF NOT EXISTS task_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  author text,
  body text,
  created_at timestamptz DEFAULT now()
);







CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee);
CREATE INDEX IF NOT EXISTS idx_projects_lead ON projects(lead);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'task', 'project')),
  related_id uuid,
  related_type text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE notifications TO authenticated;
DROP POLICY IF EXISTS "Users create own notifications" ON notifications;
CREATE POLICY "Users create own notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users read own notifications" ON notifications;
CREATE POLICY "Users read own notifications" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users update own notifications" ON notifications;
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users delete own notifications" ON notifications;
CREATE POLICY "Users delete own notifications" ON notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel text NOT NULL DEFAULT 'general' CHECK (char_length(channel) BETWEEN 1 AND 80),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body text NOT NULL CHECK (char_length(trim(body)) BETWEEN 1 AND 4000),
  created_at timestamptz NOT NULL DEFAULT now(),
  edited_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_chat_messages_channel_created ON chat_messages(channel, created_at DESC);
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE chat_messages TO authenticated;
CREATE OR REPLACE FUNCTION can_access_chat_channel(channel_name text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  project_uuid uuid;
BEGIN
  IF lower(trim(channel_name)) = 'general' THEN
    RETURN true;
  END IF;
  IF channel_name !~ '^project:[0-9a-fA-F-]{36}$' THEN
    RETURN false;
  END IF;
  project_uuid := split_part(channel_name, ':', 2)::uuid;
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND lower(role) = 'admin'
  ) OR EXISTS (
    SELECT 1 FROM projects WHERE id = project_uuid AND manager_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM project_members WHERE project_id = project_uuid AND user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1
    FROM tasks
    JOIN task_assignees ON task_assignees.task_id = tasks.id
    WHERE tasks.project_id = project_uuid AND task_assignees.user_id = auth.uid()
  );
EXCEPTION WHEN invalid_text_representation THEN
  RETURN false;
END;
$$;
GRANT EXECUTE ON FUNCTION can_access_chat_channel(text) TO authenticated;
DROP POLICY IF EXISTS "Authenticated users read chat" ON chat_messages;
CREATE POLICY "Authenticated users read chat" ON chat_messages FOR SELECT TO authenticated USING (can_access_chat_channel(channel));
DROP POLICY IF EXISTS "Users send own messages" ON chat_messages;
CREATE POLICY "Users send own messages" ON chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND can_access_chat_channel(channel));
DROP POLICY IF EXISTS "Users update own messages" ON chat_messages;
CREATE POLICY "Users update own messages" ON chat_messages FOR UPDATE TO authenticated USING (auth.uid() = user_id AND can_access_chat_channel(channel)) WITH CHECK (auth.uid() = user_id AND can_access_chat_channel(channel));
DROP POLICY IF EXISTS "Users delete own messages" ON chat_messages;
CREATE POLICY "Users delete own messages" ON chat_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS chat_mentions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  mentioned_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (message_id, mentioned_user_id)
);
ALTER TABLE task_comments ALTER COLUMN task_id SET NOT NULL;
ALTER TABLE task_comments ALTER COLUMN body SET NOT NULL;
ALTER TABLE task_comments ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES profiles(id) ON DELETE SET NULL DEFAULT auth.uid();
ALTER TABLE task_comments ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES task_comments(id) ON DELETE CASCADE;
ALTER TABLE task_comments ADD COLUMN IF NOT EXISTS attachment_name text;
ALTER TABLE task_comments ADD COLUMN IF NOT EXISTS attachment_url text;
ALTER TABLE task_comments ADD COLUMN IF NOT EXISTS edited_at timestamptz;

CREATE TABLE IF NOT EXISTS task_comment_reactions (
  comment_id uuid NOT NULL REFERENCES task_comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  emoji text NOT NULL CHECK (char_length(emoji) BETWEEN 1 AND 16),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (comment_id, user_id, emoji)
);

CREATE TABLE IF NOT EXISTS task_comment_mentions (
  comment_id uuid NOT NULL REFERENCES task_comments(id) ON DELETE CASCADE,
  mentioned_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (comment_id, mentioned_user_id)
);

CREATE INDEX IF NOT EXISTS idx_task_comments_task_created ON task_comments(task_id, created_at);
CREATE INDEX IF NOT EXISTS idx_task_comments_parent ON task_comments(parent_id);

CREATE OR REPLACE FUNCTION can_access_task(target_task_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM tasks t
    WHERE t.id = target_task_id
      AND (
        t.created_by = auth.uid()
        OR t.assignee_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND lower(trim(p.role)) IN ('admin', 'administrator'))
        OR EXISTS (SELECT 1 FROM task_assignees ta WHERE ta.task_id = t.id AND ta.user_id = auth.uid())
        OR (t.project_id IS NOT NULL AND can_access_chat_channel('project:' || t.project_id::text))
      )
  );
$$;

CREATE OR REPLACE FUNCTION can_moderate_task(target_task_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT can_access_task(target_task_id)
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND lower(trim(p.role)) IN ('admin', 'administrator', 'manager', 'team manager')
    );
$$;

ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comment_mentions ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON task_comments, task_comment_reactions, task_comment_mentions TO authenticated;

DROP POLICY IF EXISTS "Task participants read comments" ON task_comments;
CREATE POLICY "Task participants read comments" ON task_comments FOR SELECT TO authenticated USING (can_access_task(task_id));
DROP POLICY IF EXISTS "Task participants create comments" ON task_comments;
CREATE POLICY "Task participants create comments" ON task_comments FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid() AND can_access_task(task_id));
DROP POLICY IF EXISTS "Authors and moderators update comments" ON task_comments;
CREATE POLICY "Authors and moderators update comments" ON task_comments FOR UPDATE TO authenticated USING (author_id = auth.uid() OR can_moderate_task(task_id)) WITH CHECK (author_id = auth.uid() OR can_moderate_task(task_id));
DROP POLICY IF EXISTS "Authors and moderators delete comments" ON task_comments;
CREATE POLICY "Authors and moderators delete comments" ON task_comments FOR DELETE TO authenticated USING (author_id = auth.uid() OR can_moderate_task(task_id));

DROP POLICY IF EXISTS "Task participants read reactions" ON task_comment_reactions;
CREATE POLICY "Task participants read reactions" ON task_comment_reactions FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM task_comments c WHERE c.id = comment_id AND can_access_task(c.task_id)));
DROP POLICY IF EXISTS "Users manage own task reactions" ON task_comment_reactions;
CREATE POLICY "Users manage own task reactions" ON task_comment_reactions FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM task_comments c WHERE c.id = comment_id AND can_access_task(c.task_id)));

DROP POLICY IF EXISTS "Task participants read mentions" ON task_comment_mentions;
CREATE POLICY "Task participants read mentions" ON task_comment_mentions FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM task_comments c WHERE c.id = comment_id AND can_access_task(c.task_id)));
DROP POLICY IF EXISTS "Comment authors create mentions" ON task_comment_mentions;
CREATE POLICY "Comment authors create mentions" ON task_comment_mentions FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM task_comments c WHERE c.id = comment_id AND c.author_id = auth.uid()));

CREATE OR REPLACE FUNCTION notify_task_comment_mention()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  comment_row task_comments%ROWTYPE;
  task_title text;
  actor_name text;
BEGIN
  SELECT * INTO comment_row FROM task_comments WHERE id = NEW.comment_id;
  SELECT title INTO task_title FROM tasks WHERE id = comment_row.task_id;
  SELECT full_name INTO actor_name FROM profiles WHERE id = comment_row.author_id;
  IF NEW.mentioned_user_id <> comment_row.author_id THEN
    INSERT INTO notifications (user_id, title, message, type, related_id, related_type)
    VALUES (NEW.mentioned_user_id, 'Mentioned in a task discussion', coalesce(actor_name, 'A teammate') || ' mentioned you on ' || coalesce(task_title, 'a task'), 'task', comment_row.task_id, 'task');
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS on_task_comment_mention_notify ON task_comment_mentions;
CREATE TRIGGER on_task_comment_mention_notify AFTER INSERT ON task_comment_mentions FOR EACH ROW EXECUTE FUNCTION notify_task_comment_mention();
CREATE INDEX IF NOT EXISTS idx_chat_mentions_user ON chat_mentions(mentioned_user_id, created_at DESC);
ALTER TABLE chat_mentions ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, DELETE ON TABLE chat_mentions TO authenticated;
DROP POLICY IF EXISTS "Users view relevant mentions" ON chat_mentions;
CREATE POLICY "Users view relevant mentions" ON chat_mentions FOR SELECT TO authenticated USING (
  mentioned_user_id = auth.uid() OR EXISTS (SELECT 1 FROM chat_messages WHERE id = message_id AND user_id = auth.uid())
);
DROP POLICY IF EXISTS "Message authors create mentions" ON chat_mentions;
CREATE POLICY "Message authors create mentions" ON chat_mentions FOR INSERT TO authenticated WITH CHECK (
  mentioned_user_id <> auth.uid() AND EXISTS (SELECT 1 FROM chat_messages WHERE id = message_id AND user_id = auth.uid())
);
DROP POLICY IF EXISTS "Message authors remove mentions" ON chat_mentions;
CREATE POLICY "Message authors remove mentions" ON chat_mentions FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM chat_messages WHERE id = message_id AND user_id = auth.uid())
);

CREATE OR REPLACE FUNCTION notify_chat_mention()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sender_name text;
  message_text text;
BEGIN
  SELECT coalesce(p.full_name, 'A team member'), m.body
  INTO sender_name, message_text
  FROM chat_messages m
  LEFT JOIN profiles p ON p.id = m.user_id
  WHERE m.id = NEW.message_id;
  INSERT INTO notifications (user_id, title, message, type, related_id, related_type)
  VALUES (NEW.mentioned_user_id, sender_name || ' mentioned you', left(message_text, 240), 'info', NEW.message_id, 'chat_message');
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS on_chat_mention_notify ON chat_mentions;
CREATE TRIGGER on_chat_mention_notify
AFTER INSERT ON chat_mentions
FOR EACH ROW EXECUTE FUNCTION notify_chat_mention();

CREATE TABLE IF NOT EXISTS repository_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL DEFAULT 'github' CHECK (provider IN ('github', 'gitlab', 'bitbucket')),
  external_id text NOT NULL,
  name text NOT NULL,
  full_name text NOT NULL,
  html_url text NOT NULL,
  default_branch text,
  is_private boolean NOT NULL DEFAULT false,
  language text,
  connected_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  synced_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (connected_by, provider, external_id)
);
CREATE INDEX IF NOT EXISTS idx_repository_integrations_project ON repository_integrations(project_id);
ALTER TABLE repository_integrations ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE repository_integrations TO authenticated;
DROP POLICY IF EXISTS "Users manage own repositories" ON repository_integrations;
CREATE POLICY "Users manage own repositories" ON repository_integrations FOR ALL TO authenticated USING (auth.uid() = connected_by) WITH CHECK (auth.uid() = connected_by);

ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS health text DEFAULT 'On track' CHECK (health IN ('On track', 'At risk', 'Off track'));
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget numeric(14,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS estimated_hours numeric(10,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS archived_at timestamptz;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS parent_task_id uuid REFERENCES tasks(id) ON DELETE CASCADE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS estimate_hours numeric(8,2);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS actual_hours numeric(8,2) DEFAULT 0;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS blocked_reason text;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurring_rule jsonb;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed_at timestamptz;
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS parent_message_id uuid REFERENCES chat_messages(id) ON DELETE CASCADE;
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

CREATE TABLE IF NOT EXISTS task_dependencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  depends_on_task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (task_id, depends_on_task_id),
  CHECK (task_id <> depends_on_task_id)
);

CREATE TABLE IF NOT EXISTS task_watchers (
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (task_id, user_id)
);

CREATE TABLE IF NOT EXISTS time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  minutes integer NOT NULL CHECK (minutes > 0 AND minutes <= 1440),
  entry_date date NOT NULL DEFAULT current_date,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS work_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  record_type text NOT NULL CHECK (record_type IN ('task', 'project', 'goal', 'chat')),
  record_id uuid NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size bigint,
  mime_type text,
  uploaded_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date date,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Missed')),
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS project_status_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  health text NOT NULL CHECK (health IN ('On track', 'At risk', 'Off track')),
  summary text NOT NULL,
  accomplishments text,
  blockers text,
  next_steps text,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_reactions (
  message_id uuid NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  emoji text NOT NULL CHECK (char_length(emoji) BETWEEN 1 AND 16),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (message_id, user_id, emoji)
);

CREATE TABLE IF NOT EXISTS goal_key_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  title text NOT NULL,
  start_value numeric NOT NULL DEFAULT 0,
  current_value numeric NOT NULL DEFAULT 0,
  target_value numeric NOT NULL DEFAULT 100 CHECK (target_value <> start_value),
  unit text DEFAULT '%',
  owner_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activity_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES profiles(id) ON DELETE SET NULL DEFAULT auth.uid(),
  action text NOT NULL,
  record_type text NOT NULL,
  record_id uuid,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saved_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  name text NOT NULL,
  page text NOT NULL,
  filters jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_shared boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, page, name)
);

CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  email_enabled boolean NOT NULL DEFAULT true,
  push_enabled boolean NOT NULL DEFAULT true,
  task_updates boolean NOT NULL DEFAULT true,
  project_updates boolean NOT NULL DEFAULT true,
  mentions boolean NOT NULL DEFAULT true,
  weekly_digest boolean NOT NULL DEFAULT false,
  quiet_hours jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS automation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  trigger_type text NOT NULL,
  trigger_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  action_type text NOT NULL,
  action_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  enabled boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  goal text,
  start_date date NOT NULL,
  end_date date NOT NULL CHECK (end_date >= start_date),
  status text NOT NULL DEFAULT 'Planning' CHECK (status IN ('Planning', 'Active', 'Completed')),
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS sprint_id uuid REFERENCES sprints(id) ON DELETE SET NULL;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS story_points numeric(6,2) NOT NULL DEFAULT 1 CHECK (story_points >= 0);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS estimated_hours numeric(8,2) CHECK (estimated_hours >= 0);

CREATE TABLE IF NOT EXISTS sprint_members (
  sprint_id uuid NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  capacity_hours numeric(8,2) NOT NULL DEFAULT 40 CHECK (capacity_hours >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (sprint_id, user_id)
);

CREATE TABLE IF NOT EXISTS sprint_standups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id uuid NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  standup_date date NOT NULL DEFAULT current_date,
  completed text,
  planned text,
  blockers text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (sprint_id, user_id, standup_date)
);

CREATE TABLE IF NOT EXISTS releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  repository_id uuid REFERENCES repository_integrations(id) ON DELETE SET NULL,
  sprint_id uuid REFERENCES sprints(id) ON DELETE SET NULL,
  version text NOT NULL,
  name text NOT NULL,
  release_notes text,
  target_date date,
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Ready', 'Deploying', 'Released', 'Failed', 'Rolled back')),
  rollback_plan text,
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  released_at timestamptz,
  UNIQUE (project_id, version)
);

CREATE TABLE IF NOT EXISTS release_tasks (
  release_id uuid NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  commit_url text,
  pull_request_url text,
  added_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (release_id, task_id)
);

CREATE TABLE IF NOT EXISTS release_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id uuid NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  label text NOT NULL,
  required boolean NOT NULL DEFAULT true,
  is_complete boolean NOT NULL DEFAULT false,
  completed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS release_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id uuid NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  environment text NOT NULL CHECK (environment IN ('development', 'staging', 'production')),
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  approved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  note text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (release_id, environment)
);

CREATE TABLE IF NOT EXISTS deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id uuid NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  environment text NOT NULL CHECK (environment IN ('development', 'staging', 'production')),
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In progress', 'Succeeded', 'Failed', 'Rolled back')),
  deployment_url text,
  commit_sha text,
  incident_url text,
  started_at timestamptz,
  finished_at timestamptz,
  deployed_by uuid REFERENCES profiles(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_releases_project_date ON releases(project_id, target_date DESC);
CREATE INDEX IF NOT EXISTS idx_deployments_release_created ON deployments(release_id, created_at DESC);

CREATE OR REPLACE FUNCTION can_manage_release(target_release_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM releases r WHERE r.id = target_release_id AND can_manage_project_sprints(r.project_id));
$$;

ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE release_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE release_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE release_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON releases, release_tasks, release_checks, release_approvals, deployments TO authenticated;

DROP POLICY IF EXISTS "Project participants view releases" ON releases;
CREATE POLICY "Project participants view releases" ON releases FOR SELECT TO authenticated USING (can_access_chat_channel('project:' || project_id::text));
DROP POLICY IF EXISTS "Leaders create releases" ON releases;
CREATE POLICY "Leaders create releases" ON releases FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid() AND can_manage_project_sprints(project_id));
DROP POLICY IF EXISTS "Leaders update releases" ON releases;
CREATE POLICY "Leaders update releases" ON releases FOR UPDATE TO authenticated USING (can_manage_release(id)) WITH CHECK (can_manage_project_sprints(project_id));
DROP POLICY IF EXISTS "Leaders delete releases" ON releases;
CREATE POLICY "Leaders delete releases" ON releases FOR DELETE TO authenticated USING (can_manage_release(id));

DROP POLICY IF EXISTS "Participants view release tasks" ON release_tasks;
CREATE POLICY "Participants view release tasks" ON release_tasks FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM releases r WHERE r.id = release_id AND can_access_chat_channel('project:' || r.project_id::text)));
DROP POLICY IF EXISTS "Leaders manage release tasks" ON release_tasks;
CREATE POLICY "Leaders manage release tasks" ON release_tasks FOR ALL TO authenticated USING (can_manage_release(release_id)) WITH CHECK (can_manage_release(release_id));

DROP POLICY IF EXISTS "Participants view release checks" ON release_checks;
CREATE POLICY "Participants view release checks" ON release_checks FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM releases r WHERE r.id = release_id AND can_access_chat_channel('project:' || r.project_id::text)));
DROP POLICY IF EXISTS "Leaders create release checks" ON release_checks;
CREATE POLICY "Leaders create release checks" ON release_checks FOR INSERT TO authenticated WITH CHECK (can_manage_release(release_id));
DROP POLICY IF EXISTS "Participants complete release checks" ON release_checks;
CREATE POLICY "Participants complete release checks" ON release_checks FOR UPDATE TO authenticated USING (completed_by IS NULL OR completed_by = auth.uid() OR can_manage_release(release_id)) WITH CHECK (completed_by = auth.uid() OR completed_by IS NULL OR can_manage_release(release_id));
DROP POLICY IF EXISTS "Leaders delete release checks" ON release_checks;
CREATE POLICY "Leaders delete release checks" ON release_checks FOR DELETE TO authenticated USING (can_manage_release(release_id));

DROP POLICY IF EXISTS "Participants view approvals" ON release_approvals;
CREATE POLICY "Participants view approvals" ON release_approvals FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM releases r WHERE r.id = release_id AND can_access_chat_channel('project:' || r.project_id::text)));
DROP POLICY IF EXISTS "Leaders manage approvals" ON release_approvals;
CREATE POLICY "Leaders manage approvals" ON release_approvals FOR ALL TO authenticated USING (can_manage_release(release_id)) WITH CHECK (can_manage_release(release_id));

DROP POLICY IF EXISTS "Participants view deployments" ON deployments;
CREATE POLICY "Participants view deployments" ON deployments FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM releases r WHERE r.id = release_id AND can_access_chat_channel('project:' || r.project_id::text)));
DROP POLICY IF EXISTS "Leaders manage deployments" ON deployments;
CREATE POLICY "Leaders manage deployments" ON deployments FOR ALL TO authenticated USING (can_manage_release(release_id)) WITH CHECK (can_manage_release(release_id));

CREATE INDEX IF NOT EXISTS idx_sprints_project_status ON sprints(project_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_sprint ON tasks(sprint_id);
CREATE INDEX IF NOT EXISTS idx_standups_sprint_date ON sprint_standups(sprint_id, standup_date DESC);

CREATE OR REPLACE FUNCTION can_manage_sprint(target_sprint_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM sprints s
    JOIN projects p ON p.id = s.project_id
    WHERE s.id = target_sprint_id
      AND (
        p.manager_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles me WHERE me.id = auth.uid() AND lower(trim(me.role)) IN ('admin', 'administrator'))
      )
  );
$$;

CREATE OR REPLACE FUNCTION can_manage_project_sprints(target_project_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = target_project_id
      AND (
        p.manager_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles me WHERE me.id = auth.uid() AND lower(trim(me.role)) IN ('admin', 'administrator'))
      )
  );
$$;

ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprint_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprint_standups ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON sprints, sprint_members, sprint_standups TO authenticated;

DROP POLICY IF EXISTS "Project participants view sprints" ON sprints;
CREATE POLICY "Project participants view sprints" ON sprints FOR SELECT TO authenticated USING (can_access_chat_channel('project:' || project_id::text));
DROP POLICY IF EXISTS "Leaders create sprints" ON sprints;
CREATE POLICY "Leaders create sprints" ON sprints FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid() AND can_manage_project_sprints(project_id));
DROP POLICY IF EXISTS "Leaders update sprints" ON sprints;
CREATE POLICY "Leaders update sprints" ON sprints FOR UPDATE TO authenticated USING (can_manage_sprint(id)) WITH CHECK (can_manage_project_sprints(project_id));
DROP POLICY IF EXISTS "Leaders delete sprints" ON sprints;
CREATE POLICY "Leaders delete sprints" ON sprints FOR DELETE TO authenticated USING (can_manage_sprint(id));

DROP POLICY IF EXISTS "Participants view sprint capacity" ON sprint_members;
CREATE POLICY "Participants view sprint capacity" ON sprint_members FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM sprints s WHERE s.id = sprint_id AND can_access_chat_channel('project:' || s.project_id::text)));
DROP POLICY IF EXISTS "Leaders manage sprint capacity" ON sprint_members;
CREATE POLICY "Leaders manage sprint capacity" ON sprint_members FOR ALL TO authenticated USING (can_manage_sprint(sprint_id)) WITH CHECK (can_manage_sprint(sprint_id));

DROP POLICY IF EXISTS "Participants view standups" ON sprint_standups;
CREATE POLICY "Participants view standups" ON sprint_standups FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM sprints s WHERE s.id = sprint_id AND can_access_chat_channel('project:' || s.project_id::text)));
DROP POLICY IF EXISTS "Users manage own standups" ON sprint_standups;
CREATE POLICY "Users manage own standups" ON sprint_standups FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM sprints s WHERE s.id = sprint_id AND can_access_chat_channel('project:' || s.project_id::text)));

CREATE INDEX IF NOT EXISTS idx_tasks_parent ON tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_task_dependencies_task ON task_dependencies(task_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_task_date ON time_entries(task_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_attachments_record ON work_attachments(record_type, record_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project ON project_milestones(project_id, due_date);
CREATE INDEX IF NOT EXISTS idx_project_updates_project ON project_status_updates(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_parent ON chat_messages(parent_message_id);
CREATE INDEX IF NOT EXISTS idx_activity_project_created ON activity_events(project_id, created_at DESC);

ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_watchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_status_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_key_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON task_dependencies, task_watchers, time_entries, work_attachments, project_milestones, project_status_updates, chat_reactions, goal_key_results, activity_events, saved_views, notification_preferences, automation_rules TO authenticated;

DROP POLICY IF EXISTS "Authenticated work access" ON task_dependencies;
CREATE POLICY "Authenticated work access" ON task_dependencies FOR ALL TO authenticated USING (true) WITH CHECK (created_by = auth.uid());
DROP POLICY IF EXISTS "Authenticated watcher access" ON task_watchers;
CREATE POLICY "Authenticated watcher access" ON task_watchers FOR ALL TO authenticated USING (true) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Users manage time entries" ON time_entries;
CREATE POLICY "Users manage time entries" ON time_entries FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Authenticated attachment access" ON work_attachments;
CREATE POLICY "Authenticated attachment access" ON work_attachments FOR ALL TO authenticated USING (true) WITH CHECK (uploaded_by = auth.uid());
DROP POLICY IF EXISTS "Authenticated milestone access" ON project_milestones;
CREATE POLICY "Authenticated milestone access" ON project_milestones FOR ALL TO authenticated USING (can_access_chat_channel('project:' || project_id::text)) WITH CHECK (can_access_chat_channel('project:' || project_id::text));
DROP POLICY IF EXISTS "Authenticated project update access" ON project_status_updates;
CREATE POLICY "Authenticated project update access" ON project_status_updates FOR ALL TO authenticated USING (can_access_chat_channel('project:' || project_id::text)) WITH CHECK (can_access_chat_channel('project:' || project_id::text));
DROP POLICY IF EXISTS "Authenticated reaction access" ON chat_reactions;
CREATE POLICY "Authenticated reaction access" ON chat_reactions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Users manage own reactions" ON chat_reactions;
CREATE POLICY "Users manage own reactions" ON chat_reactions FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Authenticated key result access" ON goal_key_results;
CREATE POLICY "Authenticated key result access" ON goal_key_results FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated key result management" ON goal_key_results;
CREATE POLICY "Authenticated key result management" ON goal_key_results FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
      AND lower(trim(role)) IN ('admin', 'administrator', 'manager', 'team manager')
  )
);
DROP POLICY IF EXISTS "Owners update key results" ON goal_key_results;
CREATE POLICY "Owners update key results" ON goal_key_results FOR UPDATE TO authenticated USING (
  owner_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
      AND lower(trim(role)) IN ('admin', 'administrator', 'manager', 'team manager')
  )
) WITH CHECK (
  owner_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
      AND lower(trim(role)) IN ('admin', 'administrator', 'manager', 'team manager')
  )
);
DROP POLICY IF EXISTS "Authenticated activity access" ON activity_events;
CREATE POLICY "Authenticated activity access" ON activity_events FOR SELECT TO authenticated USING (
  actor_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND lower(trim(role)) IN ('admin', 'administrator')
  )
  OR (project_id IS NOT NULL AND can_access_chat_channel('project:' || project_id::text))
);
DROP POLICY IF EXISTS "Users create activity" ON activity_events;
CREATE POLICY "Users create activity" ON activity_events FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid());

CREATE OR REPLACE FUNCTION capture_workspace_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row_data jsonb;
  event_project_id uuid;
  event_record_id uuid;
BEGIN
  row_data := CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(NEW) END;
  event_record_id := NULLIF(row_data->>'id', '')::uuid;
  IF TG_TABLE_NAME = 'projects' AND TG_OP <> 'DELETE' THEN
    event_project_id := event_record_id;
  ELSIF TG_TABLE_NAME = 'task_comments' AND NULLIF(row_data->>'task_id', '') IS NOT NULL THEN
    SELECT project_id INTO event_project_id FROM tasks WHERE id = (row_data->>'task_id')::uuid;
  ELSIF TG_TABLE_NAME IN ('sprint_members', 'sprint_standups') AND NULLIF(row_data->>'sprint_id', '') IS NOT NULL THEN
    SELECT project_id INTO event_project_id FROM sprints WHERE id = (row_data->>'sprint_id')::uuid;
  ELSIF TG_TABLE_NAME IN ('release_tasks', 'release_checks', 'release_approvals', 'deployments') AND NULLIF(row_data->>'release_id', '') IS NOT NULL THEN
    SELECT project_id INTO event_project_id FROM releases WHERE id = (row_data->>'release_id')::uuid;
  ELSIF row_data ? 'project_id' AND NULLIF(row_data->>'project_id', '') IS NOT NULL THEN
    event_project_id := (row_data->>'project_id')::uuid;
  END IF;

  INSERT INTO activity_events (actor_id, action, record_type, record_id, project_id, metadata)
  VALUES (
    auth.uid(),
    lower(TG_OP),
    TG_TABLE_NAME,
    event_record_id,
    event_project_id,
    jsonb_strip_nulls(jsonb_build_object(
      'title', row_data->>'title',
      'name', row_data->>'name',
      'status', row_data->>'status',
      'priority', row_data->>'priority'
      ,'body', left(row_data->>'body', 180)
    ))
  );
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$;

DROP TRIGGER IF EXISTS capture_project_activity ON projects;
CREATE TRIGGER capture_project_activity AFTER INSERT OR UPDATE OR DELETE ON projects FOR EACH ROW EXECUTE FUNCTION capture_workspace_activity();
DROP TRIGGER IF EXISTS capture_task_activity ON tasks;
CREATE TRIGGER capture_task_activity AFTER INSERT OR UPDATE OR DELETE ON tasks FOR EACH ROW EXECUTE FUNCTION capture_workspace_activity();
DROP TRIGGER IF EXISTS capture_goal_activity ON goals;
CREATE TRIGGER capture_goal_activity AFTER INSERT OR UPDATE OR DELETE ON goals FOR EACH ROW EXECUTE FUNCTION capture_workspace_activity();
DROP TRIGGER IF EXISTS capture_repository_activity ON repository_integrations;
CREATE TRIGGER capture_repository_activity AFTER INSERT OR UPDATE OR DELETE ON repository_integrations FOR EACH ROW EXECUTE FUNCTION capture_workspace_activity();
DROP TRIGGER IF EXISTS capture_task_comment_activity ON task_comments;
CREATE TRIGGER capture_task_comment_activity AFTER INSERT OR UPDATE OR DELETE ON task_comments FOR EACH ROW EXECUTE FUNCTION capture_workspace_activity();
DROP TRIGGER IF EXISTS capture_sprint_activity ON sprints;
CREATE TRIGGER capture_sprint_activity AFTER INSERT OR UPDATE OR DELETE ON sprints FOR EACH ROW EXECUTE FUNCTION capture_workspace_activity();
DROP TRIGGER IF EXISTS capture_sprint_standup_activity ON sprint_standups;
CREATE TRIGGER capture_sprint_standup_activity AFTER INSERT OR UPDATE OR DELETE ON sprint_standups FOR EACH ROW EXECUTE FUNCTION capture_workspace_activity();
DROP TRIGGER IF EXISTS capture_release_activity ON releases;
CREATE TRIGGER capture_release_activity AFTER INSERT OR UPDATE OR DELETE ON releases FOR EACH ROW EXECUTE FUNCTION capture_workspace_activity();
DROP TRIGGER IF EXISTS capture_deployment_activity ON deployments;
CREATE TRIGGER capture_deployment_activity AFTER INSERT OR UPDATE OR DELETE ON deployments FOR EACH ROW EXECUTE FUNCTION capture_workspace_activity();

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'task_comments') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE task_comments;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'task_comment_reactions') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE task_comment_reactions;
  END IF;
END;
$$;
DROP POLICY IF EXISTS "Users manage saved views" ON saved_views;
CREATE POLICY "Users manage saved views" ON saved_views FOR ALL TO authenticated USING (user_id = auth.uid() OR is_shared) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Users manage notification preferences" ON notification_preferences;
CREATE POLICY "Users manage notification preferences" ON notification_preferences FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Rule creators manage automations" ON automation_rules;
CREATE POLICY "Rule creators manage automations" ON automation_rules FOR ALL TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
