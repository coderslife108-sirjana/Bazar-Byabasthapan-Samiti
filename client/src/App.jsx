
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
import AdminUsers from "./pages/AdminUsers";
import Notices from "./pages/Notices";
import AdminNotices from "./pages/AdminNotices";
import AdminAnnouncements from "./pages/AdminAnnouncements";
import Announcements from "./pages/Announcements";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./component/ProtectedRoute";
import { LanguageProvider } from "./context/LanguageContext";
import { useLanguage } from "./context/useLanguage";

function AppContent() {
  const { language, setLanguage } = useLanguage();

  return (
    <BrowserRouter>
      <div lang={language === "ne" ? "ne" : "en"}>
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
          </Route>

          {/* Admin only */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/notices" element={<AdminNotices />} />
            <Route
              path="/admin/announcements"
              element={<AdminAnnouncements />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <div className="fixed bottom-4 right-4 z-50 flex rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
          <button
            type="button"
            lang="en"
            aria-pressed={language === "en"}
            onClick={() => setLanguage("en")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
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
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
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
