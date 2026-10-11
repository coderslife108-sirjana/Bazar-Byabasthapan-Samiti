
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useLanguage } from "../context/useLanguage";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { logout } = useAuth();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    totalReports: 0,
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const admin = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [usersResponse, statsResponse] = await Promise.all([
        api.get("/admin/pending-users"),
        api.get("/admin/dashboard-stats"),
      ]);

      setUsers(
        Array.isArray(usersResponse.data.users)
          ? usersResponse.data.users
          : []
      );
      setStats((previous) => ({
        ...previous,
        ...statsResponse.data,
      }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load dashboard information. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleUserAction = async (userId, action) => {
    const actionName = `${userId}-${action}`;
    setActionLoading(actionName);
    setError("");

    try {
      await api.put(`/admin/users/${userId}/${action}`, {});
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${action} this user. Please try again.`
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const closeMenuAndNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const navItems = [
    { label: "Dashboard", icon: "⌂", path: "/admin" },
    { label: "Reports", icon: "▤", path: "/admin/reports" },
    { label: "Users", icon: "♙", path: "/admin/users" },
    { label: "Notices", icon: "▣", path: "/admin/notices" },
    {
      label: "Announcements",
      icon: "◉",
      path: "/admin/announcements",
    },
  ];

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: "♙",
      color: "bg-sky-50 text-sky-700",
      note: "Registered accounts",
    },
    {
      label: "Active Users",
      value: stats.activeUsers,
      icon: "✓",
      color: "bg-emerald-50 text-emerald-700",
      note: "Approved accounts",
    },
    {
      label: "Pending Requests",
      value: stats.pendingUsers,
      icon: "◷",
      color: "bg-amber-50 text-amber-700",
      note: "Awaiting review",
    },
    {
      label: "Total Reports",
      value: stats.totalReports,
      icon: "▤",
      color: "bg-violet-50 text-violet-700",
      note: "Community reports",
    },
  ];

  const Sidebar = ({ mobile = false }) => (
    <>
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-xl font-bold shadow-sm">
            D
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">
              {t("Dumkibas Bazar")}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {t("Byabasthapan Samiti")}
            </p>
          </div>
        </div>
        {mobile && (
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label={t("Close menu")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-xl text-slate-700 hover:bg-slate-50"
          >
            ×
          </button>
        )}
      </div>

      <div className="px-4 pt-6 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Management
      </div>

      <nav className="px-3 space-y-1 flex-1">
        {navItems.map((item) => {
          const active = item.path === "/admin";

          return (
            <button
              key={item.path}
              onClick={() => closeMenuAndNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                active
                  ? "bg-emerald-50 text-emerald-800 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-emerald-800"
              }`}
            >
              <span className="w-6 text-center text-lg" aria-hidden="true">
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
              {active && (
                <span className="ml-auto w-2 h-2 rounded-full bg-emerald-600" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="rounded-xl bg-slate-50 p-3 mb-3">
          <p className="text-sm font-semibold text-slate-700 truncate">
            {admin?.name || "Administrator"}
          </p>
          <p className="text-xs text-slate-500 mt-1">Administrator</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          <span aria-hidden="true">↪</span>
          {t("Logout")}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-lg font-bold">
            D
          </div>
          <div>
            <h1 className="font-bold text-slate-800">{t("Dumkibas Bazar")}</h1>
            <p className="text-xs text-slate-500">Admin Portal</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={
            menuOpen
              ? t("Close navigation menu")
              : t("Open navigation menu")
          }
          aria-expanded={menuOpen}
          className="w-10 h-10 rounded-xl border border-slate-200 text-slate-700 text-xl hover:bg-slate-50"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </header>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden">
          <button
            type="button"
            className="absolute inset-y-0 left-[min(18rem,80vw)] right-0 cursor-default"
            aria-label={t("Close navigation menu")}
            onClick={() => setMenuOpen(false)}
          />
          <aside className="relative z-10 flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl">
            <Sidebar mobile />
          </aside>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-72 shrink-0 bg-white border-r border-slate-200 flex-col min-h-screen">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-9">
          {/* Page heading */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm font-medium text-emerald-700">
                ADMINISTRATION / OVERVIEW
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                Welcome back, {admin?.name || "Admin"}
              </h2>
              <p className="text-slate-500 mt-2">
                Here's an overview of your community management portal.
              </p>
            </div>

            <button
              onClick={loadDashboard}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              <span aria-hidden="true">↻</span>
              {loading ? "Refreshing..." : "Refresh data"}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
            >
              <p>{error}</p>
              <button
                onClick={loadDashboard}
                className="font-semibold underline self-start"
              >
                Try again
              </button>
            </div>
          )}

          {/* Statistics */}
          <section aria-label="Dashboard statistics" className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.label}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 mt-3">
                      {loading ? "—" : card.value ?? 0}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${card.color}`}>
                    {card.icon}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4">{card.note}</p>
              </div>
            ))}
          </section>

          {/* Quick actions */}
          <section className="mb-8">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Quick actions
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Jump directly to common management tasks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[
                {
                  title: "Manage Reports",
                  description: "Review community reports and update their status.",
                  icon: "▤",
                  path: "/admin/reports",
                },
                {
                  title: "Manage Users",
                  description: "View registered members and manage access.",
                  icon: "♙",
                  path: "/admin/users",
                },
                {
                  title: "Manage Notices",
                  description: "Create and manage important notices.",
                  icon: "▣",
                  path: "/admin/notices",
                },
                {
                  title: "Announcements",
                  description: "Publish updates for approved members.",
                  icon: "◉",
                  path: "/admin/announcements",
                },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="group bg-white border border-slate-200 rounded-2xl p-5 text-left shadow-sm hover:shadow-md hover:border-emerald-200 transition"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl mb-4 group-hover:bg-emerald-100 transition">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-slate-800">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-500 leading-6 mt-2">
                    {item.description}
                  </p>
                  <span className="inline-block mt-4 text-sm font-semibold text-emerald-700">
                    Open section →
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Pending requests */}
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-5 sm:px-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Pending access requests
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Review requests before allowing access to the portal.
                </p>
              </div>
              <span className="w-fit rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-800">
                {loading ? "Loading..." : `${users.length} to review`}
              </span>
            </div>

            <div className="p-5 sm:p-6">
              {loading ? (
                <div className="py-12 text-center">
                  <div className="mx-auto w-8 h-8 border-4 border-emerald-100 border-t-emerald-700 rounded-full animate-spin" />
                  <p className="text-sm text-slate-500 mt-4">
                    Loading access requests...
                  </p>
                </div>
              ) : users.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl">
                    ✓
                  </div>
                  <h4 className="font-semibold text-slate-800 mt-4">
                    No pending requests
                  </h4>
                  <p className="text-sm text-slate-500 mt-2">
                    There are no access requests waiting for review.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <article
                      key={user._id}
                      className="rounded-xl border border-slate-200 p-4 sm:p-5 hover:border-slate-300 transition"
                    >
                      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 shrink-0 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                              {(user.name || "U").charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-800 break-words">
                                {user.name}
                              </h4>
                              <p className="text-xs text-amber-700 mt-1">
                                Awaiting approval
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-4 text-sm">
                            <p className="text-slate-600 break-all">
                              <span className="font-semibold text-slate-700">Email: </span>
                              {user.email || "Not provided"}
                            </p>
                            <p className="text-slate-600 break-words">
                              <span className="font-semibold text-slate-700">Phone: </span>
                              {user.phone || "Not provided"}
                            </p>
                            <p className="text-slate-600 break-words sm:col-span-2">
                              <span className="font-semibold text-slate-700">Address: </span>
                              {user.address || "Not provided"}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                          <button
                            onClick={() => handleUserAction(user._id, "approve")}
                            disabled={actionLoading === `${user._id}-approve` || actionLoading === `${user._id}-reject`}
                            className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition"
                          >
                            {actionLoading === `${user._id}-approve` ? "Approving..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleUserAction(user._id, "reject")}
                            disabled={actionLoading === `${user._id}-approve` || actionLoading === `${user._id}-reject`}
                            className="rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50 transition"
                          >
                            {actionLoading === `${user._id}-reject` ? "Rejecting..." : "Reject"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Admin profile */}
          <section className="mt-8 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">
              Administrator profile
            </h3>
            <p className="text-sm text-slate-500 mt-1 mb-5">
              Information for the currently signed-in administrator.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Name
                </p>
                <p className="font-semibold text-slate-800 mt-2">
                  {admin?.name || "Not available"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Email
                </p>
                <p className="font-semibold text-slate-800 mt-2 break-all">
                  {admin?.email || "Not available"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Role
                </p>
                <p className="font-semibold text-emerald-800 mt-2 capitalize">
                  {admin?.role || "Administrator"}
                </p>
              </div>
            </div>
          </section>

          <footer className="text-center text-xs text-slate-400 py-8">
            © {new Date().getFullYear()} {t("Dumkibas Bazar Byabasthapan Samiti")}
          </footer>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;