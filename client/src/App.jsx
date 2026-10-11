
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

