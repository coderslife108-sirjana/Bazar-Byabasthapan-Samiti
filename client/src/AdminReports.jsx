import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getReports = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReports(response.data.reports);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load reports"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReports();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">

          <button
            onClick={() => navigate("/admin")}
            className="text-blue-600 hover:underline text-sm mb-4"
          >
            ← Back to Admin Dashboard
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Reports Management
          </h1>

          <p className="text-slate-500 mt-1">
            View and manage reports submitted by members.
          </p>

        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl border p-8 text-center">
            <p className="text-slate-500">
              Loading reports...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
            {error}
          </div>
        )}

        {/* No Reports */}
        {!loading && !error && reports.length === 0 && (
          <div className="bg-white rounded-xl border p-10 text-center">

            <div className="text-4xl mb-3">
              📋
            </div>

            <h2 className="text-lg font-semibold text-slate-800">
              No reports found
            </h2>

            <p className="text-slate-500 mt-2">
              No reports have been submitted yet.
            </p>

          </div>
        )}

        {/* Reports */}
        {!loading && !error && reports.length > 0 && (
          <div className="space-y-4">

            {reports.map((report) => (

              <div
                key={report._id}
                className="bg-white rounded-xl border p-5"
              >

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                  {/* Report Info */}
                  <div className="flex-1">

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                      <h2 className="text-lg font-semibold text-slate-800">
                        {report.title}
                      </h2>

                      <span className="w-fit bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        {report.status}
                      </span>

                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      {report.category}
                    </p>

                    <p className="text-slate-600 mt-4">
                      {report.description}
                    </p>

                    <div className="mt-4 text-sm text-slate-500 space-y-1">

                      <p>
                        <strong>Location:</strong>{" "}
                        {report.location}
                      </p>

                      <p>
                        <strong>Submitted by:</strong>{" "}
                        {report.createdBy?.name || "Unknown"}
                      </p>

                      <p>
                        <strong>Email:</strong>{" "}
                        {report.createdBy?.email || "N/A"}
                      </p>

                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(
                          report.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>

                  </div>

                  {/* Action */}
                  <button
                    onClick={() =>
                      navigate(`/admin/reports/${report._id}`)
                    }
                    className="w-full lg:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
                  >
                    Manage Report
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default AdminReports;