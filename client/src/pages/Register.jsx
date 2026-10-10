
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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
      const response = await api.post("/auth/register", formData);
      setMessage(response.data.message || "Your access request was submitted successfully.");

      setTimeout(() => {
        navigate("/pending");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-2xl font-bold">
            D
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800">
              Dumkibas Bazar
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Byabasthapan Samiti
            </p>
          </div>
        </div>
      </header>

      {/* Registration section */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl grid md:grid-cols-5 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          {/* Welcome panel */}
          <section className="md:col-span-2 bg-emerald-800 text-white p-8 sm:p-10 flex flex-col justify-center">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl mb-6">
              +
            </div>

            <p className="text-emerald-200 font-semibold text-sm uppercase tracking-widest mb-4">
              Join our community
            </p>

            <h2 className="text-3xl font-bold leading-tight mb-5">
              Request Your Portal Access
            </h2>

            <p className="text-emerald-50 leading-7 mb-8">
              Create an access request to connect with community services,
              read announcements, and submit reports.
            </p>

            <div className="rounded-2xl bg-white/10 border border-white/15 p-5">
              <p className="font-semibold mb-2">How it works</p>
              <p className="text-sm text-emerald-50 leading-6">
                1. Complete the request form.
                <br />
                2. The administrator reviews your request.
                <br />
                3. Access is available after approval.
              </p>
            </div>
          </section>

          {/* Form */}
          <section className="md:col-span-3 p-7 sm:p-10">
            <div className="mb-7">
              <p className="text-emerald-700 font-semibold text-sm mb-2">
                NEW MEMBER
              </p>
              <h2 className="text-3xl font-bold text-slate-800">
                Request Access
              </h2>
              <p className="text-slate-500 mt-2">
                Fill in your details to submit your request.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-2">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  Create password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className={`${inputClass} pr-20`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  Use at least 6 characters.
                </p>
              </div>

              {message && (
                <div role="status" className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
                  {message}
                </div>
              )}

              {error && (
                <div role="alert" className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-700 py-3.5 font-semibold text-white shadow-md transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting request..." : "Submit Access Request"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </section>
        </div>
      </main>

      <footer className="py-5 px-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Dumkibas Bazar Byabasthapan Samiti.
        All rights reserved.
      </footer>
    </div>
  );
}

export default Register;