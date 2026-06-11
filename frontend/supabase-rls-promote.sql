-- Supabase: Promote user to admin + recommended RLS policies + audit logging
-- Run these statements in the Supabase SQL editor (use the SQL/SQL editor in the dashboard).

-- 1) (Optional) Inspect the auth user id for an email
-- Replace the email below as needed
SELECT id, email FROM auth.users WHERE email = 'admin@gmail.com';

-- 2) Ensure a `profiles` row exists for that auth user and promote to admin
INSERT INTO profiles (id, full_name, role, created_at)
SELECT id, 'Admin User', 'admin', now()
FROM auth.users
WHERE email = 'admin@gmail.com'
ON CONFLICT (id) DO NOTHING;

UPDATE profiles p
SET role = 'admin'
FROM auth.users u
WHERE p.id = u.id
  AND u.email = 'admin@gmail.com';

-- 3) Enable Row-Level Security and add minimal policies for `profiles`
-- These policies allow: owners to read their own profile, and admins to read/update roles.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Remove any existing policies with the same names to make this script idempotent
DROP POLICY IF EXISTS "Profiles: allow owner select" ON profiles;
DROP POLICY IF EXISTS "Profiles: allow admins select" ON profiles;
DROP POLICY IF EXISTS "Profiles: admins can update role" ON profiles;

CREATE POLICY "Profiles: allow owner select" ON profiles
  FOR SELECT USING (auth.uid() = id);
-- Create a SECURITY DEFINER helper to check admin role without causing recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$;

CREATE POLICY "Profiles: allow admins select" ON profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Profiles: admins can update role" ON profiles
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4) (Optional) Audit table + trigger to log role changes
-- Requires `pgcrypto` or `gen_random_uuid()` availability (Supabase enables it by default).
CREATE TABLE IF NOT EXISTS admin_role_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  changed_by uuid,
  target_id uuid,
  old_role text,
  new_role text,
  changed_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.log_profile_role_change()
RETURNS trigger AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO admin_role_audit (changed_by, target_id, old_role, new_role)
    VALUES (auth.uid()::uuid, NEW.id, OLD.role, NEW.role);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_profile_role_change ON profiles;
CREATE TRIGGER trigger_log_profile_role_change
AFTER UPDATE ON profiles
FOR EACH ROW
WHEN (OLD.role IS DISTINCT FROM NEW.role)
EXECUTE FUNCTION public.log_profile_role_change();

-- Notes:
-- - Run the `SELECT id,...` first to confirm the auth user id.
-- - If you prefer to run the promotion as a one-off, use the UPDATE statement above in the SQL editor (the editor executes with the service role).
-- - After applying policies, test by signing out/in and visiting the admin UI; if you see 403s, ensure your client is sending a valid JWT (you must be signed in).
-- - You can remove or tighten policies depending on your app's needs.
