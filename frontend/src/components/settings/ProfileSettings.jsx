import { useState } from "react";

import { useAuth } from "../../contexts/AuthContext";

import {
  User,
  Mail,
  Briefcase,
  Camera,
} from "lucide-react";

function ProfileSettings() {
  const { profile } = useAuth();

  const [formData, setFormData] =
    useState({
      full_name:
        profile?.full_name || "",
      email: profile?.email || "",
      role: profile?.role || "",
      bio: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSave = () => {
    console.log(
      "Saving profile:",
      formData
    );

    alert(
      "Profile updated successfully!"
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        <div>

          <h2 className="text-2xl font-bold dark:text-white">
            Profile Settings
          </h2>

          <p className="text-slate-500 dark:text-zinc-400 mt-2">
            Update your personal
            information and account
            details.
          </p>

        </div>

        {/* PROFILE IMAGE */}
        <div className="relative w-24 h-24 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">

          <User
            size={40}
            className="text-slate-400"
          />

          <button className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg transition">

            <Camera size={16} />

          </button>

        </div>

      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

        {/* FULL NAME */}
        <div>

          <label className="block text-sm font-medium dark:text-white mb-2">
            Full Name
          </label>

          <div className="relative">

            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              name="full_name"
              value={
                formData.full_name
              }
              onChange={
                handleChange
              }
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

        </div>

        {/* EMAIL */}
        <div>

          <label className="block text-sm font-medium dark:text-white mb-2">
            Email Address
          </label>

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={
                handleChange
              }
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

        </div>

        {/* ROLE */}
        <div>

          <label className="block text-sm font-medium dark:text-white mb-2">
            Role
          </label>

          <div className="relative">

            <Briefcase
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              name="role"
              value={formData.role}
              disabled
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-800 dark:text-white outline-none cursor-not-allowed"
            />

          </div>

        </div>

        {/* BIO */}
        <div className="md:col-span-2">

          <label className="block text-sm font-medium dark:text-white mb-2">
            Bio
          </label>

          <textarea
            rows={5}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write something about yourself..."
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none resize-none"
          />

        </div>

      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end mt-10">

        <button
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl transition font-medium"
        >
          Save Changes
        </button>

      </div>

    </div>
  );
}

export default ProfileSettings;