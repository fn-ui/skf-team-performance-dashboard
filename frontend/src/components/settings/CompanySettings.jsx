import { useState } from "react";

import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Upload,
} from "lucide-react";

function CompanySettings() {
  const [companyData, setCompanyData] =
    useState({
      companyName:
        "SKF Technologies",
      website:
        "https://www.skf.com",
      email:
        "info@skf.com",
      phone:
        "+254 700 000 000",
      address:
        "Nairobi, Kenya",
      description:
        "Enterprise team performance and productivity management platform.",
    });

  const handleChange = (e) => {
    setCompanyData({
      ...companyData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSave = () => {
    console.log(
      "Company Settings:",
      companyData
    );

    alert(
      "Company settings updated successfully!"
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        <div>

          <h2 className="text-2xl font-bold dark:text-white">
            Company Settings
          </h2>

          <p className="text-slate-500 dark:text-zinc-400 mt-2">
            Manage company information,
            branding, and organization
            details.
          </p>

        </div>

        {/* LOGO */}
        <div className="relative w-24 h-24 rounded-3xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">

          <Building2
            size={42}
            className="text-slate-400"
          />

          <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg transition">

            <Upload size={16} />

          </button>

        </div>

      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

        {/* COMPANY NAME */}
        <div>

          <label className="block text-sm font-medium dark:text-white mb-2">
            Company Name
          </label>

          <div className="relative">

            <Building2
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              name="companyName"
              value={
                companyData.companyName
              }
              onChange={
                handleChange
              }
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

        </div>

        {/* WEBSITE */}
        <div>

          <label className="block text-sm font-medium dark:text-white mb-2">
            Website
          </label>

          <div className="relative">

            <Globe
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              name="website"
              value={
                companyData.website
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
            Company Email
          </label>

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="email"
              name="email"
              value={
                companyData.email
              }
              onChange={
                handleChange
              }
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

        </div>

        {/* PHONE */}
        <div>

          <label className="block text-sm font-medium dark:text-white mb-2">
            Phone Number
          </label>

          <div className="relative">

            <Phone
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              name="phone"
              value={
                companyData.phone
              }
              onChange={
                handleChange
              }
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none"
            />

          </div>

        </div>

        {/* ADDRESS */}
        <div className="md:col-span-2">

          <label className="block text-sm font-medium dark:text-white mb-2">
            Company Address
          </label>

          <div className="relative">

            <MapPin
              size={18}
              className="absolute left-4 top-4 text-slate-400"
            />

            <textarea
              rows={3}
              name="address"
              value={
                companyData.address
              }
              onChange={
                handleChange
              }
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white outline-none resize-none"
            />

          </div>

        </div>

        {/* DESCRIPTION */}
        <div className="md:col-span-2">

          <label className="block text-sm font-medium dark:text-white mb-2">
            Company Description
          </label>

          <textarea
            rows={5}
            name="description"
            value={
              companyData.description
            }
            onChange={handleChange}
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
          Save Company Settings
        </button>

      </div>

    </div>
  );
}

export default CompanySettings;