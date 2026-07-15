import {
  X,
  HelpCircle,
  ShieldCheck,
  Users,
  User,
  Target,
  CalendarDays,
  CheckCircle2,
  BarChart3,
  FolderKanban,
  FileText,
  Clock3,
  Settings,
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  TrendingUp,
} from "lucide-react";

import {
  useState,
  useMemo,
} from "react";

import { useAuth } from "../../contexts/AuthContext";

function HelpModal({
  isOpen,
  onClose,
}) {
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || "support@example.com";
  const supportPhone = import.meta.env.VITE_SUPPORT_PHONE || "+12025550100";

  const { profile } =
    useAuth();

  const [search, setSearch] =
    useState("");

  const [openFaq, setOpenFaq] =
    useState(null);

  


  const roleConfig = {

    admin: {
      title: "Admin Guide",

      icon: ShieldCheck,

      color:
        "bg-emerald-100 text-emerald-600",

      description:
        "Manage the entire organization and monitor overall performance.",

      features: [
        {
          icon:
            FolderKanban,
          title:
            "Project Management",
          desc:
            "Create and manage organization projects.",
        },

        {
          icon: Users,
          title:
            "Team Management",
          desc:
            "Assign managers and organize teams.",
        },

        {
          icon: Target,
          title:
            "Company Goals",
          desc:
            "Create strategic organization goals.",
        },

        {
          icon:
            BarChart3,
          title:
            "Performance Analytics",
          desc:
            "Track organization productivity and KPIs.",
        },

        {
          icon:
            FileText,
          title:
            "Reports",
          desc:
            "Generate detailed company reports.",
        },

        {
          icon:
            Settings,
          title:
            "System Settings",
          desc:
            "Configure platform preferences and access.",
        },
      ],
    },

    manager: {
      title:
        "Manager Guide",

      icon: Users,

      color:
        "bg-blue-100 text-blue-600",

      description:
        "Lead your team, assign tasks and monitor team performance.",

      features: [
        {
          icon:
            FolderKanban,
          title:
            "Manage Projects",
          desc:
            "Oversee projects assigned to your team.",
        },

        {
          icon:
            CheckCircle2,
          title:
            "Assign Tasks",
          desc:
            "Distribute and monitor team tasks.",
        },

        {
          icon: Target,
          title:
            "Team Goals",
          desc:
            "Create and track team objectives.",
        },

        {
          icon:
            BarChart3,
          title:
            "Team Performance",
          desc:
            "Monitor productivity and task completion.",
        },

        {
          icon:
            CalendarDays,
          title:
            "Calendar Management",
          desc:
            "Schedule meetings and deadlines.",
        },

        {
          icon:
            FileText,
          title:
            "Performance Reports",
          desc:
            "Review team performance insights.",
        },
      ],
    },

    member: {
      title:
        "Member Guide",

      icon: User,

      color:
        "bg-amber-100 text-amber-600",

      description:
        "Stay productive, complete tasks and track your goals.",

      features: [
        {
          icon:
            CheckCircle2,
          title:
            "Task Updates",
          desc:
            "Update assigned task progress regularly.",
        },

        {
          icon: Target,
          title:
            "Goal Tracking",
          desc:
            "Monitor your assigned goals and progress.",
        },

        {
          icon:
            CalendarDays,
          title:
            "Team Calendar",
          desc:
            "Stay informed about meetings and deadlines.",
        },

        {
          icon:
            Clock3,
          title:
            "Deadlines",
          desc:
            "Track important delivery timelines.",
        },

        {
          icon:
            BarChart3,
          title:
            "Performance Metrics",
          desc:
            "View personal productivity insights.",
        },

        {
          icon:
            FileText,
          title:
            "Reports",
          desc:
            "Access your work summaries and updates.",
        },
      ],
    },
  };

  const currentRole =
    roleConfig[
      profile?.role
    ];


const faqData = {
  admin: [
    {
      question:
        "How do I create a company-wide goal?",

      answer:
        "Open the Goals page and click Create Goal. You can assign goals to individuals, managers, departments or the entire organization.",
    },

    {
      question:
        "How do I manage managers and members?",

      answer:
        "Go to the Team Management section where you can create users, assign managers and organize departments.",
    },

    {
      question:
        "How can I monitor company performance?",

      answer:
        "Use the Analytics and Reports pages to monitor KPIs, productivity trends, task completion and team efficiency.",
    },

    {
      question:
        "Can I edit or delete any project?",

      answer:
        "Yes. Admins have full access to create, update and delete all projects and goals across the platform.",
    },

    {
      question:
        "How do I generate company reports?",

      answer:
        "Navigate to Reports and generate performance, productivity or goal completion reports for the entire organization.",
    },
  ],

  manager: [
    {
      question:
        "How do I assign tasks to my team?",

      answer:
        "Open the Tasks page and create or edit a task. You can assign tasks only to members under your management.",
    },

    {
      question:
        "Can I create goals for my department?",

      answer:
        "Yes. Managers can create team goals and assign them to team members or specific departments.",
    },

    {
      question:
        "How do I monitor team performance?",

      answer:
        "Use the Team Performance dashboard to review completed tasks, productivity trends and active goals.",
    },

    {
      question:
        "Why can't I access admin settings?",

      answer:
        "System configuration, organization-wide controls and user administration are restricted to admins only.",
    },

    {
      question:
        "How do I schedule meetings or deadlines?",

      answer:
        "Use the Calendar page to create events, reminders and team deadlines.",
    },
  ],

  member: [
    {
      question:
        "How do I update my assigned tasks?",

      answer:
        "Open the Tasks page and update task status or progress percentage as you complete work.",
    },

    {
      question:
        "Can I create projects or assign tasks?",

      answer:
        "No. Members can only manage their assigned work while managers and admins handle assignments.",
    },

    {
      question:
        "How do I track my performance?",

      answer:
        "Use the Performance page to monitor completed tasks, productivity metrics and goal completion progress.",
    },

    {
      question:
        "Where can I see deadlines?",

      answer:
        "Your deadlines are available in Tasks, Calendar and Goals sections.",
    },

    {
      question:
        "Why can't I edit some goals?",

      answer:
        "Members can only update goals assigned to them. Editing organization goals requires manager or admin access.",
    },
  ],
};

const faqs =
  faqData[
    profile?.role
  ] || [];

  const filteredFaqs =
    useMemo(() => {

      return faqs.filter(
        (faq) =>
          faq.question
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          faq.answer
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [search]);

  const RoleIcon =
    currentRole?.icon;

    if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="relative w-full max-w-6xl bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden max-h-[94vh] overflow-y-auto">

        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 p-8">

          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-11 h-11 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >

            <X size={20} />

          </button>

          <div className="flex flex-col lg:flex-row lg:items-center gap-6">

            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg">

              <HelpCircle size={38} />

            </div>

            <div>

              <h2 className="text-4xl font-bold text-white">
                WorkPulse Help Center
              </h2>

              <p className="text-emerald-50 mt-3 max-w-2xl text-lg leading-relaxed">
                Learn how to use your
                team performance dashboard
                efficiently and improve
                collaboration, productivity
                and goal tracking.
              </p>

            </div>

          </div>

        </div>

        <div className="p-8 space-y-10">

          <div>

            <div className="relative">

              <Search
                size={18}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search help articles or FAQs..."
                className="w-full h-14 pl-14 pr-5 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 dark:text-white outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 transition"
              />

            </div>

          </div>

          <div className="bg-slate-50 dark:bg-zinc-800 rounded-[28px] border border-slate-200 dark:border-zinc-700 p-8">

            <div className="flex items-start gap-5 mb-8">

              <div
                className={`w-16 h-16 rounded-3xl flex items-center justify-center ${currentRole?.color}`}
              >

                {RoleIcon && (
                  <RoleIcon size={30} />
                )}

              </div>

              <div>

                <h3 className="text-3xl font-bold dark:text-white">

                  {
                    currentRole?.title
                  }

                </h3>

                <p className="text-slate-500 dark:text-zinc-400 mt-2 max-w-2xl">

                  {
                    currentRole?.description
                  }

                </p>

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {currentRole?.features?.map(
                (
                  feature,
                  index
                ) => {

                  const Icon =
                    feature.icon;

                  return (

                    <div
                      key={index}
                      className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-700 hover:shadow-lg transition"
                    >

                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">

                        <Icon size={24} />

                      </div>

                      <h4 className="text-lg font-bold dark:text-white">

                        {
                          feature.title
                        }

                      </h4>

                      <p className="text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">

                        {
                          feature.desc
                        }

                      </p>

                    </div>
                  );
                }
              )}

            </div>

          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-[28px] p-8">

            <div className="flex items-start gap-5">

              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">

                <TrendingUp size={30} />

              </div>

              <div>

                <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                  Productivity Tips
                </h3>

                <p className="text-emerald-600 dark:text-emerald-400 mt-2">
                  Best practices for improving
                  team productivity and workflow.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                  {[
                    "Update task progress daily",
                    "Prioritize high impact tasks",
                    "Monitor deadlines consistently",
                    "Track goal completion weekly",
                    "Communicate blockers early",
                    "Review team performance reports",
                  ].map(
                    (
                      tip,
                      index
                    ) => (

                      <div
                        key={index}
                        className="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900"
                      >

                        <CheckCircle2
                          size={18}
                          className="text-emerald-600"
                        />

                        <span className="text-slate-700 dark:text-zinc-300">
                          {tip}
                        </span>

                      </div>
                    )
                  )}

                </div>

              </div>

            </div>

          </div>

          <div>

            <h3 className="text-3xl font-bold dark:text-white mb-6">
              Frequently Asked Questions
            </h3>

            <div className="space-y-4">

              {filteredFaqs.map(
                (
                  faq,
                  index
                ) => {

                  const isOpen =
                    openFaq ===
                    index;

                  return (

                    <div
                      key={index}
                      className="border border-slate-200 dark:border-zinc-700 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900"
                    >

                      <button
                        onClick={() =>
                          setOpenFaq(
                            isOpen
                              ? null
                              : index
                          )
                        }
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
                      >

                        <span className="font-semibold dark:text-white text-lg">

                          {
                            faq.question
                          }

                        </span>

                        {isOpen ? (

                          <ChevronUp
                            size={20}
                            className="text-slate-400"
                          />

                        ) : (

                          <ChevronDown
                            size={20}
                            className="text-slate-400"
                          />
                        )}

                      </button>

                      {isOpen && (

                        <div className="px-6 pb-6 text-slate-600 dark:text-zinc-400 leading-relaxed">

                          {faq.answer}

                        </div>
                      )}

                    </div>
                  );
                }
              )}

            </div>

          </div>

{profile?.role !==
  "admin" && (

  <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-zinc-800 dark:to-zinc-900 rounded-[32px] border border-slate-200 dark:border-zinc-700 p-8">

    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

    <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl" />

    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

      <div>

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg">

            <HelpCircle size={30} />

          </div>

          <div>

            <h3 className="text-3xl font-bold dark:text-white">
              Need More Help?
            </h3>

            <p className="text-slate-500 dark:text-zinc-400 mt-2">
              Contact support anytime for technical
              issues, account access or dashboard assistance.
            </p>

          </div>

        </div>

      </div>

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-medium">

        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />

        Support Available

      </div>

    </div>

    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">

      <a
        href={`mailto:${supportEmail}`}
        className="group bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-[28px] p-7 border border-slate-200 dark:border-zinc-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
      >

        <div className="flex items-start justify-between">

          <div>

            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition">

              <Mail size={28} />

            </div>

            <h4 className="text-2xl font-bold dark:text-white">
              Email Support
            </h4>

            <p className="text-slate-500 dark:text-zinc-400 mt-3 leading-relaxed">
              Send an email for technical support,
              dashboard issues or account assistance.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">

              {supportEmail}

            </div>

          </div>

        </div>

      </a>

      <a
        href={`tel:${supportPhone}`}
        className="group bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-[28px] p-7 border border-slate-200 dark:border-zinc-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
      >

        <div className="flex items-start justify-between">

          <div>

            <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition">

              <Phone size={28} />

            </div>

            <h4 className="text-2xl font-bold dark:text-white">
              Call Support
            </h4>

            <p className="text-slate-500 dark:text-zinc-400 mt-3 leading-relaxed">
              Contact support directly for urgent
              issues, permissions or platform help.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">

              +254 740 839 000

            </div>

          </div>

        </div>

      </a>

    </div>

  </div>
)}
</div>
</div>
</div>

    
  );
}

export default HelpModal;
