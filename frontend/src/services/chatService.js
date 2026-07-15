import { supabase } from "../lib/supabase";

export async function getMessages(channel = "general") {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, channel, body, created_at, user_id, profiles:user_id(full_name, role), chat_reactions(emoji, user_id)")
    .eq("channel", channel)
    .order("created_at", { ascending: true })
    .limit(200);
  if (error) throw error;
  return data || [];
}

export async function sendMessage({ channel, body, userId, mentionUserIds = [] }) {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({ channel, body: body.trim(), user_id: userId })
    .select("id, channel, body, created_at, user_id, profiles:user_id(full_name, role), chat_reactions(emoji, user_id)")
    .single();
  if (error) throw error;
  if (mentionUserIds.length) {
    const mentions = [...new Set(mentionUserIds)]
      .filter((mentionedUserId) => mentionedUserId !== userId)
      .map((mentionedUserId) => ({ message_id: data.id, mentioned_user_id: mentionedUserId }));
    if (mentions.length) {
      const { error: mentionError } = await supabase.from("chat_mentions").insert(mentions);
      if (mentionError) throw mentionError;
    }
  }
  return data;
}

export function subscribeToMessages(channel, callback) {
  return supabase
    .channel(`chat-${channel}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "chat_messages", filter: `channel=eq.${channel}` }, callback)
    .subscribe();
}

export async function toggleReaction(messageId, emoji, userId, active) {
  if (active) {
    const { error } = await supabase.from("chat_reactions").delete().eq("message_id", messageId).eq("user_id", userId).eq("emoji", emoji);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("chat_reactions").insert({ message_id: messageId, user_id: userId, emoji });
  if (error) throw error;
}

export function subscribeToReactions(callback) {
  return supabase.channel(`chat-reactions-${Date.now()}-${Math.random()}`).on("postgres_changes", { event: "*", schema: "public", table: "chat_reactions" }, callback).subscribe();
}
