
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

function formatDate(date) {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime())
    ? "N/A"
    : parsedDate.toLocaleDateString();
}

function MyReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const getReports = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReports(
        Array.isArray(response.data.reports)
          ? response.data.reports
          : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load your reports. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    getReports();
  }, [getReports]);

  const statusCounts = useMemo(() => {
    const counts = { All: reports.length };

    REPORT_STATUSES.forEach((status) => {
      counts[status] = reports.filter(
        (report) => report.status === status
      ).length;
    });

    return counts;
  }, [reports]);

  const filteredReports = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesStatus =
        statusFilter === "All" ||
        report.status === statusFilter;

      const searchableText = [
        report.title,
        report.category,
        report.location,
        report.description,
        report.adminResponse,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(search);
    });
  }, [reports, searchTerm, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-4 text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                My Reports
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Track your submitted issues and admin responses.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => getReports(true)}
                disabled={loading || refreshing}
                className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {refreshing ? "Refreshing..." : "↻ Refresh"}
              </button>

              <button
                onClick={() => navigate("/reports/create")}
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                + Create Report
              </button>
            </div>
          </div>
        </div>

        {/* Report counts */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {["All", ...REPORT_STATUSES].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl border p-4 text-left transition ${
                statusFilter === status
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <p className="text-xs font-medium text-slate-500">
                {status === "All" ? "Total Reports" : status}
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {statusCounts[status]}
              </p>
            </button>
          ))}
        </div>

        {/* Search and status filter */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="my-report-search"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Search My Reports
              </label>

              <input
                id="my-report-search"
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search title, category, location..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="my-report-status"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Filter by Status
              </label>

              <select
                id="my-report-status"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All Statuses</option>

                {REPORT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status} ({statusCounts[status]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <p>
              Showing{" "}
              <strong className="text-slate-800">
                {filteredReports.length}
              </strong>{" "}
              of {reports.length} reports
            </p>

            {(searchTerm || statusFilter !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="font-semibold text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-500">
              Loading your reports...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p>{error}</p>

            <button
              onClick={() => getReports()}
              className="mt-3 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* No reports */}
        {!loading && !error && reports.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <div className="mb-3 text-4xl">📝</div>

            <h2 className="text-lg font-semibold text-slate-800">
              No reports yet
            </h2>

            <p className="mt-2 text-slate-500">
              You have not submitted any reports yet.
            </p>

            <button
              onClick={() => navigate("/reports/create")}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Create Your First Report
            </button>
          </div>
        )}

        {/* No matching reports */}
        {!loading &&
          !error &&
          reports.length > 0 &&
          filteredReports.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <div className="mb-3 text-4xl">🔎</div>

              <h2 className="text-lg font-semibold text-slate-800">
                No matching reports
              </h2>

              <p className="mt-2 text-slate-500">
                Try another search term or status filter.
              </p>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="mt-4 font-semibold text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

        {/* Report cards */}
        {!loading && !error && filteredReports.length > 0 && (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <article
                key={report._id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/reports/${report._id}`)
                  }
                  className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={`View report: ${report.title}`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="break-words text-lg font-bold text-slate-800">
                        {report.title}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {report.category}
                      </p>
                    </div>

                    <span
                      className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        report.status
                      )}`}
                    >
                      {report.status || "Unknown"}
                    </span>
                  </div>

                  <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                    {report.description}
                  </p>

                  <div className="mt-4 space-y-1 text-sm text-slate-500">
                    <p>
                      <strong className="text-slate-700">
                        Location:
                      </strong>{" "}
                      {report.location || "N/A"}
                    </p>

                    <p>
                      <strong className="text-slate-700">
                        Submitted:
                      </strong>{" "}
                      {formatDate(report.createdAt)}
                    </p>
                  </div>
                </button>

                {report.adminResponse && (
                  <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
                    <p className="text-sm font-semibold text-blue-900">
                      Admin Response
                    </p>

                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-blue-800">
                      {report.adminResponse}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/reports/${report._id}`)
                  }
                  className="mt-4 text-sm font-semibold text-blue-600 hover:underline"
                >
                  View Report Details →
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyReports;