import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

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

  // ======================================================
  // GET PENDING USERS
  // ======================================================

  const getPendingUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/admin/pending-users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data.users);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load pending users"
      );
    }
  };

  // ======================================================
  // GET DASHBOARD STATISTICS
  // ======================================================

  const getDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/admin/dashboard-stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load dashboard statistics"
      );
    }
  };

  // ======================================================
  // LOAD DASHBOARD
  // ======================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      await Promise.all([
        getPendingUsers(),
        getDashboardStats(),
      ]);
    } catch (error) {
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // ======================================================
  // APPROVE USER
  // ======================================================

  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/admin/users/${userId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadDashboard();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to approve user"
      );
    }
  };

  // ======================================================
  // REJECT USER
  // ======================================================

  const handleReject = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/admin/users/${userId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadDashboard();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to reject user"
      );
    }
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const admin = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ================= MOBILE HEADER ================= */}

      <header className="lg:hidden bg-white border-b px-4 py-4 flex items-center justify-between">

        <div>
          <h1 className="font-bold text-slate-800">
            Dumkibas Bazar
          </h1>

          <p className="text-xs text-slate-500">
            Admin Panel
          </p>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl text-slate-700"
        >
          ☰
        </button>

      </header>

      {/* ================= MOBILE MENU ================= */}

      {menuOpen && (
        <div className="lg:hidden bg-white border-b p-4 space-y-2">

          <button
            onClick={() => {
              navigate("/admin");
              setMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-lg bg-blue-50 text-blue-700 font-medium"
          >
            🏠 Dashboard
          </button>

          <button
            onClick={() => {
              navigate("/admin/reports");
              setMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100"
          >
            📝 Reports
          </button>

          <button onClick={() => navigate("/admin/users")} className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700"> 👥 Users</button>

          <button
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100"
          >
            ⚠️ Complaints
          </button>

            <button
  onClick={() => {
    navigate("/admin/notices");
    setMenuOpen(false);
  }}
  className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100"
>
  📢 Notices
</button>

          
<button
  onClick={() => {
    navigate("/admin/announcements");
    setMenuOpen(false);
  }}
  className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100"
>
  📣 Announcements
</button>

          <button
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100"
          >
            📄 Documents
          </button>

          <button
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100"
          >
            ⚙️ Settings
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
          >
            🚪 Logout
          </button>

        </div>
      )}

      <div className="flex">

        {/* ================= DESKTOP SIDEBAR ================= */}

        <aside className="hidden lg:flex w-64 min-h-screen bg-white border-r flex-col">

          <div className="p-6 border-b">

            <h1 className="text-xl font-bold text-slate-800">
              Dumkibas Bazar
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Management Committee
            </p>

          </div>

          <nav className="p-4 space-y-2 flex-1">

            <button
              onClick={() => navigate("/admin")}
              className="w-full text-left px-4 py-3 rounded-lg bg-blue-50 text-blue-700 font-medium"
            >
              🏠 Dashboard
            </button>

            <button
              onClick={() =>
                navigate("/admin/reports")
              }
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              📝 Reports
            </button>

            <button
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              👥 Users
            </button>

            <button
  onClick={() => navigate("/admin/notices")}
  className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700"
>
  📢 Notices
</button>

            <button
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              📢 Notices
            </button>

            <button
  onClick={() => navigate("/admin/announcements")}
  className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700"
>
  📣 Announcements
</button>

            <button
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              📄 Documents
            </button>

            <button
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              ⚙️ Settings
            </button>

          </nav>

          <div className="p-4 border-t">

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
            >
              🚪 Logout
            </button>

          </div>

        </aside>

        {/* ================= MAIN CONTENT ================= */}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">

          {/* Header */}

          <div className="mb-8">

            <p className="text-sm text-slate-500">
              Admin Panel
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
              Welcome, {admin?.name || "Admin"} 👋
            </h2>

            <p className="text-slate-500 mt-2">
              Manage the Dumkibas Bazar Management Committee.
            </p>

          </div>

          {/* Error */}

          {error && (
            <div className="mb-6 bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
              {error}
            </div>
          )}

          {/* ================= STATISTICS ================= */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

            {/* Total Users */}

            <div className="bg-white rounded-xl border p-5">

              <div className="flex items-center justify-between">

                <p className="text-sm text-slate-500">
                  Total Users
                </p>

                <span className="text-2xl">
                  👥
                </span>

              </div>

              <p className="text-3xl font-bold text-slate-800 mt-3">
                {loading ? "..." : stats.totalUsers}
              </p>

            </div>

            {/* Active Users */}

            <div className="bg-white rounded-xl border p-5">

              <div className="flex items-center justify-between">

                <p className="text-sm text-slate-500">
                  Active Users
                </p>

                <span className="text-2xl">
                  ✅
                </span>

              </div>

              <p className="text-3xl font-bold text-green-600 mt-3">
                {loading ? "..." : stats.activeUsers}
              </p>

            </div>

            {/* Pending Users */}

            <div className="bg-white rounded-xl border p-5">

              <div className="flex items-center justify-between">

                <p className="text-sm text-slate-500">
                  Pending Users
                </p>

                <span className="text-2xl">
                  ⏳
                </span>

              </div>

              <p className="text-3xl font-bold text-yellow-600 mt-3">
                {loading ? "..." : stats.pendingUsers}
              </p>

            </div>

            {/* Reports */}

            <div className="bg-white rounded-xl border p-5">

              <div className="flex items-center justify-between">

                <p className="text-sm text-slate-500">
                  Total Reports
                </p>

                <span className="text-2xl">
                  📝
                </span>

              </div>

              <p className="text-3xl font-bold text-blue-600 mt-3">
                {loading ? "..." : stats.totalReports}
              </p>

            </div>

          </div>

          {/* ================= QUICK ACTIONS ================= */}

          <section className="mb-8">

            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              <button
                onClick={() =>
                  navigate("/admin/reports")
                }
                className="text-left bg-white p-6 rounded-xl border hover:shadow-md transition"
              >

                <div className="text-3xl mb-3">
                  📝
                </div>

                <h4 className="font-semibold text-slate-800">
                  Manage Reports
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  Review and update reports submitted by members.
                </p>

              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("pending-users")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className="text-left bg-white p-6 rounded-xl border hover:shadow-md transition"
              >

                <div className="text-3xl mb-3">
                  👥
                </div>

                <h4 className="font-semibold text-slate-800">
                  Manage Users
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  Review pending access requests.
                </p>

              </button>

              <button
  onClick={() => navigate("/admin/notices")}
  className="text-left bg-white p-6 rounded-xl border hover:shadow-md transition"
>

                <div className="text-3xl mb-3">
                  📢
                </div>

                <h4 className="font-semibold text-slate-800">
                  Manage Notices
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  Publish important committee notices.
                </p>

              </button>

            </div>

          </section>

          {/* ================= PENDING USERS ================= */}

          <section
            id="pending-users"
            className="bg-white rounded-xl border"
          >

            <div className="p-5 sm:p-6 border-b">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <div>

                  <h3 className="text-lg font-semibold text-slate-800">
                    Pending Access Requests
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Review users waiting for approval.
                  </p>

                </div>

                <span className="w-fit bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                  {stats.pendingUsers} Pending
                </span>

              </div>

            </div>

            <div className="p-5 sm:p-6">

              {loading && (
                <div className="text-center py-8">

                  <p className="text-slate-500">
                    Loading requests...
                  </p>

                </div>
              )}

              {!loading &&
                !error &&
                users.length === 0 && (
                  <div className="text-center py-10">

                    <div className="text-4xl mb-3">
                      ✅
                    </div>

                    <h4 className="font-semibold text-slate-800">
                      No pending requests
                    </h4>

                    <p className="text-sm text-slate-500 mt-1">
                      All access requests have been reviewed.
                    </p>

                  </div>
                )}

              {!loading &&
                !error &&
                users.length > 0 && (
                  <div className="space-y-4">

                    {users.map((user) => (

                      <div
                        key={user._id}
                        className="border rounded-xl p-4 sm:p-5"
                      >

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                          <div>

                            <h4 className="font-semibold text-slate-800">
                              {user.name}
                            </h4>

                            <div className="mt-2 text-sm text-slate-500 space-y-1">

                              <p>
                                <strong>Email:</strong>{" "}
                                {user.email}
                              </p>

                              <p>
                                <strong>Phone:</strong>{" "}
                                {user.phone}
                              </p>

                              <p>
                                <strong>Address:</strong>{" "}
                                {user.address}
                              </p>

                            </div>

                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">

                            <button
                              onClick={() =>
                                handleApprove(user._id)
                              }
                              className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                handleReject(user._id)
                              }
                              className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition"
                            >
                              Reject
                            </button>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>
                )}

            </div>

          </section>

          {/* ================= ADMIN INFORMATION ================= */}

          <section className="mt-8 bg-white rounded-xl border p-5 sm:p-6">

            <h3 className="text-lg font-semibold text-slate-800 mb-5">
              Admin Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              <div>

                <p className="text-sm text-slate-500">
                  Name
                </p>

                <p className="font-medium text-slate-800 mt-1">
                  {admin?.name}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="font-medium text-slate-800 mt-1 break-all">
                  {admin?.email}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Role
                </p>

                <p className="font-medium text-slate-800 mt-1 capitalize">
                  {admin?.role}
                </p>

              </div>

            </div>

          </section>
 
        </main>

      </div>

    </div>
  );
}

export default AdminDashboard;