import { supabase } from "../lib/supabase";

export async function connectGitHub() {
  const { error } = await supabase.auth.linkIdentity({
    provider: "github",
    options: {
      redirectTo: `${window.location.origin}/integrations`,
      scopes: "read:user repo",
    },
  });
  if (error) throw error;
}

export async function getGitHubToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session?.provider_token || null;
}

export async function fetchGitHubRepositories(token) {
  const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
    headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("GitHub repositories could not be loaded.");
  return response.json();
}

export async function getRepositoryIntegrations(userId) {
  const { data, error } = await supabase.from("repository_integrations").select("*, projects(id, name)").eq("connected_by", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function saveRepositoryIntegration(repository, userId, projectId = null) {
  const payload = {
    provider: "github",
    external_id: String(repository.id),
    name: repository.name,
    full_name: repository.full_name,
    html_url: repository.html_url,
    default_branch: repository.default_branch,
    is_private: repository.private,
    language: repository.language,
    connected_by: userId,
    project_id: projectId,
    synced_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("repository_integrations").upsert(payload, { onConflict: "connected_by,provider,external_id" }).select().single();
  if (error) throw error;
  return data;
}

export async function disconnectRepository(id, userId) {
  const { error } = await supabase.from("repository_integrations").delete().eq("id", id).eq("connected_by", userId);
  if (error) throw error;
}
