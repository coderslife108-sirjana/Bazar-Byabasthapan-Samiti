
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getUploadUrl } from "../services/api";
import { useLanguage } from "../context/useLanguage";
import { useAuth } from "../context/AuthContext";

function AdminNotices() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const toDateTimeInput = (date) => {
    const value = new Date(date);
    if (Number.isNaN(value.getTime())) return "";
    const localValue = new Date(
      value.getTime() - value.getTimezoneOffset() * 60_000
    );
    return localValue.toISOString().slice(0, 16);
  };

  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachmentFile, setAttachmentFile] = useState(null);
  const attachmentInputRef = useRef(null);
  const [editingNoticeId, setEditingNoticeId] = useState("");
  const [publishedAt, setPublishedAt] = useState(() => toDateTimeInput(new Date()));
  const [expiresAt, setExpiresAt] = useState("");
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

    if (!publishedAt || Number.isNaN(new Date(publishedAt).getTime())) {
      setError("Please provide a valid publication date.");
      return;
    }

    if (
      expiresAt &&
      (Number.isNaN(new Date(expiresAt).getTime()) ||
        new Date(expiresAt) <= new Date(publishedAt))
    ) {
      setError("Expiry date must be later than the publication date.");
      return;
    }

    if (attachmentFile && attachmentFile.size > 10 * 1024 * 1024) {
      setError("Notice attachments must be 10 MB or smaller.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("publishedAt", new Date(publishedAt).toISOString());
      formData.append(
        "expiresAt",
        expiresAt ? new Date(expiresAt).toISOString() : ""
      );
      if (attachmentFile) formData.append("attachment", attachmentFile);

      await api[editingNoticeId ? "put" : "post"](
        editingNoticeId ? `/notices/${editingNoticeId}` : "/notices",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTitle("");
      setDescription("");
      setCategory("General");
      setAttachmentFile(null);
      setEditingNoticeId("");
      setPublishedAt(toDateTimeInput(new Date()));
      setExpiresAt("");
      if (attachmentInputRef.current) attachmentInputRef.current.value = "";
      setMessage(
        editingNoticeId
          ? "Notice updated successfully."
          : "Notice published successfully!"
      );
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

  const startEditing = (notice) => {
    setEditingNoticeId(notice._id);
    setTitle(notice.title);
    setDescription(notice.description);
    setCategory(notice.category || "General");
    setPublishedAt(toDateTimeInput(notice.publishedAt || notice.createdAt));
    setExpiresAt(notice.expiresAt ? toDateTimeInput(notice.expiresAt) : "");
    setAttachmentFile(null);
    if (attachmentInputRef.current) attachmentInputRef.current.value = "";
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setEditingNoticeId("");
    setTitle("");
    setDescription("");
    setCategory("General");
    setAttachmentFile(null);
    setPublishedAt(toDateTimeInput(new Date()));
    setExpiresAt("");
    if (attachmentInputRef.current) attachmentInputRef.current.value = "";
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
      t("Are you sure you want to delete this notice?")
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
          onClick={() =>
            navigate(user?.role === "admin" ? "/admin" : "/manager")
          }
          className="mb-5 rounded-lg border bg-white px-4 py-2 hover:bg-gray-50"
        >
          ← {t("Back to Admin Dashboard")}
        </button>

        <header className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            {t("Committee Administration")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            {t("Manage Notices")}
          </h1>
          <p className="mt-2 text-gray-600">
            {t("Publish official notices for approved website users.")}
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            {t(error)}
          </div>
        )}

        {message && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">
            {t(message)}
          </div>
        )}

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            {t(editingNoticeId ? "Edit Notice" : "Create a Notice")}
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                {t("Notice Title")}
              </label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={200}
                required
                placeholder={t("Enter notice title")}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-700">
                {t("Category")}
              </label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
              >
                <option value="General">{t("General")}</option>
                <option value="Meeting">{t("Meeting")}</option>
                <option value="Waste Management">{t("Waste Management")}</option>
                <option value="Important">{t("Important")}</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-700">
                {t("Notice Details")}
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                rows={5}
                placeholder={t("Write the full notice here")}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-700">
                {t("Publication Date")}
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(event) => setPublishedAt(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-700">
                {t("Expiry Date (optional)")}
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                min={publishedAt}
                onChange={(event) => setExpiresAt(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label
                htmlFor="notice-attachment"
                className="mb-1 block font-medium text-gray-700"
              >
                {t("Add an optional image or PDF")}
              </label>
              <input
                ref={attachmentInputRef}
                id="notice-attachment"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                onChange={(event) =>
                  setAttachmentFile(event.target.files?.[0] || null)
                }
                className="sr-only"
              />
              <label
                htmlFor="notice-attachment"
                className="inline-block cursor-pointer rounded-lg bg-blue-50 px-4 py-2 font-semibold text-blue-700 hover:bg-blue-100"
              >
                {t("Choose attachment")}
              </label>
              <p className="mt-1 text-sm text-gray-500">
                {attachmentFile
                  ? attachmentFile.name
                  : t("No attachment selected")}
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60 sm:w-auto"
            >
              {saving
                ? t("Saving...")
                : t(editingNoticeId ? "Save Changes" : "Publish Notice")}
            </button>
            {editingNoticeId && (
              <button
                type="button"
                onClick={cancelEditing}
                className="ml-2 rounded-lg border px-5 py-3 font-semibold hover:bg-gray-50"
              >
                {t("Cancel")}
              </button>
            )}
          </form>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            {t("All Notices")}
          </h2>

          {loading ? (
            <p className="text-gray-500">{t("Loading notices...")}</p>
          ) : notices.length === 0 ? (
            <p className="text-gray-500">
              {t("No notices have been created yet.")}
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
                        {t(notice.category)} ·{" "}
                        {notice.createdAt
                          ? new Date(notice.createdAt).toLocaleDateString(
                              language === "ne" ? "ne-NP" : "en-US"
                            )
                          : ""}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {t("Publication Date")}:{" "}
                        {notice.publishedAt
                          ? new Date(notice.publishedAt).toLocaleString(
                              language === "ne" ? "ne-NP" : "en-US"
                            )
                          : t("Not scheduled")}
                        {notice.expiresAt && (
                          <>
                            {" · "}
                            {t("Expires")}:{" "}
                            {new Date(notice.expiresAt).toLocaleString(
                              language === "ne" ? "ne-NP" : "en-US"
                            )}
                          </>
                        )}
                      </p>
                      {(notice.attachment?.path || notice.image) &&
                        (notice.attachment?.mimeType?.startsWith("image/") ||
                        (!notice.attachment?.path && notice.image) ? (
                        <img
                          src={getUploadUrl(
                            notice.attachment?.path || notice.image
                          )}
                          alt={t("Notice image")}
                          className="mt-3 max-h-64 w-full rounded-lg object-cover"
                        />
                        ) : (
                          <a
                            href={getUploadUrl(notice.attachment.path)}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-block font-medium text-blue-700 underline"
                          >
                            {t("Open attachment")}:{" "}
                            {notice.attachment.name || t("Download PDF")}
                          </a>
                        ))}
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
                        {notice.published ? t("Published") : t("Hidden")}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => startEditing(notice)}
                        className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
                      >
                        {t("Edit")}
                      </button>
                      <button
                        onClick={() => togglePublished(notice)}
                        className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
                      >
                        {notice.published ? t("Hide") : t("Publish")}
                      </button>
                      <button
                        onClick={() => handleDelete(notice._id)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        {t("Delete")}
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