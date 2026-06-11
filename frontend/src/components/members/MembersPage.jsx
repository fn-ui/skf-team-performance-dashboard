import { useMemo, useState } from "react";
import {
  Activity,
  Briefcase,
  CheckCircle2,
  Download,
  Edit3,
  Eye,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { members as seedMembers } from "../../data/mockData";
import { exportCSV } from "../../utils/exportCSV";

const roleOptions = [
  "Team Manager",
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "QA Engineer",
  "Product Manager",
];

const departmentOptions = [
  "All",
  "Management",
  "Engineering",
  "Design",
  "Quality Assurance",
  "Product",
];

const statusOptions = ["All", "Active", "Busy", "Away", "Offline"];

const colors = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-pink-500",
  "bg-amber-500",
  "bg-cyan-500",
];

const emptyMember = {
  name: "",
  email: "",
  phone: "",
  role: "Frontend Developer",
  department: "Engineering",
  status: "Active",
  productivity: "80%",
  tasks: 0,
  projects: 1,
  location: "Nairobi, Kenya",
  joinDate: "2026-06-10",
  bio: "",
};

const initials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const productivityValue = (value) => Number(String(value).replace("%", "")) || 0;

function MembersPage({ mode }) {
  const isAdmin = mode === "admin";

  const [members, setMembers] = useState(() =>
    seedMembers.map((member, index) => ({
      ...member,
      avatar: member.avatar || initials(member.name),
      color: member.color || colors[index % colors.length],
    }))
  );
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [selectedMember, setSelectedMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [draft, setDraft] = useState(emptyMember);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const visibleMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members
      .filter((member) =>
        department === "All" ? true : member.department === department
      )
      .filter((member) => (status === "All" ? true : member.status === status))
      .filter((member) => {
        if (!query) return true;
        return [
          member.name,
          member.email,
          member.role,
          member.department,
          member.location,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [department, members, search, status]);

  const stats = {
    total: members.length,
    active: members.filter((member) => member.status === "Active").length,
    managers: members.filter((member) => member.role.includes("Manager")).length,
    average: Math.round(
      members.reduce(
        (sum, member) => sum + productivityValue(member.productivity),
        0
      ) / members.length
    ),
  };

  const openAdd = () => {
    setEditingMember(null);
    setDraft(emptyMember);
    setIsFormOpen(true);
  };

  const openEdit = (member) => {
    setEditingMember(member);
    setDraft({ ...member });
    setIsFormOpen(true);
  };

  const saveMember = (event) => {
    event.preventDefault();

    const nextMember = {
      ...draft,
      name: draft.name.trim(),
      email: draft.email.trim(),
      avatar: initials(draft.name),
      productivity: `${productivityValue(draft.productivity)}%`,
    };

    if (!nextMember.name || !nextMember.email) return;

    if (editingMember) {
      setMembers((current) =>
        current.map((member) =>
          member.id === editingMember.id ? { ...member, ...nextMember } : member
        )
      );
    } else {
      setMembers((current) => [
        {
          id: Date.now(),
          ...nextMember,
          color: colors[current.length % colors.length],
        },
        ...current,
      ]);
    }

    setIsFormOpen(false);
    setEditingMember(null);
  };

  const deleteMember = (memberId) => {
    setMembers((current) => current.filter((member) => member.id !== memberId));
    if (selectedMember?.id === memberId) setSelectedMember(null);
  };

  const exportMembers = () => {
    exportCSV(
      "members.csv",
      visibleMembers.map((member) => ({
        name: member.name,
        email: member.email,
        role: member.role,
        department: member.department,
        status: member.status,
        productivity: member.productivity,
        tasks: member.tasks,
        projects: member.projects,
        location: member.location,
      }))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {isAdmin ? "Members" : "Team Members"}
          </h1>
          <p className="mt-2 text-slate-500 dark:text-zinc-400">
            {isAdmin
              ? "Manage employee profiles, roles, and team capacity."
              : "Monitor your team directory and performance signals."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportMembers}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
          >
            <Download size={17} />
            Export
          </button>

          {isAdmin && (
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              <Plus size={18} />
              Add Member
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Total Members" value={stats.total} icon={Users} />
        <StatCard label="Active Now" value={stats.active} icon={CheckCircle2} />
        <StatCard label="Managers" value={stats.managers} icon={ShieldCheck} />
        <StatCard label="Avg Performance" value={`${stats.average}%`} icon={Activity} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_220px_180px]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search members by name, role, department, or location..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-slate-800 outline-none transition focus:ring-2 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <select
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:ring-2 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
        >
          {departmentOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:ring-2 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
        >
          {statusOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <MembersTable
        members={visibleMembers}
        isAdmin={isAdmin}
        onView={setSelectedMember}
        onEdit={openEdit}
        onDelete={deleteMember}
      />

      {visibleMembers.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <Users className="mx-auto text-slate-400" size={38} />
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            No members found
          </h2>
          <p className="mt-2 text-slate-500 dark:text-zinc-400">
            Try a different search or filter.
          </p>
        </div>
      )}

      {selectedMember && (
        <MemberDetailsModal
          member={selectedMember}
          isAdmin={isAdmin}
          onClose={() => setSelectedMember(null)}
          onEdit={(member) => {
            setSelectedMember(null);
            openEdit(member);
          }}
        />
      )}

      {isFormOpen && (
        <MemberFormModal
          draft={draft}
          setDraft={setDraft}
          isEditing={Boolean(editingMember)}
          onClose={() => {
            setIsFormOpen(false);
            setEditingMember(null);
          }}
          onSubmit={saveMember}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-zinc-400">{label}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function MembersTable({ members, isAdmin, onView, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            <tr>
              <th className="px-5 py-4 font-semibold">Member</th>
              <th className="px-5 py-4 font-semibold">Role</th>
              <th className="px-5 py-4 font-semibold">Department</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Productivity</th>
              <th className="px-5 py-4 font-semibold">Workload</th>
              <th className="px-5 py-4 font-semibold">Location</th>
              <th className="px-5 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
            {members.map((member) => {
              const performance = productivityValue(member.productivity);

              return (
                <tr
                  key={member.id}
                  className="transition hover:bg-slate-50 dark:hover:bg-zinc-800/60"
                >
                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${member.color} font-bold text-white`}
                      >
                        {member.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900 dark:text-white">
                          {member.name}
                        </p>
                        <p className="truncate text-sm text-slate-500 dark:text-zinc-400">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-slate-700 dark:text-zinc-300">
                    {member.role}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-zinc-400">
                    {member.department}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={member.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex min-w-[140px] items-center gap-3">
                      <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-zinc-800">
                        <div
                          className="h-2 rounded-full bg-emerald-500"
                          style={{ width: `${performance}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-sm font-semibold text-slate-900 dark:text-white">
                        {member.productivity}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-sm text-slate-600 dark:text-zinc-400">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {member.tasks}
                      </span>{" "}
                      tasks
                      <span className="mx-2 text-slate-300 dark:text-zinc-700">/</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {member.projects}
                      </span>{" "}
                      projects
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                      <MapPin size={15} className="text-slate-400" />
                      <span className="truncate">{member.location}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView(member)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700"
                      >
                        <Eye size={15} />
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onEdit(member)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => onDelete(member.id)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const classes = {
    Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    Busy: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    Away: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    Offline: "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        classes[status] || classes.Offline
      }`}
    >
      {status}
    </span>
  );
}

function MemberDetailsModal({ member, isAdmin, onClose, onEdit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl ${member.color} text-xl font-bold text-white`}
            >
              {member.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {member.name}
              </h2>
              <p className="text-slate-500 dark:text-zinc-400">{member.role}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <p className="rounded-2xl bg-slate-50 p-5 leading-relaxed text-slate-600 dark:bg-zinc-950 dark:text-zinc-300">
            {member.bio || "No profile summary has been added yet."}
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DetailItem icon={Mail} label="Email" value={member.email} />
            <DetailItem icon={Phone} label="Phone" value={member.phone} />
            <DetailItem icon={Briefcase} label="Department" value={member.department} />
            <DetailItem icon={MapPin} label="Location" value={member.location} />
            <DetailItem icon={Activity} label="Productivity" value={member.productivity} />
            <DetailItem icon={UserRound} label="Join Date" value={member.joinDate} />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            {isAdmin && (
              <button
                onClick={() => onEdit(member)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                <Edit3 size={16} />
                Edit Member
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-zinc-950">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 dark:bg-zinc-900">
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-500 dark:text-zinc-500">{label}</p>
          <p className="truncate font-semibold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function MemberFormModal({ draft, setDraft, isEditing, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={onSubmit}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-zinc-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isEditing ? "Edit Member" : "Add Member"}
            </h2>
            <p className="mt-1 text-slate-500 dark:text-zinc-400">
              Keep team profile information accurate.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
          <Field label="Full Name">
            <input
              required
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              className="input-field"
            />
          </Field>

          <Field label="Email">
            <input
              required
              type="email"
              value={draft.email}
              onChange={(event) => setDraft({ ...draft, email: event.target.value })}
              className="input-field"
            />
          </Field>

          <Field label="Phone">
            <input
              value={draft.phone}
              onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
              className="input-field"
            />
          </Field>

          <Field label="Location">
            <input
              value={draft.location}
              onChange={(event) =>
                setDraft({ ...draft, location: event.target.value })
              }
              className="input-field"
            />
          </Field>

          <Field label="Role">
            <select
              value={draft.role}
              onChange={(event) => setDraft({ ...draft, role: event.target.value })}
              className="input-field"
            >
              {roleOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>

          <Field label="Department">
            <select
              value={draft.department}
              onChange={(event) =>
                setDraft({ ...draft, department: event.target.value })
              }
              className="input-field"
            >
              {departmentOptions
                .filter((option) => option !== "All")
                .map((option) => (
                  <option key={option}>{option}</option>
                ))}
            </select>
          </Field>

          <Field label="Status">
            <select
              value={draft.status}
              onChange={(event) =>
                setDraft({ ...draft, status: event.target.value })
              }
              className="input-field"
            >
              {statusOptions
                .filter((option) => option !== "All")
                .map((option) => (
                  <option key={option}>{option}</option>
                ))}
            </select>
          </Field>

          <Field label="Productivity">
            <input
              type="number"
              min="0"
              max="100"
              value={productivityValue(draft.productivity)}
              onChange={(event) =>
                setDraft({ ...draft, productivity: `${event.target.value}%` })
              }
              className="input-field"
            />
          </Field>

          <Field label="Tasks">
            <input
              type="number"
              min="0"
              value={draft.tasks}
              onChange={(event) =>
                setDraft({ ...draft, tasks: Number(event.target.value) })
              }
              className="input-field"
            />
          </Field>

          <Field label="Projects">
            <input
              type="number"
              min="0"
              value={draft.projects}
              onChange={(event) =>
                setDraft({ ...draft, projects: Number(event.target.value) })
              }
              className="input-field"
            />
          </Field>

          <Field label="Join Date">
            <input
              type="date"
              value={draft.joinDate}
              onChange={(event) =>
                setDraft({ ...draft, joinDate: event.target.value })
              }
              className="input-field"
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Profile Summary">
              <textarea
                rows={4}
                value={draft.bio}
                onChange={(event) => setDraft({ ...draft, bio: event.target.value })}
                className="input-field resize-none"
              />
            </Field>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 p-6 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            {isEditing ? "Save Changes" : "Create Member"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
        {label}
      </span>
      {children}
    </label>
  );
}

export default MembersPage;
