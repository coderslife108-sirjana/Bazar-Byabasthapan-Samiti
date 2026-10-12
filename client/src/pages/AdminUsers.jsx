
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useLanguage } from "../context/useLanguage";
import { useAuth } from "../context/AuthContext";

function AdminUsers() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [roleSavingId, setRoleSavingId] = useState("");

  // Get all users
  const getUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  // Load users when the page opens
  useEffect(() => {
    getUsers();
  }, []);

  // Suspend a user
  const handleSuspend = async (userId) => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      await api.put(
        `/admin/users/${userId}/suspend`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await getUsers();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to suspend user"
      );
    }
  };

  // Reactivate a suspended user
  const handleReactivate = async (userId) => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      await api.put(
        `/admin/users/${userId}/reactivate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await getUsers();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to reactivate user"
      );
    }
  };

  // Open the edit form
  const handleEdit = (user) => {
    setEditingUser({
      _id: user._id,
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
    });

    setError("");
  };

  // Update user details
  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (!editingUser) return;

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.put(
        `/admin/users/${editingUser._id}`,
        {
          name: editingUser.name,
          phone: editingUser.phone,
          address: editingUser.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user._id === editingUser._id
            ? { ...user, ...response.data.user }
            : user
        )
      );

      setEditingUser(null);
    } catch (error) {
      console.error("Update user error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update user details"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (targetUser, role) => {
    if (role === targetUser.role) return;
    setRoleSavingId(targetUser._id);
    setError("");
    try {
      const response = await api.put(`/admin/users/${targetUser._id}/role`, {
        role,
      });
      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item._id === targetUser._id
            ? { ...item, ...response.data.user }
            : item
        )
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not update the user role."
      );
    } finally {
      setRoleSavingId("");
    }
  };

  const isCurrentUser = (targetUser) =>
    targetUser._id === (currentUser?.id || currentUser?._id);

  const renderRoleSelect = (targetUser) => (
    <select
      aria-label={`${t("Role")} ${targetUser.name}`}
      value={targetUser.role === "staff" ? "noticeManager" : targetUser.role}
      disabled={
        isCurrentUser(targetUser) ||
        targetUser.status !== "active" ||
        roleSavingId === targetUser._id
      }
      onChange={(event) => handleRoleChange(targetUser, event.target.value)}
      className="mt-2 max-w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm disabled:bg-slate-100"
    >
      <option value="admin">{t("Admin")}</option>
      <option value="noticeManager">{t("Notice Manager")}</option>
      <option value="member">{t("Member")}</option>
    </select>
  );

  // Filter by status and search by name, email, or phone
  const search = searchTerm.trim().toLowerCase();

  const filteredUsers = users.filter((user) => {
    const matchesStatus =
      filter === "all" || user.status === filter;

    const matchesSearch =
      (user.name || "").toLowerCase().includes(search) ||
      (user.email || "").toLowerCase().includes(search) ||
      (user.phone || "").toLowerCase().includes(search);

    return matchesStatus && matchesSearch;
  });

  // Status badge styles
  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700";

      case "pending":
        return "bg-yellow-50 text-yellow-700";

      case "rejected":
        return "bg-red-50 text-red-700";

      case "suspended":
        return "bg-slate-100 text-slate-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Filter button styles
  const getFilterStyle = (value) => {
    const styles = {
      all: "bg-blue-600 text-white",
      active: "bg-green-600 text-white",
      pending: "bg-yellow-500 text-white",
      rejected: "bg-red-600 text-white",
      suspended: "bg-slate-700 text-white",
    };

    return filter === value
      ? styles[value]
      : "bg-slate-100 text-slate-700 hover:bg-slate-200";
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
              <h2 className="text-xl font-bold text-slate-800">
                {t("Edit User Details")}
              </h2>

              <form
                onSubmit={handleUpdateUser}
                className="mt-5 space-y-4"
              >
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {t("Full Name")}
                  </label>

                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        name: e.target.value,
                      })
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {t("Phone Number")}
                  </label>

                  <input
                    type="text"
                    value={editingUser.phone}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        phone: e.target.value,
                      })
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {t("Address")}
                  </label>

                  <textarea
                    value={editingUser.address}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        address: e.target.value,
                      })
                    }
                    required
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    disabled={saving}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    {t("Cancel")}
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? t("Saving...") : t("Save Changes")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin")}
            className="mb-4 text-sm text-blue-600 hover:underline"
          >
            ← {t("Back to Admin Dashboard")}
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                {t("Admin / Users")}
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
                {t("User Management")}
              </h1>

              <p className="mt-2 text-slate-500">
                {t("View and manage users of the committee system.")}
              </p>
            </div>

            <div className="rounded-xl border bg-white px-5 py-3">
              <p className="text-sm text-slate-500">
                {t("Total Users")}
              </p>

              <p className="text-2xl font-bold text-slate-800">
                {users.length}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Status Filters */}
        <div className="mb-6 rounded-xl border bg-white p-4">
          <label
            htmlFor="user-search"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            {t("Search Members")}
          </label>

          <input
            id="user-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("Search by name, email, or phone...")}
            className="mb-4 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <div className="flex flex-wrap gap-2">
            {[
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
              { label: "Pending", value: "pending" },
              { label: "Rejected", value: "rejected" },
              { label: "Suspended", value: "suspended" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${getFilterStyle(
                  item.value
                )}`}
              >
                {t(item.label)}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <p>{t(error)}</p>

            <button
              onClick={() => setError("")}
              className="font-bold"
              aria-label={t("Dismiss error")}
            >
              ×
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border bg-white p-10 text-center">
            <p className="text-slate-500">{t("Loading users...")}</p>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredUsers.length === 0 && (
          <div className="rounded-xl border bg-white p-10 text-center">
            <div className="mb-3 text-4xl">👥</div>

            <h2 className="text-lg font-semibold text-slate-800">
              {t("No users found")}
            </h2>

            <p className="mt-2 text-slate-500">
              {searchTerm.trim()
                ? t("Try another name, email, or phone number.")
                : t("There are no users in this category.")}
            </p>

            {(searchTerm || filter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {t("Clear Search and Filters")}
              </button>
            )}
          </div>
        )}

        {/* Desktop Users Table */}
        {!loading && !error && filteredUsers.length > 0 && (
          <div className="hidden overflow-hidden rounded-xl border bg-white lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                      {t("User")}
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                      {t("Contact")}
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                      {t("Address")}
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                      {t("Role")}
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                      {t("Status")}
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                      {t("Joined")}
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                      {t("Actions")}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800">
                          {user.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {t("ID: ")}{user._id}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-700">
                          {user.email}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {user.phone || t("No phone")}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {user.address || t("No address")}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-medium capitalize text-slate-700">
                          {t(user.role)}
                        </span>
                        {renderRoleSelect(user)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(
                            user.status
                          )}`}
                        >
                          {t(user.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString(language === "ne" ? "ne-NP" : "en-US")
                          : "—"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col items-start gap-3">
                          {user.role === "member" && (
                            <>
                              <button
                                onClick={() => handleEdit(user)}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                              >
                                {t("Edit Details")}
                              </button>

                              {user.status === "active" && (
                                <button
                                  onClick={() => handleSuspend(user._id)}
                                  className="text-xs font-medium text-red-600 hover:text-red-800"
                                >
                                  {t("Suspend User")}
                                </button>
                              )}

                              {user.status === "suspended" && (
                                <button
                                  onClick={() => handleReactivate(user._id)}
                                  className="text-xs font-medium text-green-600 hover:text-green-800"
                                >
                                  {t("Reactivate User")}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile User Cards */}
        {!loading && !error && filteredUsers.length > 0 && (
          <div className="space-y-4 lg:hidden">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="rounded-xl border bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="break-words font-semibold text-slate-800">
                      {user.name}
                    </h2>

                    <p className="mt-1 break-all text-sm text-slate-500">
                      {user.email}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(
                      user.status
                    )}`}
                  >
                    {t(user.status)}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p className="break-words">
                    <span className="text-slate-500">
                      {t("Phone: ")}
                    </span>
                    <span className="text-slate-800">
                      {user.phone || t("Not provided")}
                    </span>
                  </p>

                  <p className="break-words">
                    <span className="text-slate-500">
                      {t("Address: ")}
                    </span>
                    <span className="text-slate-800">
                      {user.address || t("Not provided")}
                    </span>
                  </p>

                  <p>
                    <span className="text-slate-500">
                      {t("Role: ")}
                    </span>
                    <span className="capitalize text-slate-800">
                      {t(user.role)}
                    </span>
                  </p>
                  {renderRoleSelect(user)}

                  <p>
                    <span className="text-slate-500">
                      {t("Joined: ")}
                    </span>
                    <span className="text-slate-800">
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString()
                        : "—"}
                    </span>
                  </p>
                </div>

                {/* Mobile Actions */}
                <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                  {user.role === "member" && (
                    <>
                      <button
                        onClick={() => handleEdit(user)}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        {t("Edit Details")}
                      </button>

                      {user.status === "active" && (
                        <button
                          onClick={() => handleSuspend(user._id)}
                          className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                        >
                          {t("Suspend User")}
                        </button>
                      )}

                      {user.status === "suspended" && (
                        <button
                          onClick={() => handleReactivate(user._id)}
                          className="w-full rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
                        >
                          {t("Reactivate User")}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;