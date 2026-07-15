import { supabase } from "../lib/supabase";

const selection = "id, task_id, author_id, parent_id, body, attachment_name, attachment_url, created_at, edited_at, author:profiles!task_comments_author_id_fkey(id, full_name, role), task_comment_reactions(emoji, user_id)";

export async function getTaskComments(taskId) {
  const { data, error } = await supabase.from("task_comments").select(selection).eq("task_id", taskId).order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createTaskComment({ taskId, authorId, body, parentId = null, attachmentName = null, attachmentUrl = null, mentionUserIds = [] }) {
  const { data, error } = await supabase.from("task_comments").insert({ task_id: taskId, author_id: authorId, body: body.trim(), parent_id: parentId, attachment_name: attachmentName || null, attachment_url: attachmentUrl || null }).select(selection).single();
  if (error) throw error;
  const mentions = [...new Set(mentionUserIds)].filter((id) => id !== authorId).map((mentioned_user_id) => ({ comment_id: data.id, mentioned_user_id }));
  if (mentions.length) {
    const { error: mentionError } = await supabase.from("task_comment_mentions").insert(mentions);
    if (mentionError) throw mentionError;
  }
  return data;
}

export async function updateTaskComment(id, body) {
  const { error } = await supabase.from("task_comments").update({ body: body.trim(), edited_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}

export async function deleteTaskComment(id) {
  const { error } = await supabase.from("task_comments").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleTaskCommentReaction(commentId, emoji, userId, active) {
  const request = active ? supabase.from("task_comment_reactions").delete().eq("comment_id", commentId).eq("user_id", userId).eq("emoji", emoji) : supabase.from("task_comment_reactions").insert({ comment_id: commentId, user_id: userId, emoji });
  const { error } = await request;
  if (error) throw error;
}

export function subscribeToTaskComments(taskId, callback) {
  return supabase.channel(`task-comments-${taskId}-${Date.now()}`).on("postgres_changes", { event: "*", schema: "public", table: "task_comments", filter: `task_id=eq.${taskId}` }, callback).on("postgres_changes", { event: "*", schema: "public", table: "task_comment_reactions" }, callback).subscribe();
}
