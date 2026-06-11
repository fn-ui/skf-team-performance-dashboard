import { useEffect, useState } from "react";
import { getProfiles, updateProfileRole } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

function AdminUsers() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getProfiles();
        if (!mounted) return;
        setProfiles(data || []);
      } catch (err) {
        console.error("Failed to load profiles", err);
      } finally {
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const handleChangeRole = async (id, role) => {
    try {
      const updated = await updateProfileRole(id, role);
      setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      console.error("Failed to update role", err);
      setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, role } : p)));
    }
  };

  if (loading) return <div className="flex-1 p-6">Loading users…</div>;

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">User Management</h1>
        <p className="mt-2 text-slate-500">Manage user roles and access.</p>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="text-sm text-slate-500">
              <th className="py-3">ID</th>
              <th className="py-3">Name</th>
              <th className="py-3">Role</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="py-3 text-sm text-slate-700">{p.id}</td>
                <td className="py-3 text-sm text-slate-700">{p.full_name || "—"}</td>
                <td className="py-3 text-sm text-slate-700">
                  <select
                    value={p.role}
                    onChange={(e) => handleChangeRole(p.id, e.target.value)}
                    className="rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="admin">admin</option>
                    <option value="manager">manager</option>
                    <option value="member">member</option>
                  </select>
                </td>
                <td className="py-3 text-sm text-slate-700">
                  {profile?.id === p.id ? <em>(you)</em> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;
