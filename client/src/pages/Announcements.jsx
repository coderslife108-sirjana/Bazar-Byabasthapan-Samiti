import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Announcements() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await api.get("/announcements");
        setAnnouncements(
          Array.isArray(response.data)
            ? response.data
            : response.data.announcements || []
        );
      } catch (err) {
        console.error("Failed to load announcements:", err);
        setError(
          err.response?.data?.message ||
            "Unable to load announcements. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 rounded-lg bg-white px-4 py-2 text-slate-700 shadow hover:bg-slate-50"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          📣 Announcements
        </h1>
        <p className="mt-2 text-slate-600">
          Latest announcements from Dumkibas Bazar Byabasthapan Samiti.
        </p>

        {loading && (
          <p className="mt-6 text-slate-600">Loading announcements...</p>
        )}

        {error && (
          <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </p>
        )}

        {!loading && !error && announcements.length === 0 && (
          <div className="mt-6 rounded-xl border bg-white p-6 text-slate-600">
            No announcements have been published yet.
          </div>
        )}

        <div className="mt-6 space-y-4">
          {announcements.map((announcement) => (
            <article
              key={announcement._id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-slate-800">
                {announcement.title}
              </h2>

              <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">
                {announcement.description}
              </p>

              <p className="mt-4 text-sm text-slate-400">
                {announcement.createdAt
                  ? new Date(announcement.createdAt).toLocaleDateString()
                  : ""}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Announcements;

