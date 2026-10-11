
import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";

function Pending() {
  const { t } = useLanguage();

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
              {t("Dumkibas Bazar")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {t("Byabasthapan Samiti")}
            </p>
          </div>
        </div>
      </header>

      {/* Confirmation */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl rounded-3xl bg-white border border-slate-100 shadow-xl p-8 sm:p-12 text-center">
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-amber-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </div>

          <p className="text-emerald-700 font-semibold text-sm uppercase tracking-widest mb-3">
            {t("Request received")}
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            {t("Your Request Is Under Review")}
          </h2>

          <p className="text-slate-600 leading-7 mb-6">
            {t(
              "Thank you for requesting access to the Dumkibas Bazar Byabasthapan Samiti portal. Your request has been submitted successfully."
            )}
          </p>

          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 text-left mb-7">
            <h3 className="font-semibold text-slate-800 mb-2">
              {t("What happens next?")}
            </h3>
            <p className="text-sm text-slate-600 leading-6">
              {t(
                "The administrator will review your request. Please wait until your account is approved before signing in."
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              className="inline-flex justify-center items-center rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              {t("Go to Login")}
            </Link>

            <Link
              to="/"
              className="inline-flex justify-center items-center rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {t("Back to Home")}
            </Link>
          </div>

          <p className="text-xs text-slate-400 mt-8">
            {t("Dumkibas Bazar Byabasthapan Samiti")}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 px-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} {t("Dumkibas Bazar Byabasthapan Samiti")}.{" "}
        {t("All rights reserved.")}
      </footer>
    </div>
  );
}

export default Pending;