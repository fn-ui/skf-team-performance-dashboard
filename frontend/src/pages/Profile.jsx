import {
  useEffect,
  useState,
} from "react";

import {
  Camera,
  Save,
} from "lucide-react";

import { supabase } from "../lib/supabase";

import { useAuth } from "../contexts/AuthContext";
import ChangePasswordModal from "./ChangePasswordModal";

function Profile() {
 const {
  user,
  profile,
  refreshProfile,
} = useAuth();

  const [
  showPasswordModal,
  setShowPasswordModal,
] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [avatarUrl, setAvatarUrl] =
    useState("");


  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [department, setDepartment] =
    useState("");


  useEffect(() => {
    const fetchDetails =
      async () => {
        if (!user) return;

        try {
          setLoading(true);


          setFullName(
            profile?.full_name || ""
          );


          const { data, error } =
            await supabase
              .from("member_details")
              .select(`
                phone,
                location,
                bio,
                avatar_url,
                department
              `)
              .eq("user_id", user.id)
              .maybeSingle();

          if (error) {
            console.error(error);
          }

          if (data) {
            setPhone(
              data.phone || ""
            );

            setLocation(
              data.location || ""
            );

            setBio(
              data.bio || ""
            );

            setAvatarUrl(
              data.avatar_url || ""
            );

            setDepartment(
              data.department || ""
            );
          }
        } catch (err) {
          console.error(err);
        }

        setLoading(false);
      };

    fetchDetails();
  }, [user, profile]);


  const handleImageUpload =
    async (e) => {
      try {
        const file =
          e.target.files?.[0];

        if (!file || !user) return;

        const fileExt =
          file.name
            .split(".")
            .pop();

        const fileName = `${user.id}.${fileExt}`;

        const filePath = `avatars/${fileName}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from("profile-images")
          .upload(
            filePath,
            file,
            {
              upsert: true,
            }
          );

        if (uploadError) {
          throw uploadError;
        }

        const { data } =
          supabase.storage
            .from(
              "profile-images"
            )
            .getPublicUrl(
              filePath
            );

        const imageUrl =
              `${data.publicUrl}?v=${Date.now()}`;

            setAvatarUrl(imageUrl);
      } catch (err) {
        console.error(err);

        alert(
          "Failed to upload image"
        );
      }
    };


  const handleSave =
    async (e) => {
      e.preventDefault();

      if (!user) return;

      try {
        setSaving(true);


        const {
          error: profileError,
        } = await supabase
          .from("profiles")
          .update({
            full_name:
              fullName,
          })
          .eq("id", user.id);

        if (profileError) {
          throw profileError;
        }

            const {
            error: detailsError,
            } = await supabase
            .from("member_details")
            .upsert(
                {
                user_id: user.id,

                phone,

                location,

                bio,

                department,

                avatar_url:
                    avatarUrl,
                },
                {
                onConflict:
                    "user_id",
                }
            );

            if (detailsError) {
            throw detailsError;
            }
            await refreshProfile();

            window.dispatchEvent(
              new Event("profile-updated")
            );

        alert(
          "Profile updated successfully"
        );
      } catch (err) {
        console.error(err);

        alert(
          "Failed to update profile"
        );
      }

      setSaving(false);
    };

  if (loading) {
    return (
      <div className="p-5 text-slate-500 dark:text-zinc-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-5 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-5 shadow-xl dark:bg-zinc-900">

        <div className="mb-10 flex flex-col items-center">

          <div className="relative mb-5">
            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-emerald-500 text-5xl font-bold text-white shadow-2xl">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                fullName
                  ?.charAt(0)
                  ?.toUpperCase() ||
                "U"
              )}
            </div>


            <label className="absolute bottom-2 right-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition hover:scale-105 hover:bg-emerald-700">
              <Camera size={18} />

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={
                  handleImageUpload
                }
              />
            </label>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Edit Profile
          </h1>

          <p className="mt-2 text-slate-500 dark:text-zinc-400">
            Update your account
            details and personal
            information.
          </p>
        </div>


        <form
          onSubmit={handleSave}
          className="grid gap-6 md:grid-cols-2"
        >

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }
              placeholder="Enter full name"
              className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
              Phone
            </label>

            <input
              type="text"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              placeholder="+254..."
              className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
              Location
            </label>

            <input
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
              placeholder="Nairobi, Kenya"
              className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          


            <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
                Department
            </label>

            <input
                type="text"
                disabled
                value={
                department || "Not Assigned Yet"
                }
                className="w-full cursor-not-allowed rounded-2xl border border-slate-300 bg-slate-100 p-4 text-slate-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
            />

            <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400">
                Department is assigned by the admin.
            </p>
            </div>


          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
              Email
            </label>

            <input
              type="email"
              disabled
              value={
                user?.email || ""
              }
              className="w-full cursor-not-allowed rounded-2xl border border-slate-300 bg-slate-100 p-4 text-slate-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
              Role
            </label>

            <input
              type="text"
              disabled
              value={
                profile?.role ||
                "member"
              }
              className="w-full cursor-not-allowed rounded-2xl border border-slate-300 bg-slate-100 p-4 capitalize text-slate-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
            />
          </div>


          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
              Bio
            </label>

            <textarea
              rows={5}
              value={bio}
              onChange={(e) =>
                setBio(
                  e.target.value
                )
              }
              placeholder="Tell the team about yourself..."
              className="w-full rounded-2xl border border-slate-300 bg-white p-4 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
   


          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 p-4 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save size={18} />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>

<div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
  
  <div className="mb-4">
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
      Security
    </h3>

    <p className="text-sm text-slate-500 dark:text-slate-400">
      Manage your password and account security.
    </p>
  </div>

  <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">
    
    <div>
      <h4 className="font-medium text-slate-900 dark:text-white">
        Password
      </h4>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Change your account password.
      </p>
    </div>

    <button
      onClick={() =>
        setShowPasswordModal(true)
      }
      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
    >
      Change Password
    </button>
  </div>
</div>
      </div>
           <ChangePasswordModal
            isOpen={showPasswordModal}
            onClose={() =>
              setShowPasswordModal(false)
            }
          />
    </div>
  );
}

export default Profile;
