
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminNotices() {
  const navigate = useNavigate();

  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const loadNotices = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/notices/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotices(response.data.notices || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load notices. Please check your admin login."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!title.trim() || !description.trim()) {
      setError("Please enter both a title and description.");
      return;
    }

    setSaving(true);

    try {
      await api.post(
        "/notices",
        {
          title: title.trim(),
          description: description.trim(),
          category,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTitle("");
      setDescription("");
      setCategory("General");
      setMessage("Notice published successfully!");
      await loadNotices();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not publish the notice."
      );
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (notice) => {
    setError("");
    setMessage("");

    try {
      await api.put(
        `/notices/${notice._id}`,
        { published: !notice.published },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(
        notice.published
          ? "Notice hidden successfully."
          : "Notice published successfully."
      );

      await loadNotices();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not update the notice."
      );
    }
  };

  const handleDelete = async (noticeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await api.delete(`/notices/${noticeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Notice deleted successfully.");
      await loadNotices();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not delete the notice."
      );
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate("/admin")}
          className="mb-5 rounded-lg border bg-white px-4 py-2 hover:bg-gray-50"
        >
          ← Back to Admin Dashboard
        </button>

        <header className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Committee Administration
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Manage Notices
          </h1>
          <p className="mt-2 text-gray-600">
            Publish official notices for approved website users.
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">
            {message}
          </div>
        )}

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            Create a Notice
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Notice Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={200}
                required
                placeholder="Enter notice title"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Category
              </label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
              >
                <option value="General">General</option>
                <option value="Meeting">Meeting</option>
                <option value="Waste Management">Waste Management</option>
                <option value="Important">Important</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Notice Details
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                rows={5}
                placeholder="Write the full notice here"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60 sm:w-auto"
            >
              {saving ? "Publishing..." : "Publish Notice"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            All Notices
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading notices...</p>
          ) : notices.length === 0 ? (
            <p className="text-gray-500">
              No notices have been created yet.
            </p>
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <article
                  key={notice._id}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-lg font-bold text-gray-900">
                        {notice.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {notice.category} ·{" "}
                        {notice.createdAt
                          ? new Date(notice.createdAt).toLocaleDateString()
                          : ""}
                      </p>
                      <p className="mt-3 whitespace-pre-wrap break-words text-gray-700">
                        {notice.description}
                      </p>
                      <span
                        className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          notice.published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {notice.published ? "Published" : "Hidden"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => togglePublished(notice)}
                        className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
                      >
                        {notice.published ? "Hide" : "Publish"}
                      </button>
                      <button
                        onClick={() => handleDelete(notice._id)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminNotices;