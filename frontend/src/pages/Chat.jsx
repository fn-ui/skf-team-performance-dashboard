import { useCallback, useEffect, useRef, useState } from "react";
import { Hash, LoaderCircle, MessageCircle, Search, Send, UserRound, Users, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getProjects } from "../services/projectsService";
import { getMessages, sendMessage, subscribeToMessages, subscribeToReactions, toggleReaction } from "../services/chatService";
import { getUsers } from "../services/userService";

export default function Chat() {
  const { profile } = useAuth();
  const [channel, setChannel] = useState("general");
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [people, setPeople] = useState([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [showMembers, setShowMembers] = useState(true);
  const [memberQuery, setMemberQuery] = useState("");
  const bottomRef = useRef(null);
  const messagesRef = useRef(null);

  const visibleProjects = (() => {
    const role = String(profile?.role || "member").toLowerCase();
    if (role === "admin") return projects;
    if (role.includes("manager")) {
      return projects.filter((project) => String(project.manager_id) === String(profile.id));
    }
    return projects.filter((project) => {
      const directMember = (project.project_members || project.members || []).some((member) =>
        String(member.user_id || member.id || member.profiles?.id) === String(profile.id)
      );
      const taskAssignee = (project.tasks || []).some((task) =>
        (task.task_assignees || []).some((assignee) =>
          String(assignee.user_id || assignee.profiles?.id) === String(profile.id)
        )
      );
      return directMember || taskAssignee;
    });
  })();

  const channels = [
    { id: "general", name: "General", icon: Users },
    ...visibleProjects.map((project) => ({ id: `project:${project.id}`, name: project.name, icon: Hash })),
  ];

  const channelMembers = (() => {
    if (channel === "general") return people;
    const projectId = channel.split(":")[1];
    const project = projects.find((item) => String(item.id) === String(projectId));
    if (!project) return [];
    const collected = [project.manager, ...(project.project_members || []).map((member) => member.profiles || member), ...(project.tasks || []).flatMap((task) => (task.task_assignees || []).map((assignment) => assignment.profiles || assignment))].filter(Boolean);
    if (String(project.manager_id) === String(profile?.id) || collected.some((member) => String(member.id || member.user_id) === String(profile?.id))) collected.push(profile);
    return [...new Map(collected.map((member) => [String(member.id || member.user_id), { ...member, id: member.id || member.user_id }])).values()];
  })();
  const filteredMembers = channelMembers.filter((member) => `${member.full_name || ""} ${member.role || ""}`.toLowerCase().includes(memberQuery.toLowerCase()));

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setMessages(await getMessages(channel));
    } catch (err) {
      setError(err.message || "Messages could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [channel]);

  useEffect(() => {
    Promise.all([getProjects(), getUsers()])
      .then(([projectData, userData]) => { setProjects(projectData || []); setPeople(userData || []); })
      .catch(() => { setProjects([]); setPeople([]); });
  }, []);
  useEffect(() => {
    const initialLoad = window.setTimeout(load, 0);
    const subscription = subscribeToMessages(channel, load);
    const reactionSubscription = subscribeToReactions(load);
    return () => { window.clearTimeout(initialLoad); subscription.unsubscribe(); reactionSubscription.unsubscribe(); };
  }, [channel, load]);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages]);

  const submit = async (event) => {
    event.preventDefault();
    if (!body.trim() || sending) return;
    try {
      setSending(true);
      const mentionUserIds = people
        .filter((person) => person.id !== profile.id && body.toLowerCase().includes(`@${String(person.full_name || "").toLowerCase()}`))
        .map((person) => person.id);
      const message = await sendMessage({ channel, body, userId: profile.id, mentionUserIds });
      setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message]);
      setBody("");
    } catch (err) {
      setError(err.message || "Message could not be sent.");
    } finally { setSending(false); }
  };

  const activeName = channels.find((item) => item.id === channel)?.name || "General";
  const mentionMatch = body.match(/@([^@\n]*)$/);
  const mentionQuery = mentionMatch?.[1]?.trim().toLowerCase() || "";
  const mentionCandidates = mentionMatch
    ? people.filter((person) => person.id !== profile.id && String(person.full_name || "").toLowerCase().includes(mentionQuery)).slice(0, 6)
    : [];
  const addMention = (person) => {
    const start = mentionMatch.index;
    setBody(`${body.slice(0, start)}@${person.full_name} `);
  };
  const react = async (message, emoji) => {
    const active = (message.chat_reactions || []).some((item) => item.user_id === profile.id && item.emoji === emoji);
    await toggleReaction(message.id, emoji, profile.id, active);
    await load();
  };

  return (
    <div className={`grid overflow-hidden rounded-2xl border border-white/70 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/80 lg:h-[calc(100dvh-7.5rem)] lg:min-h-[560px] ${showMembers ? "lg:grid-cols-[280px_minmax(0,1fr)_280px]" : "lg:grid-cols-[280px_minmax(0,1fr)]"}`}>
      <aside className="border-b border-slate-200 bg-slate-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/60 lg:flex lg:min-h-0 lg:flex-col lg:overflow-hidden lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white"><MessageCircle /></span><div><h1 className="text-xl font-bold">Team Chat</h1><p className="text-xs text-slate-500">Live collaboration</p></div></div>
        <p className="mb-3 mt-7 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Channels</p>
        <nav className="flex gap-2 overflow-x-auto lg:min-h-0 lg:flex-1 lg:block lg:space-y-1 lg:overflow-x-hidden lg:overflow-y-auto lg:pr-1">
          {channels.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setChannel(item.id)} className={`focus-ring flex min-w-fit items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold lg:w-full ${channel === item.id ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/15" : "text-slate-600 hover:bg-white dark:text-zinc-300 dark:hover:bg-zinc-800"}`}><Icon size={17} /><span className="truncate">{item.name}</span></button>; })}
        </nav>
      </aside>

      <section className="flex min-h-[650px] min-w-0 flex-col lg:min-h-0 lg:overflow-hidden">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-zinc-800"><div><h2 className="text-xl font-bold"># {activeName}</h2><p className="mt-1 text-sm text-slate-500">Discuss work, blockers, decisions, and project updates.</p></div><button onClick={() => setShowMembers((value) => !value)} className="focus-ring flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 dark:border-zinc-700 dark:text-zinc-300"><Users size={17} /> {channelMembers.length}<span className="hidden sm:inline"> members</span></button></header>
        <div ref={messagesRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-5">
          {loading ? <div className="flex h-full items-center justify-center gap-2 text-slate-500"><LoaderCircle className="animate-spin" /> Loading conversationâ€¦</div> : messages.length === 0 ? <div className="flex h-full flex-col items-center justify-center text-center"><MessageCircle size={44} className="text-slate-300" /><h3 className="mt-4 text-lg font-bold">Start the conversation</h3><p className="mt-1 text-sm text-slate-500">Share the first update in this channel.</p></div> : messages.map((message) => {
            const mine = message.user_id === profile.id;
            return <MessageBubble key={message.id} message={message} mine={mine} currentUserId={profile.id} onReact={react} />;
          })}
          <div ref={bottomRef} />
        </div>
        {error && <p className="mx-6 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</p>}
        <form onSubmit={submit} className="relative flex gap-3 border-t border-slate-200 p-5 dark:border-zinc-800">
          {mentionCandidates.length > 0 && <div className="absolute bottom-[calc(100%-8px)] left-5 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"><p className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">Mention someone</p>{mentionCandidates.map((person) => <button type="button" key={person.id} onClick={() => addMention(person)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-zinc-800"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">{person.full_name?.charAt(0)?.toUpperCase() || "U"}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{person.full_name}</span><span className="block truncate text-xs text-slate-500">{person.role || "member"}</span></span></button>)}</div>}
          <input value={body} onChange={(event) => setBody(event.target.value)} maxLength={4000} placeholder={`Message #${activeName} — use @ to mention`} className="input-field flex-1" />
          <button disabled={!body.trim() || sending} className="focus-ring flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40">{sending ? <LoaderCircle className="animate-spin" size={19} /> : <Send size={19} />}</button>
        </form>
      </section>

      {showMembers && <aside className="fixed inset-x-4 bottom-4 top-24 z-50 flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 lg:static lg:inset-auto lg:z-auto lg:rounded-none lg:border-y-0 lg:border-r-0 lg:border-l lg:shadow-none">
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-zinc-800"><div><h2 className="font-bold">Channel members</h2><p className="text-xs text-slate-500">{channelMembers.length} people in #{activeName}</p></div><button onClick={() => setShowMembers(false)} aria-label="Close member panel" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"><X size={18} /></button></div>
        <label className="mx-4 mt-4 flex items-center gap-2 rounded-xl border border-slate-200 px-3 dark:border-zinc-700"><Search size={15} className="text-slate-400" /><input value={memberQuery} onChange={(event) => setMemberQuery(event.target.value)} placeholder="Find a member" className="w-full bg-transparent py-2 text-sm outline-none" /></label>
        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">{filteredMembers.map((member) => <div key={member.id} className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">{member.full_name?.charAt(0)?.toUpperCase() || <UserRound size={16} />}</span><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{member.full_name || "Team member"}{String(member.id) === String(profile?.id) && <span className="ml-1 font-normal text-slate-400">(you)</span>}</p><p className="truncate text-xs capitalize text-slate-500">{member.role || "member"}</p></div></div>)}{!filteredMembers.length && <p className="p-5 text-center text-sm text-slate-500">No channel members match your search.</p>}</div>
        <p className="border-t border-slate-200 p-4 text-xs leading-5 text-slate-500 dark:border-zinc-800">Project channels include the manager, direct members, and assigned contributors.</p>
      </aside>}
    </div>
  );
}

const reactionOptions = ["👍", "❤️", "🎉", "😂", "👀", "✅"];

function MessageBubble({ message, mine, currentUserId, onReact }) {
  const grouped = (message.chat_reactions || []).reduce((result, item) => {
    result[item.emoji] = [...(result[item.emoji] || []), item.user_id];
    return result;
  }, {});
  return (
    <article className={`group flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className="relative max-w-[82%]">
        <div className={`rounded-2xl px-4 py-3 ${mine ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-white"}`}><div className={`mb-1 flex items-center gap-2 text-xs font-bold ${mine ? "text-emerald-100" : "text-slate-500"}`}><span>{mine ? "You" : message.profiles?.full_name || "Team member"}</span><time className="font-normal opacity-75">{new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time></div><p className="whitespace-pre-wrap text-sm leading-6">{message.body}</p></div>
        <div className={`mt-1 flex flex-wrap items-center gap-1 ${mine ? "justify-end" : "justify-start"}`}>
          {Object.entries(grouped).map(([emoji, users]) => <button key={emoji} onClick={() => onReact(message, emoji)} className={`rounded-full border px-2 py-0.5 text-xs ${users.includes(currentUserId) ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"}`}>{emoji} {users.length}</button>)}
          <div className="invisible flex gap-0.5 rounded-full border border-slate-200 bg-white p-1 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 dark:border-zinc-700 dark:bg-zinc-900">{reactionOptions.map((emoji) => <button key={emoji} onClick={() => onReact(message, emoji)} className="rounded-full p-1 text-sm hover:bg-slate-100 dark:hover:bg-zinc-800" aria-label={`React with ${emoji}`}>{emoji}</button>)}</div>
        </div>
      </div>
    </article>
  );
}
