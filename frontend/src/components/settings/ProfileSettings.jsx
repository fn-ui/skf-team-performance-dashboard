import { useEffect, useState } from "react";
import { useRef } from "react";

import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

import {
  User,
  Mail,
  Briefcase,
  Camera,
  Loader2,
} from "lucide-react";

import {
  getProfileSettings,
  updateProfileSettings,
} from "../../services/settingsService";

function ProfileSettings() {

  const {
    profile,
    refreshProfile,
  } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [formData, setFormData] =
    useState({
      full_name: "",
      email: "",
      role: "",
      bio: "",
      avatar_url: "",
    });

  // FETCH PROFILE SETTINGS
  useEffect(() => {

    if (profile?.id) {
      fetchProfile();
    }

  }, [profile]);

  const fetchProfile = async () => {

    try {

      const data =
        await getProfileSettings(
          profile.id
        );

      setFormData({
        full_name:
          data?.full_name || "",

        email:
          data?.email || "",

        role:
          data?.role || "",

        bio:
          data?.bio || "",

        avatar_url:
          data?.avatar_url || "",
      });

    } catch (error) {

      console.error(
        "PROFILE FETCH ERROR:",
        error.message
      );

    } finally {

      setLoading(false);

    }
  };

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  // SAVE PROFILE
  const handleSave = async () => {

    try {

      setSaving(true);

      await updateProfileSettings(
        profile.id,
        {
          full_name:
            formData.full_name,

          bio:
            formData.bio,
        }
      );

      // REFRESH SIDEBAR PROFILE
      await refreshProfile();

      alert(
        "Profile updated successfully!"
      );

    } catch (error) {

      console.error(
        "UPDATE PROFILE ERROR:",
        error.message
      );

      alert(
        "Failed to update profile."
      );

    } finally {

      setSaving(false);

    }
  };

  const handleAvatarUpload = async (e) => {
  try {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("profile-images")
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 2. Get public URL
    const { data } = supabase.storage
      .from("profile-images")
      .getPublicUrl(filePath);

    const avatar_url = data.publicUrl;

    // 3. Update DB
    await updateProfileSettings(profile.id, {
      avatar_url,
    });
    setFormData((prev) => ({
  ...prev,
  avatar_url,
}));

    // 4. Refresh UI
    await refreshProfile();

  } catch (error) {
    console.error("UPLOAD ERROR:", error.message);
    alert("Failed to upload image");
  } finally {
    setUploading(false);
  }
};

  // LOADING
  if (loading) {

    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8">

        <div className="flex items-center gap-3 dark:text-white">

          <Loader2 className="animate-spin" />

          Loading profile settings...

        </div>

      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        <div>

          <h2 className="text-2xl font-bold dark:text-white">
            Profile Settings
          </h2>

          <p className="text-slate-500 dark:text-zinc-400 mt-2">
            Update your admin profile
            information and account
            details.
          </p>

        </div>

        {/* PROFILE IMAGE */}
        <div className="relative">

          <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">

            {formData.avatar_url ? (

              <img
                src={
                  formData.avatar_url
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />

            ) : (

              <User
                size={40}
                className="text-slate-400"
              />

            )}

          </div>

          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg transition"
          >
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
              disabled
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-800 dark:text-white outline-none cursor-not-allowed"
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
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-2xl transition font-medium flex items-center gap-2"
        >

          {saving && (
            <Loader2
              size={18}
              className="animate-spin"
            />
          )}

          {saving
            ? "Saving..."
            : "Save Changes"}

        </button>

      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleAvatarUpload}
        className="hidden"
      />

    </div>
  );
}

export default ProfileSettings;