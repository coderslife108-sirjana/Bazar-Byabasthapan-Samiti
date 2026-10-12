
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useLanguage } from "../context/useLanguage";

const REPORT_STATUSES = [
  "Draft",
  "Submitted",
  "Under Review",
  "In Progress",
  "Resolved",
];

function getStatusStyle(status) {
  switch (status) {
    case "Resolved":
      return "bg-green-100 text-green-800";
    case "In Progress":
      return "bg-indigo-100 text-indigo-800";
    case "Under Review":
      return "bg-amber-100 text-amber-800";
    case "Submitted":
      return "bg-blue-100 text-blue-800";
    case "Draft":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatDate(date, language, t) {
  if (!date) return t("N/A");

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime())
    ? t("N/A")
    : parsedDate.toLocaleString(language === "ne" ? "ne-NP" : "en-US");
}

function AdminReportDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { language, t } = useLanguage();

  const [report, setReport] = useState(null);
  const [status, setStatus] = useState("");
  const [adminResponse, setAdminResponse] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getReport = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/reports/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const reportData = response.data.report;

      setReport(reportData);
      setStatus(reportData.status || "Submitted");
      setAdminResponse(reportData.adminResponse || "");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load report. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    getReport();
  }, [getReport]);

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!status) {
      setError("Please select a report status.");
      return;
    }

    if (!REPORT_STATUSES.includes(status)) {
      setError("Please select a valid report status.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        `/reports/${id}`,
        {
          status,
          adminResponse: adminResponse.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.report) {
        setReport(response.data.report);
        setStatus(response.data.report.status || status);
        setAdminResponse(
          response.data.report.adminResponse || ""
        );
      } else {
        await getReport();
      }

      setMessage("Report updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update report. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <p className="text-slate-600">{t("Loading report...")}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => navigate("/admin/reports")}
            className="mb-6 text-sm font-medium text-blue-600 hover:underline"
          >
            ← {t("Back to Reports")}
          </button>

          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700"
          >
            {t(error || "Report could not be found.")}

            <button
              onClick={() => getReport()}
              className="mt-3 block font-semibold underline"
            >
              {t("Try again")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Navigation and refresh */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => navigate("/admin/reports")}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← {t("Back to Reports")}
          </button>

          <button
            type="button"
            onClick={() => getReport(true)}
            disabled={refreshing || saving}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {refreshing ? t("Refreshing...") : t("↻ Refresh Report")}
          </button>
        </div>

        {/* Header */}
        <div className="mb-6">
          <p className="text-sm text-slate-500">
            {t("Admin / Reports / Details")}
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
            {t("Manage Report")}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {t("Review the submitted issue and update its progress.")}
          </p>
        </div>

        {/* Report details */}
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm text-slate-500">{t("Report Title")}</p>

              <h2 className="mt-1 break-words text-xl font-bold text-slate-800 sm:text-2xl">
                {report.title}
              </h2>
            </div>

            <span
              className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${getStatusStyle(
                report.status
              )}`}
            >
              {t(report.status || "Unknown")}
            </span>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">{t("Category")}</p>
              <p className="mt-1 font-medium text-slate-800">
                {t(report.category || "N/A")}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">{t("Location")}</p>
              <p className="mt-1 break-words font-medium text-slate-800">
                {report.location || t("N/A")}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">{t("Submitted By")}</p>
              <p className="mt-1 font-medium text-slate-800">
                {report.createdBy?.name || t("Unknown")}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">{t("Email")}</p>
              <p className="mt-1 break-all font-medium text-slate-800">
                {report.createdBy?.email || t("N/A")}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">{t("Submitted On")}</p>
              <p className="mt-1 font-medium text-slate-800">
                {formatDate(report.createdAt, language, t)}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">{t("Last Updated")}</p>
              <p className="mt-1 font-medium text-slate-800">
                {formatDate(report.updatedAt, language, t)}
              </p>
            </div>
          </div>

          <div className="mt-7 border-t border-slate-100 pt-6">
            <p className="text-sm font-medium text-slate-500">
              {t("Description")}
            </p>

            <p className="mt-2 whitespace-pre-wrap break-words leading-7 text-slate-700">
              {report.description || t("No description provided.")}
            </p>
          </div>

          {/* Attachments */}
          {report.attachments?.length > 0 && (
            <div className="mt-6 border-t border-slate-100 pt-6">
              <h3 className="font-semibold text-slate-800">
                {t("Attachments")}
              </h3>

              <ul className="mt-3 space-y-2">
                {report.attachments.map((attachment, index) => (
                  <li key={`${attachment}-${index}`}>
                    <a
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-sm font-medium text-blue-600 hover:underline"
                    >
                      {t("View attachment ")}{index + 1} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Previously saved response */}
          {report.adminResponse && (
            <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <h3 className="font-semibold text-blue-900">
                {t("Current Admin Response")}
              </h3>

              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-blue-800">
                {report.adminResponse}
              </p>
            </div>
          )}
        </section>

        {/* Update form */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-slate-800">
            {t("Update Report")}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {t("Changes will be saved to the report record.")}
          </p>

          <form onSubmit={handleUpdate} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="report-status"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                {t("Report Status")}
              </label>

              <select
                id="report-status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {REPORT_STATUSES.map((reportStatus) => (
                  <option key={reportStatus} value={reportStatus}>
                    {t(reportStatus)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="admin-response"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                {t("Admin Response")}
              </label>

              <textarea
                id="admin-response"
                value={adminResponse}
                onChange={(event) =>
                  setAdminResponse(event.target.value)
                }
                rows={5}
                maxLength={3000}
                placeholder={t("Write an update or response for the report owner...")}
                className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1 text-right text-xs text-slate-500">
                {adminResponse.length}/3000{t(" characters")}
              </p>
            </div>

            {message && (
              <div
                role="status"
                className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
              >
                {t(message)}
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {t(error)}
              </div>
            )}

            <button
              type="submit"
              disabled={saving || refreshing}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {saving ? t("Saving Changes...") : t("Save Changes")}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AdminReportDetails;