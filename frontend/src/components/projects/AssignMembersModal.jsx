import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Users,
  CheckCircle2,
  X,
} from "lucide-react";

function AssignMembersModal({
  isOpen,
  onClose,
  users = [],
  selectedUsers = [],
  onAssign,
}) {
  // 🔎 SEARCH
  const [search, setSearch] =
    useState("");

  // 👥 LOCAL STATE
  const [
    localSelected,
    setLocalSelected,
  ] = useState([]);

  // 🔥 SYNC USERS WHEN MODAL OPENS
  useEffect(() => {
    if (!isOpen) return;

    setLocalSelected(
      Array.isArray(selectedUsers)
        ? [...selectedUsers]
        : []
    );
  }, [isOpen, selectedUsers]);

  // ❌ HIDE MODAL
  if (!isOpen) return null;

  // 🔎 FILTER USERS
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName =
        user?.full_name || "";

      const email =
        user?.email || "";

      const role =
        user?.role || "";

      const searchValue =
        search.toLowerCase();

      return (
        fullName
          .toLowerCase()
          .includes(searchValue) ||
        email
          .toLowerCase()
          .includes(searchValue) ||
        role
          .toLowerCase()
          .includes(searchValue)
      );
    });
  }, [users, search]);

  // ✅ TOGGLE USER
  const toggleUser = (id) => {
    setLocalSelected((prev) =>
      prev.includes(id)
        ? prev.filter(
            (userId) =>
              userId !== id
          )
        : [...prev, id]
    );
  };

  // 💾 SAVE
  const handleSave = () => {
    onAssign(localSelected);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">

      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-zinc-800">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">

              <Users size={26} />

            </div>

            <div>

              <h2 className="text-2xl font-bold dark:text-white">
                Assign Members
              </h2>

              <p className="mt-1 text-slate-500 dark:text-zinc-400">
                Select team members for this task
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-red-100 hover:text-red-500 dark:bg-zinc-800 dark:hover:bg-red-500/10"
          >
            <X size={18} />
          </button>

        </div>

        {/* SEARCH */}
        <div className="border-b border-slate-200 p-6 dark:border-zinc-800">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-3.5 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none transition focus:ring-2 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />

          </div>

        </div>

        {/* USERS */}
        <div className="scrollbar-hide max-h-[420px] overflow-y-auto p-6 space-y-4">

          {filteredUsers.length ===
          0 ? (
            <div className="py-14 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-zinc-800">

                <Users size={28} />

              </div>

              <h3 className="mt-4 text-lg font-semibold dark:text-white">
                No users found
              </h3>

              <p className="mt-1 text-slate-500 dark:text-zinc-400">
                Try another keyword
              </p>

            </div>
          ) : (
            filteredUsers.map(
              (user) => {
                const isSelected =
                  localSelected.includes(
                    user.id
                  );

                return (
                  <div
                    key={user.id}
                    onClick={() =>
                      toggleUser(
                        user.id
                      )
                    }
                    className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200

                    ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                        : "border-slate-200 hover:border-emerald-400 dark:border-zinc-700"
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 font-bold text-slate-700 dark:bg-zinc-800 dark:text-zinc-200">

                          {user.full_name
                            ?.charAt(0)
                            ?.toUpperCase()}

                        </div>

                        <div>

                          <h3 className="font-semibold dark:text-white">
                            {
                              user.full_name
                            }
                          </h3>

                          <p className="text-sm text-slate-500 dark:text-zinc-400">
                            {user.email ||
                              "No email"}
                          </p>

                          <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                            {user.role}
                          </span>

                        </div>

                      </div>

                      {isSelected ? (
                        <div className="text-emerald-600 dark:text-emerald-400">

                          <CheckCircle2
                            size={24}
                          />

                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-slate-300 dark:border-zinc-600" />
                      )}

                    </div>

                  </div>
                );
              }
            )
          )}

        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-slate-200 p-6 dark:border-zinc-800">

          <p className="text-sm text-slate-500 dark:text-zinc-400">

            {localSelected.length} member
            {localSelected.length !==
            1
              ? "s"
              : ""}{" "}
            selected

          </p>

          <div className="flex items-center gap-4">

            <button
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-3 transition hover:bg-slate-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Save Members
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AssignMembersModal;