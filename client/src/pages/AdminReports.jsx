
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

function AdminReports() {
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
          "Failed to load reports. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    getReports();
  }, [getReports]);

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
        report.createdBy?.name,
        report.createdBy?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [reports, searchTerm, statusFilter]);

  const getStatusStyle = (status) => {
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
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleString();
  };

  const statusCounts = useMemo(() => {
    const counts = { All: reports.length };

    REPORT_STATUSES.forEach((status) => {
      counts[status] = reports.filter(
        (report) => report.status === status
      ).length;
    });

    return counts;
  }, [reports]);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin")}
            className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Admin Dashboard
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                Reports Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Review and manage reports submitted by members.
              </p>
            </div>

            <button
              onClick={() => getReports(true)}
              disabled={loading || refreshing}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {refreshing ? "Refreshing..." : "↻ Refresh Reports"}
            </button>
          </div>
        </div>

        {/* Summary cards */}
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
              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                {status === "All" ? "Total Reports" : status}
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {statusCounts[status]}
              </p>
            </button>
          ))}
        </div>

        {/* Search and filters */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label
                htmlFor="report-search"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Search Reports
              </label>

              <input
                id="report-search"
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search title, category, location, member..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="status-filter"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Filter by Status
              </label>

              <select
                id="status-filter"
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

          <div className="mt-4 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
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
                className="self-start font-semibold text-blue-600 hover:text-blue-800 sm:self-auto"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-slate-600">Loading reports...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
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

        {/* No reports at all */}
        {!loading && !error && reports.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <div className="mb-3 text-4xl">📋</div>

            <h2 className="text-lg font-semibold text-slate-800">
              No reports found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              No reports have been submitted yet.
            </p>
          </div>
        )}

        {/* No search/filter matches */}
        {!loading &&
          !error &&
          reports.length > 0 &&
          filteredReports.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <div className="mb-3 text-4xl">🔎</div>

              <h2 className="text-lg font-semibold text-slate-800">
                No matching reports
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try another search term or status filter.
              </p>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
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
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <h2 className="break-words text-lg font-bold text-slate-800">
                        {report.title}
                      </h2>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          report.status
                        )}`}
                      >
                        {report.status || "Unknown"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-medium text-blue-700">
                      {report.category}
                    </p>

                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                      {report.description}
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500 sm:grid-cols-2">
                      <p className="break-words">
                        <strong className="text-slate-700">
                          Location:
                        </strong>{" "}
                        {report.location || "N/A"}
                      </p>

                      <p className="break-words">
                        <strong className="text-slate-700">
                          Submitted by:
                        </strong>{" "}
                        {report.createdBy?.name || "Unknown"}
                      </p>

                      <p className="break-words">
                        <strong className="text-slate-700">
                          Email:
                        </strong>{" "}
                        {report.createdBy?.email || "N/A"}
                      </p>

                      <p>
                        <strong className="text-slate-700">
                          Submitted:
                        </strong>{" "}
                        {formatDate(report.createdAt)}
                      </p>

                      {report.adminResponse && (
                        <p className="break-words sm:col-span-2">
                          <strong className="text-slate-700">
                            Admin Response:
                          </strong>{" "}
                          {report.adminResponse}
                        </p>
                      )}

                      {report.attachments?.length > 0 && (
                        <p className="sm:col-span-2">
                          <strong className="text-slate-700">
                            Attachments:
                          </strong>{" "}
                          {report.attachments.length}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/admin/reports/${report._id}`)
                    }
                    className="w-full shrink-0 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 lg:w-auto"
                  >
                    Manage Report →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReports;