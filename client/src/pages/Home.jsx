
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/useLanguage";

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  if (user) {
    const destination =
      user.role === "admin"
        ? "/admin"
        : ["noticeManager", "staff"].includes(user.role)
          ? "/manager"
          : "/dashboard";

    return <Navigate to={destination} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navigation */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 py-3 sm:px-5 sm:py-4 lg:px-8">
          <button
            onClick={() => navigate("/")}
            className="flex min-w-0 items-center gap-2 text-left sm:gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-800 text-xl text-white sm:h-12 sm:w-12 sm:text-2xl">
              🏛️
            </div>

            <div>
              <h1 className="text-sm font-bold leading-5 text-slate-900 sm:text-lg">
                {t("Dumkibas Bazar")}
              </h1>
              <p className="text-[11px] leading-4 text-slate-500 sm:text-sm">
                {t("Byabasthapan Samiti")}
              </p>
            </div>
          </button>

          <nav className="hidden items-center gap-7 md:flex">
            <a href="#home" className="text-sm font-medium hover:text-emerald-800">
              {t("Home")}
            </a>
            <a href="#about" className="text-sm font-medium hover:text-emerald-800">
              {t("About Us")}
            </a>
            <a href="#services" className="text-sm font-medium hover:text-emerald-800">
              {t("Services")}
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-emerald-800">
              {t("Contact")}
            </a>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 sm:px-5"
            >
              {t("Login")}
            </button>

            <button
              onClick={() => navigate("/register")}
              className="rounded-lg bg-emerald-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-900 sm:px-5"
            >
              {t("Request Access")}
            </button>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? t("Close menu") : t("Open menu")}
            aria-expanded={menuOpen}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-xl text-slate-700 hover:bg-slate-50 md:hidden"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
        {menuOpen && (
          <nav className="space-y-1 border-t border-slate-200 bg-white p-3 md:hidden">
            {[
              ["Home", "#home"],
              ["About Us", "#about"],
              ["Services", "#services"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-emerald-50"
              >
                {t(label)}
              </a>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/login");
                }}
                className="min-h-11 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
              >
                {t("Login")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/register");
                }}
                className="min-h-11 rounded-lg bg-emerald-800 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-900"
              >
                {t("Request Access")}
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Hero section */}
      <main>
        <section id="home" className="relative overflow-hidden bg-emerald-950">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-700/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:py-28 lg:grid-cols-2 lg:px-8">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-700 bg-emerald-900/60 px-4 py-2 text-sm text-emerald-100">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                {t("Community • Cooperation • Progress")}
              </div>

              <h2 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                {t("Working Together for a")}
                <span className="mt-2 block text-emerald-300">
                  {t("Better Dumkibas Bazar")}
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-emerald-100/80 sm:text-lg">
                {t(
                  "Welcome to the official digital portal of Dumkibas Bazar Byabasthapan Samiti. Access community information, read important notices, and submit reports through one convenient platform."
                )}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-xl bg-white px-7 py-3.5 font-semibold text-emerald-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
                >
                  {t("Access Member Portal →")}
                </button>

                <button
                  onClick={() => navigate("/register")}
                  className="rounded-xl border border-emerald-600 px-7 py-3.5 font-semibold text-white transition hover:bg-emerald-900"
                >
                  {t("Request Access")}
                </button>
              </div>

              <p className="mt-5 text-sm text-emerald-200/70">
                {t("Secure access for approved community members.")}
              </p>
            </div>

            <div className="mx-auto w-full max-w-lg">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur">
                <div className="rounded-2xl bg-white p-6 sm:p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                    🌿
                  </div>

                  <h3 className="mt-5 text-2xl font-bold text-slate-900">
                    {t("A Better-Connected Community")}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {t(
                      "Helping community members stay informed and communicate with the committee more easily."
                    )}
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                        📢
                      </span>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {t("Notices & Announcements")}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {t("Stay informed about community updates.")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                        📝
                      </span>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {t("Reports & Complaints")}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {t("Submit concerns through the member portal.")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        🤝
                      </span>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {t("Community Cooperation")}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {t("Support a more organized and connected bazaar.")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-800">
              {t("About the Committee")}
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {t("Serving Our Local Community")}
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              {t(
                "Dumkibas Bazar Byabasthapan Samiti works to support the organization and management of the local bazaar. This website provides a convenient place for approved members to access information and communicate with the committee."
              )}
            </p>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-800">
                {t("Member Portal")}
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                {t("Services at Your Fingertips")}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
                {t("Sign in to access the services available to approved members.")}
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: "📢",
                  title: t("Notices & Announcements"),
                  description:
                    t("Read important updates and information published by the committee."),
                },
                {
                  icon: "📝",
                  title: t("Reports & Complaints"),
                  description:
                    t("Submit reports and track your own submitted concerns."),
                },
                {
                  icon: "🔐",
                  title: t("Secure Member Access"),
                  description:
                    t("Request access and sign in after your account is approved."),
                },
              ].map((service) => (
                <article
                  key={service.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
                    {service.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {service.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {service.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Contact call to action */}
        <section id="contact" className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
          <div className="rounded-3xl bg-emerald-900 px-6 py-10 text-center sm:px-12 sm:py-14">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              {t("Be Part of Our Community")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-emerald-100/80">
              {t(
                "Request member access to use the online portal and stay connected with committee updates."
              )}
            </p>
            <button
              onClick={() => navigate("/register")}
              className="mt-7 rounded-xl bg-white px-7 py-3.5 font-semibold text-emerald-950 hover:bg-emerald-50"
            >
              {t("Request Access")} →
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-8">
          <div>
            <p className="font-semibold text-slate-800">
              {t("Dumkibas Bazar Byabasthapan Samiti")}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {t("Community information and member services.")}
            </p>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} {t("Dumkibas Bazar Byabasthapan Samiti")}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
