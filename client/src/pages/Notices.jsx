
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useLanguage } from "../context/useLanguage";

function Notices() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/notices", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setNotices(response.data.notices || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load notices. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          ← {t("Back to Dashboard")}
        </button>

        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            {t("Dumkibas Bazar Byabasthapan Samiti")}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            {t("Notices")}
          </h1>

          <p className="mt-2 text-gray-600">
            {t("Read the latest official notices from the committee.")}
          </p>
        </div>

        {loading && (
          <div className="rounded-xl bg-white p-8 text-center text-gray-600 shadow-sm">
            {t("Loading notices...")}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            {t(error)}
            <button
              onClick={() => window.location.reload()}
              className="ml-3 font-semibold underline"
            >
              {t("Try again")}
            </button>
          </div>
        )}

        {!loading && !error && notices.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              {t("No notices yet")}
            </h2>
            <p className="mt-2 text-gray-500">
              {t("Published notices will appear here.")}
            </p>
          </div>
        )}

        {!loading && !error && notices.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {notices.map((notice) => (
              <article
                key={notice._id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                    {notice.category || t("General")}
                  </span>

                  <span className="text-xs text-gray-500">
                    {formatDate(notice.createdAt)}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {notice.title}
                </h2>

                <p className="mt-3 whitespace-pre-wrap break-words leading-7 text-gray-600">
                  {notice.description}
                </p>

                {notice.createdBy?.name && (
                  <p className="mt-4 border-t border-gray-100 pt-3 text-sm text-gray-500">
                    {t("Published by")} {notice.createdBy.name}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notices;