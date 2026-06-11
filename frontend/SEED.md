Seed instructions

1) Open the Supabase project for this app and go to the SQL editor.
2) Review `supabase-schema.sql` to ensure the tables exist (projects, tasks, task_comments, profiles).
3) Run `supabase-seed.sql` in the SQL editor to insert demo rows.

Notes:
- If you use Supabase Auth, replace the `profiles.id` values in `supabase-seed.sql` with the real `auth.users.id` values for each user, or sign up users first and then run the INSERTs using those IDs.
- The seed file uses `ON CONFLICT DO NOTHING` so it's safe to re-run.

Optional: If you want a Node-based seeder script (run locally) I can add one that uses `@supabase/supabase-js` and reads `VITE_` env vars.
