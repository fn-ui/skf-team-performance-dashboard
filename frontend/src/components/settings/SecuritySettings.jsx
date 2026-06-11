import { useState } from "react";

import {
  LockKeyhole,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

function SecuritySettings() {
  const [showPassword, setShowPassword] =
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

  const handleSave = () => {
    console.log(
      "Security Settings:",
      securityData
    );

    alert(
      "Security settings updated!"
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8">

      {/* HEADER */}
      <div>

        <h2 className="text-2xl font-bold dark:text-white">
          Security Settings
        </h2>

        <p className="text-slate-500 dark:text-zinc-400 mt-2">
          Manage your password,
          authentication, and account
          protection.
        </p>

      </div>

      {/* PASSWORD SECTION */}
      <div className="mt-10 space-y-6">

        {/* CURRENT PASSWORD */}
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

        {/* NEW PASSWORD */}
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
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

        </div>

        {/* CONFIRM PASSWORD */}
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
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

        </div>

      </div>

      {/* 2FA */}
      <div className="mt-10 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-start gap-4">

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">

              <ShieldCheck className="text-emerald-600" />

            </div>

            <div>

              <h3 className="text-lg font-bold dark:text-white">
                Two-Factor Authentication
              </h3>

              <p className="text-slate-500 dark:text-zinc-400 mt-1">
                Add an extra layer of
                security to your account.
              </p>

            </div>

          </div>

          {/* TOGGLE */}
          <label className="relative inline-flex items-center cursor-pointer">

            <input
              type="checkbox"
              name="twoFactor"
              checked={
                securityData.twoFactor
              }
              onChange={
                handleChange
              }
              className="sr-only peer"
            />

            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:bg-emerald-600 transition-all"></div>

            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>

          </label>

        </div>

      </div>

      {/* SAVE */}
      <div className="flex justify-end mt-10">

        <button
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl transition font-medium"
        >
          Save Security Settings
        </button>

      </div>

    </div>
  );
}

export default SecuritySettings;