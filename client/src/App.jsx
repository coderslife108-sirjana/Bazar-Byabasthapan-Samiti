import { BrowserRouter, Routes, Route } from "react-router-dom";

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


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pending" element={<Pending />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/reports/create" element={<CreateReport />} />
        <Route path="/reports/:id" element={<ReportDetails />} />
        <Route path="/reports" element={<MyReports />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/admin/notices" element={<AdminNotices />} />
        <Route  path="/admin/announcements"  element={<AdminAnnouncements />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;