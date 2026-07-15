import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authorization = request.headers.get("Authorization");
    if (!authorization) return Response.json({ error: "Authentication required" }, { status: 401, headers: corsHeaders });

    const url = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !anonKey || !serviceRoleKey) throw new Error("Supabase function secrets are not configured");

    const userClient = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) return Response.json({ error: "Invalid session" }, { status: 401, headers: corsHeaders });

    const adminClient = createClient(url, serviceRoleKey);
    const { data: caller } = await adminClient.from("profiles").select("role").eq("id", userData.user.id).single();
    const role = String(caller?.role || "").trim().toLowerCase();
    if (!["admin", "administrator", "manager", "team manager"].includes(role)) return Response.json({ error: "You do not have permission to invite members" }, { status: 403, headers: corsHeaders });

    const { email } = await request.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return Response.json({ error: "A valid email is required" }, { status: 400, headers: corsHeaders });

    const redirectTo = Deno.env.get("APP_URL");
    const { data, error } = await adminClient.auth.admin.inviteUserByEmail(normalizedEmail, redirectTo ? { redirectTo } : undefined);
    if (error) return Response.json({ error: error.message }, { status: 400, headers: corsHeaders });
    return Response.json({ invited: true, user_id: data.user?.id }, { headers: corsHeaders });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Invitation failed" }, { status: 500, headers: corsHeaders });
  }
});
