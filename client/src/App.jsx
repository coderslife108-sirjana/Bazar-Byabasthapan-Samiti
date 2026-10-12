
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pending from "./pages/Pending";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import CreateReport from "./pages/CreateReport";
import MyReports from "./pages/MyReports";
import ReportDetails from "./pages/ReportDetails";
import AdminReports from "./pages/AdminReports";
import AdminReportDetails from "./pages/AdminReportDetails";
import AdminUsers from "./pages/AdminUsers";
import Notices from "./pages/Notices";
import AdminNotices from "./pages/AdminNotices";
import AdminAnnouncements from "./pages/AdminAnnouncements";
import Announcements from "./pages/Announcements";
import ManagerDashboard from "./pages/ManagerDashboard";
import Messages from "./pages/Messages";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./component/ProtectedRoute";
import { LanguageProvider } from "./context/LanguageContext";
import { useLanguage } from "./context/useLanguage";

function AppContent() {
  const { language, setLanguage } = useLanguage();

  return (
    <BrowserRouter>
      <div
        lang={language === "ne" ? "ne" : "en"}
        className="min-h-screen pb-[calc(env(safe-area-inset-bottom)+4.25rem)] sm:pb-0"
      >
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pending" element={<Pending />} />

          {/* Logged-in users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reports/create" element={<CreateReport />} />
            <Route path="/reports/:id" element={<ReportDetails />} />
            <Route path="/reports" element={<MyReports />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/messages" element={<Messages />} />
          </Route>

          {/* Admin only */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/reports/:id" element={<AdminReportDetails />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route
              path="/admin/announcements"
              element={<AdminAnnouncements />}
            />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["noticeManager", "staff"]} />}>
            <Route path="/manager" element={<ManagerDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin", "noticeManager", "staff"]} />}>
            <Route path="/admin/notices" element={<AdminNotices />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <div
          role="group"
          aria-label="Language"
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] right-1/2 z-50 flex min-h-12 translate-x-1/2 rounded-xl border border-slate-200 bg-white p-1 shadow-lg sm:bottom-4 sm:right-4 sm:translate-x-0"
        >
          <button
            type="button"
            lang="en"
            aria-pressed={language === "en"}
            onClick={() => setLanguage("en")}
            className={`min-h-10 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              language === "en"
                ? "bg-emerald-700 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            English
          </button>
          <button
            type="button"
            lang="ne"
            aria-pressed={language === "ne"}
            onClick={() => setLanguage("ne")}
            className={`min-h-10 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              language === "ne"
                ? "bg-emerald-700 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            नेपाली
          </button>
        </div>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
