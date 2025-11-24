import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import ViewerDashboard from "./pages/Viewer/ViewerDashboard";
import ScorerDashboard from "./pages/Scorer/ScorerDashboard";
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboards */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin">
        <AdminDashboard /></ProtectedRoute>} />
      <Route path="/viewer/dashboard" element={<ProtectedRoute role="viewer">
        <ViewerDashboard /></ProtectedRoute>} />
      <Route path="/scorer/dashboard" element={<ProtectedRoute role="scorer">
        <ScorerDashboard /></ProtectedRoute>} />
    </Routes>
  );
}

