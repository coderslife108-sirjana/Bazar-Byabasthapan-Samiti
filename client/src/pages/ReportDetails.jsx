import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";


function ReportDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getReport = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(`/reports/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReport(response.data.report);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load report"
        );
      } finally {
        setLoading(false);
      }
    };

    getReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-500">
          Loading report...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate("/reports")}
            className="text-blue-600 hover:underline text-sm mb-6"
          >
            ← Back to My Reports
          </button>

          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        <button
          onClick={() => navigate("/reports")}
          className="text-blue-600 hover:underline text-sm mb-6"
        >
          ← Back to My Reports
        </button>

        <div className="bg-white rounded-xl border p-5 sm:p-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

            <div>
              <p className="text-sm text-slate-500">
                Report
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                {report.title}
              </h1>
            </div>

            <span className="w-fit bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
              {report.status}
            </span>

          </div>

          {/* Report Information */}
          <div className="mt-8 space-y-5">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Category
              </p>

              <p className="text-slate-800 mt-1">
                {report.category}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Location
              </p>

              <p className="text-slate-800 mt-1">
                {report.location}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Description
              </p>

              <p className="text-slate-700 mt-1 whitespace-pre-wrap">
                {report.description}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Submitted On
              </p>

              <p className="text-slate-800 mt-1">
                {new Date(
                  report.createdAt
                ).toLocaleString()}
              </p>
            </div>

          </div>

          {/* Admin Response */}
          <div className="mt-8 border-t pt-6">

            <h2 className="text-lg font-semibold text-slate-800">
              Administration Response
            </h2>

            {report.adminResponse ? (
              <div className="mt-3 bg-slate-50 border rounded-lg p-4">
                <p className="text-slate-700 whitespace-pre-wrap">
                  {report.adminResponse}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500 mt-2">
                No response from the administration yet.
              </p>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default ReportDetails;