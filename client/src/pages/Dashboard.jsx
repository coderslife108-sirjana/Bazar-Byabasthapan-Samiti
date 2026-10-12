
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/useLanguage";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const menuItems = [
    { label: t("Dashboard"), icon: "🏠", path: "/dashboard" },
    { label: t("My Reports"), icon: "📝", path: "/reports" },
    { label: t("My Complaints"), icon: "⚠️", path: "/reports/create" },
    { label: t("Notices"), icon: "📢", path: "/notices" },
    { label: t("Messages"), icon: "✉️", path: "/messages" },
    { label: t("Announcements"), icon: "📣", path: "/announcements" },
    { label: t("Documents"), icon: "📄", path: "/documents" },
    { label: t("My Profile"), icon: "👤", path: "/profile" },
  ];

  const quickActions = [
    {
      icon: "📝",
      title: t("Create Report"),
      description: t("Submit a new report to the administration."),
      path: "/reports/create",
      color: "bg-blue-50",
    },
    {
      icon: "⚠️",
      title: t("Submit Complaint"),
      description: t("Report an issue or problem in the bazaar."),
      path: "/reports/create",
      color: "bg-amber-50",
    },
    {
      icon: "📢",
      title: t("View Notices"),
      description: t("Read important committee notices."),
      path: "/notices",
      color: "bg-green-50",
    },
    {
      icon: "✉️",
      title: t("Messages"),
      description: t("Read private messages sent to your account."),
      path: "/messages",
      color: "bg-sky-50",
    },
    {
      icon: "📣",
      title: t("Announcements"),
      description: t("Read the latest committee announcements."),
      path: "/announcements",
      color: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-4 lg:hidden">
        <div>
          <h1 className="font-bold text-slate-800">{t("Dumkibas Bazar")}</h1>
          <p className="text-xs text-slate-500">
            {t("Byabasthapan Samiti")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? t("Close menu") : t("Open menu")}
          aria-expanded={menuOpen}
          className="rounded-lg border px-3 py-2 text-xl text-slate-700 hover:bg-slate-100"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* Mobile navigation */}
      {menuOpen && (
        <nav className="relative z-20 space-y-1 border-b bg-white p-4 lg:hidden">
          {menuItems.map((item) => (
            <button
              type="button"
              key={item.label}
              onClick={() => goTo(item.path)}
              className="w-full rounded-lg px-4 py-3 text-left text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}

          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg px-4 py-3 text-left text-red-600 hover:bg-red-50"
          >
            🚪 {t("Logout")}
          </button>
        </nav>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r bg-white lg:flex">
          <div className="border-b p-6">
            <h1 className="text-xl font-bold text-slate-800">
              {t("Dumkibas Bazar")}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {t("Byabasthapan Samiti")}
            </p>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            {menuItems.map((item) => (
              <button
                type="button"
                key={item.label}
                onClick={() => goTo(item.path)}
                className={`w-full rounded-lg px-4 py-3 text-left transition ${
                  item.path === "/dashboard"
                    ? "bg-blue-50 font-semibold text-blue-700"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="border-t p-4">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-lg px-4 py-3 text-left text-red-600 hover:bg-red-50"
            >
              🚪 {t("Logout")}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <section className="mb-8">
            <p className="text-sm text-slate-500">{t("Dashboard")}</p>

            <h2 className="mt-1 break-words text-2xl font-bold text-slate-800 sm:text-3xl">
              {t("Welcome,")} {user?.name || t("User")} 👋
            </h2>

            <p className="mt-2 text-slate-500">
              {t("Manage your reports, complaints, notices, and committee information.")}
            </p>
          </section>

          {/* Account summary */}
          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <button
              type="button"
              onClick={() => goTo("/reports")}
              className="rounded-xl border bg-white p-5 text-left transition hover:border-blue-300 hover:shadow-md"
            >
              <p className="text-sm text-slate-500">{t("My Reports")}</p>
              <p className="mt-2 font-semibold text-blue-700">
                {t("View my reports →")}
              </p>
            </button>

            <button
              type="button"
              onClick={() => goTo("/reports/create")}
              className="rounded-xl border bg-white p-5 text-left transition hover:border-amber-300 hover:shadow-md"
            >
              <p className="text-sm text-slate-500">{t("Complaints")}</p>
              <p className="mt-2 font-semibold text-amber-700">
                {t("Submit an issue →")}
              </p>
            </button>

            <button
              type="button"
              onClick={() => goTo("/notices")}
              className="rounded-xl border bg-white p-5 text-left transition hover:border-green-300 hover:shadow-md"
            >
              <p className="text-sm text-slate-500">{t("Notices")}</p>
              <p className="mt-2 font-semibold text-green-700">
                {t("Read notices →")}
              </p>
            </button>

            <div className="rounded-xl border bg-white p-5">
              <p className="text-sm text-slate-500">{t("Account")}</p>
              <p className="mt-2 font-semibold capitalize text-green-600">
                {t(user?.role || "Member")}
              </p>
            </div>
          </section>

          {/* Quick actions */}
          <section>
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              {t("Quick Actions")}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {quickActions.map((action) => (
                <button
                  type="button"
                  key={action.title}
                  onClick={() => goTo(action.path)}
                  className="group rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${action.color}`}
                  >
                    {action.icon}
                  </div>

                  <h4 className="font-semibold text-slate-800 group-hover:text-blue-700">
                    {action.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {action.description}
                  </p>

                  <p className="mt-4 text-sm font-semibold text-blue-600">
                    {t("Open section →")}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Account information */}
          <section className="mt-8 rounded-xl border bg-white p-5 sm:p-6">
            <h3 className="mb-5 text-lg font-semibold text-slate-800">
              {t("Account Information")}
            </h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <div>
                <p className="text-sm text-slate-500">{t("Name")}</p>
                <p className="mt-1 break-words font-medium text-slate-800">
                  {user?.name || t("Not available")}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">{t("Email")}</p>
                <p className="mt-1 break-all font-medium text-slate-800">
                  {user?.email || t("Not available")}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">{t("Role")}</p>
                <p className="mt-1 capitalize font-medium text-slate-800">
                  {t(user?.role || "Member")}
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
