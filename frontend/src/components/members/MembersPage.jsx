import { useEffect, useMemo, useState } from "react";

import {
  Download,
  Edit3,
  Eye,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  UserPlus,
  Trash2,
  Users,
  X,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Briefcase,
  UserRound,
} from "lucide-react";

import { supabase } from "../../lib/supabase.js";
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
  full_name: "",
  email: "",
  phone: "",
  role: "Frontend Developer",
  department: "Engineering",
  location: "Nairobi, Kenya",
  productivity: "80%",
  tasks: 0,
  projects: 0,
  bio: "",
  manager_id: "",
};


const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getStatus = (lastSeen, isOnline) => {
  if (isOnline) return "Active";

  const diff = Date.now() - new Date(lastSeen || 0).getTime();

  if (diff < 5 * 60 * 1000) return "Active";

  if (diff < 30 * 60 * 1000) return "Busy";

  return "Away";
};

const productivityValue = (value) =>
  Number(String(value || 0).replace("%", "")) || 0;


function MembersPage({ mode }) {
  const functionsBaseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
  
  const isAdmin = mode === "admin";

  const [members, setMembers] = useState([]);

  const [search, setSearch] = useState("");

  const [department, setDepartment] = useState("All");

  const [status, setStatus] = useState("All");

  const [selectedMember, setSelectedMember] = useState(null);

  const [editingMember, setEditingMember] = useState(null);

  const [draft, setDraft] = useState(emptyMember);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [
  isInviteOpen,
  setIsInviteOpen,
] = useState(false);

const ITEMS_PER_PAGE = 5;

const [managersPage, setManagersPage] =
  useState(1);

const [membersPage, setMembersPage] =
  useState(1);

const [managers, setManagers] = useState([]);
const [inviteData, setInviteData] =
  useState({
    email: "",
  });
       useEffect(() => {
  fetchMembers();
  fetchManagers();


  const channel = supabase
    .channel("members-realtime")


    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "profiles",
      },
      () => {
        fetchMembers();
        fetchManagers();
      }
    )


    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "member_details",
      },
      () => {
        fetchMembers();
      }
    )

    .subscribe();

  return () => {
    supabase.removeChannel(
      channel
    );
  };
}, []);

      const fetchManagers = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name")
          .eq("role", "Team Manager");

        if (error) {
          console.error(
            "FETCH MANAGERS FAILED:",
            error
          );
          return;
        }

        setManagers(data || []);
      };

  const fetchMembers = async () => {
  let query = supabase
    .from("profiles")
    .select(`
      *,
      member_details (
        phone,
        department,
        location,
        bio,
        productivity,
        tasks_count,
        projects_count,
        avatar_url
      )
    `)
    .order("created_at", {
      ascending: false,
    });


 if (!isAdmin) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("No auth user found");
    return;
  }

  

  const { data: managerProfile, error } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("email", user.email)
    .single();

  if (error) {
    console.error("Error fetching manager profile:", error);
    return;
  }

  if (!managerProfile) {
    console.log("No manager profile found");
    return;
  }

  console.log("Manager profile found:", managerProfile);

  query = query.eq("manager_id", managerProfile.id);
}

  const { data, error } = await query;

  if (error) {
    console.error("Fetch error:", error);
    return;
  }

  const formatted = (data || []).map(
    (m, index) => {
      const details = Array.isArray(
        m.member_details
      )
        ? m.member_details[0]
        : m.member_details;

      return {
        ...m,

        name: m.full_name || "",

        phone: details?.phone || "",

        department:
          details?.department ||
          "Engineering",

        location:
          details?.location ||
          "Nairobi, Kenya",

        bio: details?.bio || "",

        productivity: `${
          details?.productivity || 0
        }%`,

        tasks:
          details?.tasks_count || 0,

        projects:
          details?.projects_count || 0,

        avatar_url:
          details?.avatar_url || "",

        avatar:
          initials(m.full_name),

        color:
          colors[index % colors.length],

        status: getStatus(
          m.last_seen,
          m.is_online
        ),
      };
    }
  );

  setMembers(formatted);
  
};


  const visibleMembers = useMemo(() => {
    const query = search.toLowerCase();

    return members
      .filter((m) =>
        department === "All"
          ? true
          : m.department === department
      )
      .filter((m) =>
        status === "All"
          ? true
          : m.status === status
      )
      .filter((m) =>
        [
          m.full_name || "",
          m.email || "",
          m.role || "",
          m.location || "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      )
      .sort((a, b) =>
        (a.full_name || "").localeCompare(
          b.full_name || ""
        )
      );
  }, [members, search, department, status]);
  

      useEffect(() => {
        setManagersPage(1);
        setMembersPage(1);
      }, [
        search,
        department,
        status,
      ]);
  const managersList =
  visibleMembers.filter(
    (member) =>
      member.role?.includes(
        "Manager"
      )
  );

const membersList =
  visibleMembers.filter(
    (member) =>
      !member.role?.includes(
        "Manager"
      ) &&
      member.role !== "admin"
  );


const totalManagersPages =
  Math.ceil(
    managersList.length /
      ITEMS_PER_PAGE
  ) || 1;

const totalMembersPages =
  Math.ceil(
    membersList.length /
      ITEMS_PER_PAGE
  ) || 1;


const paginatedManagers =
  managersList.slice(
    (managersPage - 1) *
      ITEMS_PER_PAGE,

    managersPage *
      ITEMS_PER_PAGE
  );


const paginatedMembers =
  membersList.slice(
    (membersPage - 1) *
      ITEMS_PER_PAGE,

    membersPage *
      ITEMS_PER_PAGE
  );


  const stats = {
    total: visibleMembers.length,

    active: visibleMembers.filter(
      (m) => m.status === "Active"
    ).length,

    managers: visibleMembers.filter(
      (m) =>
        m.role?.includes(
          "Manager"
        )
    ).length,

    average:
      visibleMembers.length
        ? Math.round(
            visibleMembers.reduce(
              (sum, m) =>
                sum +
                productivityValue(
                  m.productivity
                ),
              0
            ) /
              visibleMembers.length
          )
        : 0,
  };


  const openAdd = () => {
    setEditingMember(null);

    setDraft(emptyMember);

    setIsFormOpen(true);
  };

  const openEdit = (member) => {
    setEditingMember(member);

    setDraft({
      full_name: member.full_name || "",
      email: member.email || "",
      

      phone: member.phone || "",

      role:
        member.role ||
        "Frontend Developer",

      department:
        member.department ||
        "Engineering",

      location:
        member.location ||
        "Nairobi, Kenya",

      productivity:
        member.productivity || "80%",

      tasks: member.tasks || 0,

      projects: member.projects || 0,

      bio: member.bio || "",

      manager_id: member.manager_id || "",
    });

    setIsFormOpen(true);
  };

  const saveMember = async (e) => {
    e.preventDefault();

   if (
  !draft.full_name ||
  !draft.email
) {
  alert("Please fill all required fields");
  return;
}


    if (editingMember) {

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: draft.full_name,
          email: draft.email,
          role: draft.role,
          manager_id: draft.manager_id || null,
        })
        .eq("id", editingMember.id);

      if (profileError) {
        console.error(profileError);
        return;
      }


      const { error: detailsError } = await supabase
        .from("member_details")
        .update({
          phone: draft.phone,

          department: draft.department,

          location: draft.location,

          bio: draft.bio,

          productivity: productivityValue(
            draft.productivity
          ),

          tasks_count: Number(
            draft.tasks
          ),

          projects_count: Number(
            draft.projects
          ),
        })
        .eq("user_id", editingMember.id);

      

if (detailsError) {
  console.error("DETAILS UPDATE FAILED:", detailsError);
  return;
}
    }


else {
  const {
  data: { session },
} = await supabase.auth.getSession();

const response = await fetch(
  `${functionsBaseUrl}/create-member`,
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${session?.access_token}`,
    },

    body: JSON.stringify({
      full_name: draft.full_name,
      email: draft.email,
      role: draft.role,

      phone: draft.phone,
      department: draft.department,
      location: draft.location,
      bio: draft.bio,

      productivity: productivityValue(
        draft.productivity
      ),

      tasks: Number(draft.tasks),

      projects: Number(
        draft.projects
      ),
      manager_id: draft.manager_id || null,
    }),
  }
);

  const result = await response.json();

  if (!response.ok) {
    console.error(
      "CREATE MEMBER FAILED:",
      result
    );

    return;
  }

  console.log(
    "Member created successfully:",
    result
  );
}

    setIsFormOpen(false);

    setEditingMember(null);

    setDraft(emptyMember);

    await fetchMembers();
  };


  const deleteMember = async (id) => {
  const confirmed = window.confirm(
    "Delete this member?"
  );

  if (!confirmed) return;

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch(
      `${functionsBaseUrl}/delete-member`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization: `Bearer ${session?.access_token}`,
        },

        body: JSON.stringify({
          userId: id,
        }),
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      console.error(
        "DELETE MEMBER FAILED:",
        result
      );

      return;
    }

    console.log(
      "Member deleted successfully"
    );

    await fetchMembers();
  } catch (err) {
    console.error(err);
  }
};
const handleInviteMember =
  async () => {
    try {
      if (!inviteData.email) {
        alert("Email is required");

        return;
      }

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      const response =
        await fetch(
          `${functionsBaseUrl}/invite-member`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization: `Bearer ${session?.access_token}`,
            },

            body: JSON.stringify({
              email:
                inviteData.email,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        console.error(result);

        alert(
          result.error ||
            "Failed to send invite"
        );

        return;
      }

      alert(
        "Invitation sent successfully"
      );


      setInviteData({
        email: "",
      });

      setIsInviteOpen(false);


      fetchMembers();
    } catch (err) {
      console.error(err);

      alert(
        "Something went wrong"
      );
    }
  };


  const exportMembers = () => {
    exportCSV(
      "members.csv",

      visibleMembers.map((m) => ({
        name: m.full_name,

        email: m.email,

        role: m.role,

        department: m.department,

        status: m.status,

        location: m.location,
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
          {isAdmin && (
            <button
              onClick={() =>
                setIsInviteOpen(true)
              }
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-medium text-white shadow-lg transition hover:bg-emerald-700"
            >
              <Plus size={18} />

              Invite Member
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

{isAdmin && (
<div className="space-y-4">

  <div className="flex items-center gap-3">

    <ShieldCheck
      className="text-emerald-600"
      size={22}
    />

    <h2 className="text-2xl font-bold dark:text-white">
      Managers
    </h2>

    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
      {managersList.length}
    </span>

  </div>

  <MembersTable
    members={paginatedManagers}
    isAdmin={isAdmin}
    onView={setSelectedMember}
    onEdit={openEdit}
    onDelete={deleteMember}
    
  />

            {totalManagersPages > 1 && (
              <Pagination
                currentPage={
                  managersPage
                }
                totalPages={
                  totalManagersPages
                }
                onPageChange={
                  setManagersPage
                }
              />
            )}

</div>
)}

<div className="space-y-4 pt-4">

  <div className="flex items-center gap-3">

    <Users
      className="text-blue-600"
      size={22}
    />

    <h2 className="text-2xl font-bold dark:text-white">
      Members
    </h2>

    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
      {membersList.length}
    </span>

  </div>

  <MembersTable
    members={paginatedMembers}
    isAdmin={isAdmin}
    onView={setSelectedMember}
    onEdit={openEdit}
    onDelete={deleteMember}
    
  />

      {totalMembersPages > 1 && (
        <Pagination
          currentPage={
            membersPage
          }
          totalPages={
            totalMembersPages
          }
          onPageChange={
            setMembersPage
          }
        />
      )}

</div>
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
    managers={managers}
  />
)}

      {isAdmin && (
        <InviteMemberModal
          isOpen={isInviteOpen}
          onClose={() =>
            setIsInviteOpen(false)
          }
          onSend={handleInviteMember}
          inviteData={inviteData}
          setInviteData={setInviteData}
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

function MembersTable({
  members,
  isAdmin,
  onView,
  onEdit,
  onDelete,
}) {

return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

      <div className="overflow-x-auto">

        <table className="w-full min-w-[980px] text-left">

          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">

            <tr>
              <th className="px-5 py-4 font-semibold">
                Member
              </th>

              <th className="px-5 py-4 font-semibold">
                Role
              </th>

              <th className="px-5 py-4 font-semibold">
                Department
              </th>

              <th className="px-5 py-4 font-semibold">
                Status
              </th>

              <th className="px-5 py-4 font-semibold">
                Productivity
              </th>

              <th className="px-5 py-4 font-semibold">
                Workload
              </th>

              <th className="px-5 py-4 font-semibold">
                Location
              </th>

              <th className="px-5 py-4 text-right font-semibold">
                Actions
              </th>
            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">

            {members.map((member) => {

              const performance =
                productivityValue(
                  member.productivity
                );

              return (
                <tr
                  key={member.id}
                  className="transition hover:bg-slate-50 dark:hover:bg-zinc-800/60"
                >

                  <td className="px-5 py-4">

                    <div className="flex min-w-0 items-center gap-3">

                      <div
                        className={`
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-xl
                          ${member.color}
                          font-bold
                          text-white
                        `}
                      >

                        {member.avatar_url ? (
                          <img
                            src={member.avatar_url}
                            alt={member.full_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          member.avatar
                        )}

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
                          style={{
                            width: `${performance}%`,
                          }}
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

                      <span className="mx-2 text-slate-300 dark:text-zinc-700">
                        /
                      </span>

                      <span className="font-semibold text-slate-900 dark:text-white">
                        {member.projects}
                      </span>{" "}
                      projects

                    </div>

                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-zinc-400">

                    <div className="flex items-center gap-2">

                      <MapPin
                        size={15}
                        className="text-slate-400"
                      />

                      <span className="truncate">
                        {member.location}
                      </span>

                    </div>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex items-center justify-end gap-2">

                      <button
                        onClick={() =>
                          onView(member)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700"
                      >
                        <Eye size={15} />
                      </button>

                      {isAdmin && (
                        <>

                          <button
                            onClick={() =>
                              onEdit(member)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            onClick={() =>
                              onDelete(member.id)
                            }
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
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
      
      <p className="text-sm text-slate-500 dark:text-zinc-400">
        Page{" "}
        <span className="font-semibold text-slate-900 dark:text-white">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-900 dark:text-white">
          {totalPages}
        </span>
      </p>

      <div className="flex items-center gap-2">
        
        <button
          onClick={() =>
            onPageChange(
              currentPage - 1
            )
          }
          disabled={
            currentPage === 1
          }
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
        >
          Previous
        </button>

        <button
          onClick={() =>
            onPageChange(
              currentPage + 1
            )
          }
          disabled={
            currentPage ===
            totalPages
          }
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
        >
          Next
        </button>

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
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-zinc-800">
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

        <div className="space-y-6 p-5">
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

function MemberFormModal({
  draft,
  setDraft,
  isEditing,
  onClose,
  onSubmit,
  managers,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={onSubmit}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-zinc-800">
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

        <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">

          <Field label="Full Name">
            <input
              required
              value={draft.full_name || ""}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  full_name: event.target.value,
                })
              }
              className="input-field"
            />
          </Field>


          <Field label="Email">
            <input
              required
              type="email"
              value={draft.email || ""}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  email: event.target.value,
                })
              }
              className="input-field"
            />
          </Field>

          


          <Field label="Phone">
            <input
              value={draft.phone || ""}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  phone: event.target.value,
                })
              }
              className="input-field"
            />
          </Field>


          <Field label="Location">
            <input
              value={draft.location || ""}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  location: event.target.value,
                })
              }
              className="input-field"
            />
          </Field>


          <Field label="Role">
            <select
              value={draft.role || ""}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  role: event.target.value,
                })
              }
              className="input-field"
            >
              {roleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>


            <Field label="Assign Manager">
              <select
                value={draft.manager_id || ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    manager_id: event.target.value,
                  })
                }
                className="input-field"
              >
                <option value="">
                  No Manager
                </option>

                {managers.map((manager) => (
                  <option
                    key={manager.id}
                    value={manager.id}
                  >
                    {manager.full_name}
                  </option>
                ))}
              </select>
            </Field>



          <Field label="Department">
            <select
              value={draft.department || ""}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  department: event.target.value,
                })
              }
              className="input-field"
            >
              {departmentOptions
                .filter((option) => option !== "All")
                .map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
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
                setDraft({
                  ...draft,
                  productivity: `${event.target.value}%`,
                })
              }
              className="input-field"
            />
          </Field>


          <Field label="Tasks">
            <input
              type="number"
              min="0"
              value={draft.tasks || 0}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  tasks: Number(event.target.value),
                })
              }
              className="input-field"
            />
          </Field>


          <Field label="Projects">
            <input
              type="number"
              min="0"
              value={draft.projects || 0}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  projects: Number(event.target.value),
                })
              }
              className="input-field"
            />
          </Field>


          <Field label="Join Date">
            <input
              type="date"
              value={draft.joinDate || ""}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  joinDate: event.target.value,
                })
              }
              className="input-field"
            />
          </Field>


          <div className="md:col-span-2">
            <Field label="Profile Summary">
              <textarea
                rows={4}
                value={draft.bio || ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    bio: event.target.value,
                  })
                }
                className="input-field resize-none"
              />
            </Field>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 p-5 dark:border-zinc-800">
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
function InviteMemberModal({
  isOpen,
  onClose,
  onSend,
  inviteData,
  setInviteData,
}) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inviteData.email) return;

    onSend(inviteData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">
        
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-zinc-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Invite Member
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Send an invitation email to a new member
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            âœ•
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
              Email Address
            </label>

            <input
              type="email"
              required
              value={inviteData.email}
              onChange={(e) =>
                setInviteData({
                  email: e.target.value,
                })
              }
              placeholder="member@email.com"
              className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Send Invite
            </button>
          </div>

        </form>
      </div>
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
