import { useState } from "react";

import {
  LockKeyhole,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

function SecuritySettings() {

  const [showPassword, setShowPassword] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [securityData, setSecurityData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      twoFactor: false,
    });

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setSecurityData({
      ...securityData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });

  };

  const handleSave = async () => {

    if (
      !securityData.newPassword ||
      !securityData.confirmPassword
    ) {

      return alert(
        "Please fill in all password fields."
      );
    }

    if (
      securityData.newPassword !==
      securityData.confirmPassword
    ) {

      return alert(
        "Passwords do not match."
      );
    }

    if (
      securityData.newPassword.length <
      6
    ) {

      return alert(
        "Password must be at least 6 characters."
      );
    }

    try {

      setSaving(true);

      const { error } =
        await supabase.auth.updateUser({
          password:
            securityData.newPassword,
        });

      if (error) throw error;

      alert(
        "Password updated successfully!"
      );

      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        twoFactor: false,
      });

    } catch (error) {

      console.error(
        "PASSWORD UPDATE ERROR:",
        error.message
      );

      alert(
        error.message ||
          "Failed to update password."
      );

    } finally {

      setSaving(false);

    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

      <div>

        <h2 className="text-2xl font-bold dark:text-white">
          Security Settings
        </h2>

        <p className="text-slate-500 dark:text-zinc-400 mt-2">
          Manage your admin password
          and account protection.
        </p>

      </div>

      <div className="mt-10 space-y-6">

        <div>

          <label className="block text-sm font-medium dark:text-white mb-2">
            Current Password
          </label>

          <div className="relative">

            <LockKeyhole
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="currentPassword"
              value={
                securityData.currentPassword
              }
              onChange={
                handleChange
              }
              placeholder="Enter current password"
              className="w-full pl-11 pr-12 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >

              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}

            </button>

          </div>

        </div>

        <div>

          <label className="block text-sm font-medium dark:text-white mb-2">
            New Password
          </label>

          <div className="relative">

            <LockKeyhole
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="newPassword"
              value={
                securityData.newPassword
              }
              onChange={
                handleChange
              }
              placeholder="Enter new password"
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

        </div>

        <div>

          <label className="block text-sm font-medium dark:text-white mb-2">
            Confirm Password
          </label>

          <div className="relative">

            <LockKeyhole
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              value={
                securityData.confirmPassword
              }
              onChange={
                handleChange
              }
              placeholder="Confirm new password"
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

        </div>

      </div>

      <div className="mt-10 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">

        <div className="flex items-start gap-4">

          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">

            <ShieldCheck className="text-emerald-600" />

          </div>

          <div>

            <h3 className="text-lg font-bold dark:text-white">
              Account Protection
            </h3>

            <p className="text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Keep your admin account
              secure by using a strong
              password and updating it
              regularly.
            </p>

          </div>

        </div>

      </div>

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
            : "Save Security Settings"}

        </button>

      </div>

    </div>
  );
}

export default SecuritySettings;
