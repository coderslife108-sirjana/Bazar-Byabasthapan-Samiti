import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateReport() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/reports",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      setFormData({
        title: "",
        category: "",
        description: "",
        location: "",
      });

      setTimeout(() => {
        navigate("/reports");
      }, 1200);

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to submit report"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">

      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:underline text-sm mb-4"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Create Report
          </h1>

          <p className="text-slate-500 mt-2">
            Submit a report to the Dumkibas Bazar Management Committee.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border p-5 sm:p-8">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Report Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter report title"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  Select a category
                </option>

                <option value="Waste Management">
                  Waste Management
                </option>

                <option value="Road/Infrastructure">
                  Road / Infrastructure
                </option>

                <option value="Market Management">
                  Market Management
                </option>

                <option value="Street/Vendor Issues">
                  Street / Vendor Issues
                </option>

                <option value="Sanitation">
                  Sanitation
                </option>

                <option value="Electricity/Lighting">
                  Electricity / Lighting
                </option>

                <option value="Water">
                  Water
                </option>

                <option value="Security">
                  Security
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Where did this issue occur?"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the issue in detail..."
                rows="6"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Messages */}
            {message && (
              <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg p-3 text-sm">
                {message}
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default CreateReport;