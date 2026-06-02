import { useState } from "react";
function Members() {
    const [search, setSearch] = useState("");
const [department, setDepartment] = useState("All");

const [selectedMember, setSelectedMember] = useState(null);
const members = [
  {
    name: "Faith Njeri",
    role: "Team Manager",
    department: "Management",
    tasks: 34,
    productivity: "96%",
    status: "Active",
    avatar: "FN",
    color: "bg-emerald-500",

    // EXTRA PROFILE DATA
    email: "faith@workpulse.com",
    phone: "+254 712 345 678",
    joinDate: "12 Jan 2026",
    projects: 8,
    location: "Nairobi, Kenya",
    bio: "Leading team productivity, collaboration, and overall operations management across all departments.",
  },

  {
    name: "John Mwangi",
    role: "Frontend Developer",
    department: "Engineering",
    tasks: 28,
    productivity: "92%",
    status: "Busy",
    avatar: "JM",
    color: "bg-blue-500",

    // EXTRA PROFILE DATA
    email: "john@workpulse.com",
    phone: "+254 701 223 445",
    joinDate: "03 Mar 2026",
    projects: 5,
    location: "Kiambu, Kenya",
    bio: "Specialized in building responsive frontend interfaces and interactive dashboard experiences.",
  },

  {
    name: "Grace Wambui",
    role: "UI/UX Designer",
    department: "Design",
    tasks: 25,
    productivity: "89%",
    status: "Away",
    avatar: "GW",
    color: "bg-pink-500",

    // EXTRA PROFILE DATA
    email: "grace@workpulse.com",
    phone: "+254 711 778 990",
    joinDate: "20 Feb 2026",
    projects: 6,
    location: "Nakuru, Kenya",
    bio: "Designing intuitive user experiences, modern interfaces, and maintaining design consistency.",
  },

  {
    name: "Michael Otieno",
    role: "Backend Developer",
    department: "Engineering",
    tasks: 30,
    productivity: "94%",
    status: "Active",
    avatar: "MO",
    color: "bg-purple-500",

    // EXTRA PROFILE DATA
    email: "michael@workpulse.com",
    phone: "+254 798 445 221",
    joinDate: "15 Apr 2026",
    projects: 7,
    location: "Kisumu, Kenya",
    bio: "Focused on backend APIs, database architecture, and secure system integrations.",
  },
];
    /* FILTER MEMBERS */
const filteredMembers = members.filter((member) => {
  const matchesSearch = member.name
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesDepartment =
    department === "All" ||
    member.department === department;

  return matchesSearch && matchesDepartment;
});

/* PAGINATION */
const [currentPage, setCurrentPage] = useState(1);

const membersPerPage = 3;

const indexOfLastMember = currentPage * membersPerPage;

const indexOfFirstMember =
  indexOfLastMember - membersPerPage;

const currentMembers = filteredMembers.slice(
  indexOfFirstMember,
  indexOfLastMember
);

const totalPages = Math.ceil(
  filteredMembers.length / membersPerPage
);
  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 p-6 dark:bg-zinc-950">

      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">

        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
            Team Members
          </h1>

          <p className="text-slate-500 dark:text-zinc-400 mt-2">
            Manage and monitor your team members.
          </p>
        </div>

        <button className="rounded-2xl bg-emerald-600 px-5 py-3 text-white font-medium hover:bg-emerald-700 transition">
          + Add Member
        </button>

      </div>
{/* MEMBER STATS */}
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

  {[
    {
      title: "Total Members",
      value: "48",
      color: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      title: "Active Members",
      value: "39",
      color: "bg-emerald-100",
      text: "text-emerald-600",
    },
    {
      title: "Team Leads",
      value: "8",
      color: "bg-purple-100",
      text: "text-purple-600",
    },
    {
      title: "New This Month",
      value: "12",
      color: "bg-pink-100",
      text: "text-pink-600",
    },
  ].map((stat, index) => (
    <div
      key={index}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-zinc-900 dark:border-zinc-800"
    >

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            {stat.title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-800 dark:text-white">
            {stat.value}
          </h2>

        </div>

        <div className={`${stat.color} p-4 rounded-2xl`}>
          <div className={`h-5 w-5 rounded-full ${stat.text} bg-current`} />
        </div>

      </div>

    </div>
  ))}

</div>
      {/* MEMBERS GRID */}
      <div className="mt-8">

        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          {/* SEARCH */}
          <div className="relative w-full md:w-[320px]">

            <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
/>

          </div>

          {/* FILTERS */}
          <div className="flex items-center gap-3">

           <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition hover:bg-slate-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300"
            >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Management">Management</option>
            </select>

          </div>

        </div>

      </div>

      {/* MEMBERS TABLE */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800">

        {/* TABLE HEADER */}
        <div className="grid grid-cols-7 gap-4 border-b border-slate-200 px-6 py-5 text-sm font-semibold text-slate-500 dark:border-zinc-800 dark:text-zinc-400 min-w-[1000px]">

          <p>Member</p>
          <p>Department</p>
          <p>Role</p>
          <p>Tasks</p>
          <p>Productivity</p>
          <p>Status</p>
          <p>Actions</p>

        </div>
            {filteredMembers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">

                <h3 className="text-xl font-semibold text-slate-700 dark:text-white">
                No members found
                </h3>

                <p className="mt-2 text-slate-500 dark:text-zinc-400">
                Try adjusting your search or filters.
                </p>

            </div>
            )}
        {/* TABLE ROWS */}
        {currentMembers.map((member, index) => (

          <div
            key={index}
            className="grid grid-cols-7 gap-4 items-center border-b border-slate-100 px-6 py-5 transition hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800/40 min-w-[1000px]"
          >

            {/* MEMBER */}
            <div className="flex items-center gap-4">

              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold text-white ${member.color}`}>
                {member.avatar}
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  {member.name}
                </h3>

                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  @{member.name.toLowerCase().replace(" ", "")}
                </p>
              </div>

            </div>

            {/* DEPARTMENT */}
            <p className="font-medium text-slate-700 dark:text-zinc-200">
              {member.department}
            </p>

            {/* ROLE */}
            <p className="text-slate-600 dark:text-zinc-300">
              {member.role}
            </p>

            {/* TASKS */}
            <p className="font-semibold text-slate-800 dark:text-white">
              {member.tasks}
            </p>

            {/* PRODUCTIVITY */}
            <div>
              <p className="text-sm font-semibold text-emerald-600 mb-1">
                {member.productivity}
              </p>

              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
            style={{ width: member.productivity }}
          />
              </div>
            </div>

            {/* STATUS */}
            <div className="flex items-center gap-2">
                <div
                    className={`h-2.5 w-2.5 rounded-full ${
                    member.status === "Active"
                        ? "bg-emerald-500"
                        : member.status === "Busy"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                />

                <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    member.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : member.status === "Busy"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                    {member.status}
                </span>
            </div>

           {/* ACTIONS */}
<div className="relative group">

  {/* MAIN BUTTON */}
  <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white transition hover:bg-emerald-700">
    More
  </button>

  {/* DROPDOWN */}
  <div className="invisible absolute right-0 top-12 z-20 w-44 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:border-zinc-700 dark:bg-zinc-900">

    {/* VIEW */}
    <button
      onClick={() => setSelectedMember(member)}
      className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      View Profile
    </button>

    {/* MESSAGE */}
    <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
      Message
    </button>

    {/* EDIT */}
    <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-950/30">
      Edit
    </button>

    {/* PROMOTE */}
    <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-purple-600 transition hover:bg-purple-50 dark:hover:bg-purple-950/30">
      Promote
    </button>

    {/* SUSPEND */}
    <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-yellow-700 transition hover:bg-yellow-50 dark:hover:bg-yellow-950/30">
      Suspend
    </button>

    {/* REMOVE */}
    <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30">
      Remove
    </button>

  </div>

</div>
</div>

))}
{/* PAGINATION */}
<div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

  {/* INFO */}
  <p className="text-sm text-slate-500 dark:text-zinc-400">
    Showing{" "}
    <span className="font-semibold text-slate-700 dark:text-white">
      {indexOfFirstMember + 1}
    </span>
    {" "}to{" "}
    <span className="font-semibold text-slate-700 dark:text-white">
      {Math.min(indexOfLastMember, filteredMembers.length)}
    </span>
    {" "}of{" "}
    <span className="font-semibold text-slate-700 dark:text-white">
      {filteredMembers.length}
    </span>
    {" "}members
  </p>

  {/* BUTTONS */}
  <div className="flex items-center gap-2">

    {/* PREVIOUS */}
    <button
      onClick={() =>
        setCurrentPage((prev) => Math.max(prev - 1, 1))
      }
      disabled={currentPage === 1}
      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300"
    >
      Previous
    </button>

    {/* PAGE NUMBERS */}
    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentPage(index + 1)}
        className={`h-10 w-10 rounded-xl text-sm font-semibold transition ${
          currentPage === index + 1
            ? "bg-emerald-600 text-white"
            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300"
        }`}
      >
        {index + 1}
      </button>
    ))}

    {/* NEXT */}
    <button
      onClick={() =>
        setCurrentPage((prev) =>
          Math.min(prev + 1, totalPages)
        )
      }
      disabled={currentPage === totalPages}
      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300"
    >
      Next
    </button>

  </div>

</div>
</div>
    {/* MEMBER PROFILE MODAL */}
    {selectedMember && (    

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

    {/* MODAL CARD */}
    <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl dark:bg-zinc-900">

      {/* TOP */}
      <div className="flex items-start justify-between mb-8">

        <div className="flex items-center gap-5">

          {/* AVATAR */}
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-3xl text-2xl font-bold text-white ${selectedMember.color}`}
          >
            {selectedMember.avatar}
          </div>

          {/* INFO */}
          <div>

            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
              {selectedMember.name}
            </h2>

            <p className="mt-1 text-slate-500 dark:text-zinc-400">
              {selectedMember.role}
            </p>

            <div className="mt-3 flex items-center gap-2">

              <div
                className={`h-3 w-3 rounded-full ${
                  selectedMember.status === "Active"
                    ? "bg-emerald-500"
                    : selectedMember.status === "Busy"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              />

              <span className="text-sm font-medium text-slate-600 dark:text-zinc-300">
                {selectedMember.status}
              </span>

            </div>

          </div>

        </div>

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setSelectedMember(null)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300"
        >
          ✕
        </button>

      </div>

      {/* DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* CARD */}
        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-800/50">

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Department
          </p>

          <h3 className="mt-2 text-xl font-semibold text-slate-800 dark:text-white">
            {selectedMember.department}
          </h3>

        </div>

        {/* CARD */}
        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-800/50">

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Tasks Completed
          </p>

          <h3 className="mt-2 text-xl font-semibold text-slate-800 dark:text-white">
            {selectedMember.tasks}
          </h3>

        </div>

        {/* CARD */}
        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-800/50">

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Productivity
          </p>

          <h3 className="mt-2 text-xl font-semibold text-emerald-600">
            {selectedMember.productivity}
          </h3>

        </div>

        {/* CARD */}
        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-800/50">

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Email
          </p>

          <h3 className="mt-2 text-lg font-semibold text-slate-800 dark:text-white">
            {selectedMember.email}
            </h3>

        </div>
        {/* PHONE */}
        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-800/50">

        <p className="text-sm text-slate-500 dark:text-zinc-400">
            Phone
        </p>

        <h3 className="mt-2 text-lg font-semibold text-slate-800 dark:text-white">
            {selectedMember.phone}
        </h3>

        </div>

        {/* LOCATION */}
        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-800/50">

        <p className="text-sm text-slate-500 dark:text-zinc-400">
            Location
        </p>

        <h3 className="mt-2 text-lg font-semibold text-slate-800 dark:text-white">
            {selectedMember.location}
        </h3>

        </div>

        {/* JOIN DATE */}
        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-800/50">

        <p className="text-sm text-slate-500 dark:text-zinc-400">
            Join Date
        </p>

        <h3 className="mt-2 text-lg font-semibold text-slate-800 dark:text-white">
            {selectedMember.joinDate}
        </h3>

        </div>

        {/* PROJECTS */}
        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-zinc-800/50">

        <p className="text-sm text-slate-500 dark:text-zinc-400">
            Active Projects
        </p>

        <h3 className="mt-2 text-lg font-semibold text-slate-800 dark:text-white">
            {selectedMember.projects}
        </h3>

        </div>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="mt-8 flex flex-wrap gap-4">

        <button className="rounded-2xl bg-emerald-600 px-5 py-3 text-white font-medium hover:bg-emerald-700 transition">
          Send Message
        </button>

        <button className="rounded-2xl border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
          Edit Profile
        </button>

      </div>

    </div>

  </div>
)}
    </div>
  );
}

export default Members;