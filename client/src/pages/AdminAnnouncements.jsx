
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminAnnouncements() {
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const loadAnnouncements = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/announcements/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAnnouncements(response.data.announcements || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load announcements."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!title.trim() || !description.trim()) {
      setError("Please enter a title and description.");
      return;
    }

    setSaving(true);

    try {
      await api.post(
        "/announcements",
        {
          title: title.trim(),
          description: description.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTitle("");
      setDescription("");
      setMessage("Announcement published successfully!");
      await loadAnnouncements();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not publish the announcement."
      );
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (announcement) => {
    setError("");
    setMessage("");

    try {
      await api.put(
        `/announcements/${announcement._id}`,
        { published: !announcement.published },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(
        announcement.published
          ? "Announcement hidden successfully."
          : "Announcement published successfully."
      );

      await loadAnnouncements();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not update the announcement."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement permanently?")) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await api.delete(`/announcements/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Announcement deleted successfully.");
      await loadAnnouncements();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not delete the announcement."
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
            Manage Announcements
          </h1>

          <p className="mt-2 text-gray-600">
            Share important updates with approved website users.
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
            Create an Announcement
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Announcement Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={200}
                required
                placeholder="Enter announcement title"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Announcement Details
              </label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                rows={5}
                placeholder="Write your announcement here"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60 sm:w-auto"
            >
              {saving ? "Publishing..." : "Publish Announcement"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            All Announcements
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <p className="text-gray-500">
              No announcements have been created yet.
            </p>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <article
                  key={announcement._id}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <h3 className="break-words text-lg font-bold text-gray-900">
                    {announcement.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {announcement.createdAt
                      ? new Date(
                          announcement.createdAt
                        ).toLocaleDateString()
                      : ""}
                  </p>

                  <p className="mt-3 whitespace-pre-wrap break-words text-gray-700">
                    {announcement.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        announcement.published
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {announcement.published ? "Published" : "Hidden"}
                    </span>

                    <button
                      onClick={() => togglePublished(announcement)}
                      className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      {announcement.published ? "Hide" : "Publish"}
                    </button>

                    <button
                      onClick={() => handleDelete(announcement._id)}
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
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

export default AdminAnnouncements;