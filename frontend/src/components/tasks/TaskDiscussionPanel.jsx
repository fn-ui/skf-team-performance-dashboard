import { useCallback, useEffect, useMemo, useState } from "react";
import { Edit3, Link2, LoaderCircle, MessageSquare, Paperclip, Reply, Send, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getUsers } from "../../services/userService";
import { createTaskComment, deleteTaskComment, getTaskComments, subscribeToTaskComments, toggleTaskCommentReaction, updateTaskComment } from "../../services/taskDiscussionService";

const emojis = ["👍", "❤️", "🎉", "👀", "✅"];

function TaskDiscussionPanel({ task, roleMode }) {
  const { profile } = useAuth();
  const [comments, setComments] = useState([]);
  const [people, setPeople] = useState([]);
  const [body, setBody] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [editing, setEditing] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [showAttachment, setShowAttachment] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try { setComments(await getTaskComments(task.id)); setError(""); }
    catch (requestError) { setError(requestError.message || "Discussion could not be loaded."); }
  }, [task.id]);

  useEffect(() => {
    load();
    getUsers().then(setPeople).catch(() => setPeople([]));
    const channel = subscribeToTaskComments(task.id, load);
    return () => channel.unsubscribe();
  }, [load, task.id]);

  const roots = useMemo(() => comments.filter((comment) => !comment.parent_id), [comments]);
  const replies = (id) => comments.filter((comment) => comment.parent_id === id);
  const mentionMatch = body.match(/@([^@\n]*)$/);
  const mentionQuery = mentionMatch?.[1]?.trim().toLowerCase() || "";
  const candidates = mentionMatch ? people.filter((person) => person.id !== profile.id && String(person.full_name || "").toLowerCase().includes(mentionQuery)).slice(0, 5) : [];
  const addMention = (person) => setBody(`${body.slice(0, mentionMatch.index)}@${person.full_name} `);

  const submit = async (event) => {
    event.preventDefault();
    if (!body.trim() || saving) return;
    try {
      setSaving(true);
      const mentionUserIds = people.filter((person) => person.id !== profile.id && body.toLowerCase().includes(`@${String(person.full_name || "").toLowerCase()}`)).map((person) => person.id);
      if (editing) await updateTaskComment(editing.id, body);
      else await createTaskComment({ taskId: task.id, authorId: profile.id, body, parentId: replyTo?.id || null, attachmentName, attachmentUrl, mentionUserIds });
      setBody(""); setReplyTo(null); setEditing(null); setAttachmentName(""); setAttachmentUrl(""); setShowAttachment(false); await load();
    } catch (requestError) { setError(requestError.message || "Comment could not be saved."); }
    finally { setSaving(false); }
  };

  const remove = async (comment) => {
    if (!window.confirm("Delete this comment and its replies?")) return;
    try { await deleteTaskComment(comment.id); await load(); }
    catch (requestError) { setError(requestError.message || "Comment could not be deleted."); }
  };

  const react = async (comment, emoji) => {
    const active = comment.task_comment_reactions?.some((reaction) => reaction.user_id === profile.id && reaction.emoji === emoji);
    try { await toggleTaskCommentReaction(comment.id, emoji, profile.id, active); await load(); }
    catch (requestError) { setError(requestError.message || "Reaction could not be saved."); }
  };

  const startEdit = (comment) => { setEditing(comment); setReplyTo(null); setBody(comment.body); setShowAttachment(false); };
  const canModerate = roleMode === "admin" || roleMode === "manager";

  const Comment = ({ comment, nested = false }) => {
    const mine = comment.author_id === profile.id;
    const grouped = (comment.task_comment_reactions || []).reduce((result, reaction) => ({ ...result, [reaction.emoji]: [...(result[reaction.emoji] || []), reaction.user_id] }), {});
    return <article className={`rounded-xl border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900 ${nested ? "ml-7" : ""}`}><div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">{comment.author?.full_name?.charAt(0)?.toUpperCase() || "U"}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-bold dark:text-white">{mine ? "You" : comment.author?.full_name || comment.author || "Team member"}</p><span className="text-xs capitalize text-slate-400">{comment.author?.role || "member"}</span><time className="text-xs text-slate-400">{new Date(comment.created_at).toLocaleString()}</time>{comment.edited_at && <span className="text-[10px] text-slate-400">edited</span>}</div><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-zinc-300">{comment.body}</p>{comment.attachment_url && <a href={comment.attachment_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-zinc-800 dark:text-emerald-400"><Paperclip size={14} />{comment.attachment_name || "Open attachment"}</a>}<div className="mt-2 flex flex-wrap items-center gap-1">{Object.entries(grouped).map(([emoji, users]) => <button key={emoji} onClick={() => react(comment, emoji)} className={`rounded-full border px-2 py-0.5 text-xs ${users.includes(profile.id) ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-slate-200 dark:border-zinc-700"}`}>{emoji} {users.length}</button>)}{emojis.map((emoji) => <button key={emoji} onClick={() => react(comment, emoji)} className="rounded-full px-1 py-0.5 text-xs opacity-50 hover:bg-slate-100 hover:opacity-100 dark:hover:bg-zinc-800">{emoji}</button>)}{!nested && <button onClick={() => { setReplyTo(comment); setEditing(null); setBody(""); }} className="ml-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600"><Reply size={13} /> Reply</button>}{mine && <button onClick={() => startEdit(comment)} className="ml-1 text-slate-400 hover:text-blue-600"><Edit3 size={13} /></button>}{(mine || canModerate) && <button onClick={() => remove(comment)} className="text-slate-400 hover:text-red-600"><Trash2 size={13} /></button>}</div></div></div></article>;
  };

  return (
    <section className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><MessageSquare size={18} className="text-emerald-600" /><div><h3 className="font-bold dark:text-white">Task discussion</h3><p className="text-xs text-slate-500">{comments.length} comments and replies</p></div></div><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-slate-500 dark:bg-zinc-900">{roleMode} access</span></div>
      <div className="mt-4 max-h-[420px] space-y-2 overflow-y-auto pr-1">{roots.map((comment) => <div key={comment.id} className="space-y-2"><Comment comment={comment} />{replies(comment.id).map((reply) => <Comment key={reply.id} comment={reply} nested />)}</div>)}{!roots.length && <p className="rounded-xl bg-white p-5 text-center text-sm text-slate-500 dark:bg-zinc-900">Start the discussion for this task.</p>}</div>
      {(replyTo || editing) && <div className="mt-3 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"><span>{editing ? `Editing your comment` : `Replying to ${replyTo.author?.full_name || "comment"}`}</span><button onClick={() => { setReplyTo(null); setEditing(null); setBody(""); }}>Cancel</button></div>}
      <form onSubmit={submit} className="relative mt-3"><textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={4000} rows={3} placeholder="Write a comment — use @ to mention" className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />{candidates.length > 0 && <div className="absolute bottom-full left-0 mb-1 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">{candidates.map((person) => <button type="button" key={person.id} onClick={() => addMention(person)} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-zinc-800">{person.full_name}</button>)}</div>}{showAttachment && <div className="mt-2 grid gap-2 sm:grid-cols-2"><input value={attachmentName} onChange={(event) => setAttachmentName(event.target.value)} placeholder="Attachment name" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" /><input type="url" value={attachmentUrl} onChange={(event) => setAttachmentUrl(event.target.value)} placeholder="https://attachment-url" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" /></div>}<div className="mt-2 flex items-center justify-between"><button type="button" onClick={() => setShowAttachment((value) => !value)} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600"><Link2 size={14} /> Attach link</button><button disabled={!body.trim() || saving} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">{saving ? <LoaderCircle className="animate-spin" size={15} /> : <Send size={15} />}{editing ? "Save edit" : "Post"}</button></div></form>{error && <p className="mt-3 text-sm text-red-600">{error}</p>}</section>
  );
}

export default TaskDiscussionPanel;
