import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/useLanguage";

function ManagerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/messages/unread-count")
      .then((response) => setUnreadCount(response.data.count || 0))
      .catch((requestError) => {
        setError(
          requestError.response?.data?.message ||
            "Could not load unread message count."
        );
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              {t("Notice Manager")}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {t("Welcome,")} {user?.name || t("User")}
            </h1>
            <p className="mt-2 text-slate-600">
              {t("Manage notices and messages for community members.")}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-red-200 px-4 py-2 font-medium text-red-700 hover:bg-red-50"
          >
            {t("Logout")}
          </button>
        </header>

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            {t(error)}
          </p>
        )}

        <section className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate("/admin/notices")}
            className="rounded-2xl bg-white p-6 text-left shadow-sm transition hover:shadow-md"
          >
            <span className="text-3xl" aria-hidden="true">📢</span>
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              {t("Manage Notices")}
            </h2>
            <p className="mt-2 text-slate-600">
              {t("Create, schedule, edit, and publish notices.")}
            </p>
          </button>
          <button
            type="button"
            onClick={() => navigate("/messages")}
            className="rounded-2xl bg-white p-6 text-left shadow-sm transition hover:shadow-md"
          >
            <span className="text-3xl" aria-hidden="true">✉️</span>
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              {t("Messages")}
              {unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-red-100 px-2 py-1 text-sm text-red-700">
                  {unreadCount} {t("unread")}
                </span>
              )}
            </h2>
            <p className="mt-2 text-slate-600">
              {t("Send private messages and review replies.")}
            </p>
          </button>
        </section>
      </div>
    </main>
  );
}

export default ManagerDashboard;
