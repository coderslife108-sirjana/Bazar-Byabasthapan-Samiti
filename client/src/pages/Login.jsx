
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (err.request
            ? "Unable to connect to the server. Check your connection and try again."
            : "Unable to sign in. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

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

      {/* Main section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          {/* Welcome panel */}
          <section className="relative bg-emerald-800 text-white p-8 sm:p-12 flex flex-col justify-center overflow-hidden">
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full border-[35px] border-white/10" />
            <div className="absolute -left-12 -bottom-16 w-48 h-48 rounded-full bg-emerald-700/70" />

            <div className="relative z-10">
              <p className="text-emerald-200 font-semibold text-sm uppercase tracking-widest mb-5">
                Welcome to our portal
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-5">
                Working Together for a Better Dumkibas
              </h2>

              <p className="text-emerald-50 leading-7 mb-8">
                Access community notices, announcements, and reporting
                services through the Dumkibas Bazar Byabasthapan Samiti
                portal.
              </p>

              <div className="space-y-4 text-sm text-emerald-50">
                <p className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                    ✓
                  </span>
                  Community updates and notices
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                    ✓
                  </span>
                  Easy report submission
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                    ✓
                  </span>
                  Organized community services
                </p>
              </div>
            </div>
          </section>

          {/* Login form */}
          <section className="p-7 sm:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <p className="text-emerald-700 font-semibold text-sm mb-2">
                MEMBER ACCESS
              </p>
              <h2 className="text-3xl font-bold text-slate-800">
                Sign in
              </h2>
              <p className="text-slate-500 mt-2">
                Enter your account details to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  inputMode="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3.5 pr-20 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-700 py-3.5 font-semibold text-white shadow-md transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in to your account"}
              </button>
            </form>

            <div className="mt-7 text-center text-sm text-slate-600">
              Don't have access yet?{" "}
              <Link
                to="/register"
                className="font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
              >
                Request Access
              </Link>
            </div>

            <p className="mt-8 text-center text-xs text-slate-400">
              Authorized community members only
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 px-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Dumkibas Bazar Byabasthapan Samiti.
        All rights reserved.
      </footer>
    </div>
  );
}

export default Login;