import './App.css'
import { useEffect } from "react";
import { socket } from "./utils/socket";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin
import AdminDashboard from "./pages/Admin/AdminDashboard"
import ManageTeams from "./pages/Admin/ManageTeams"
import ManagePlayers from "./pages/Admin/ManagePlayers";
import ManageMatches from "./pages/Admin/ManageMatches";

// Scorer
import ScorerDashboard from "./pages/Scorer/ScorerDashboard";
import ScoreMatch from "./pages/Scorer/ScoreMatch";

// Viewer
import ViewerDashboard from "./pages/Viewer/ViewerDashboard";
import LiveMatch from "./pages/Viewer/LiveMatch";
import Scorecard from "./pages/Viewer/Scorecard";
import Commentary from "./pages/Viewer/Commentary";

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin">
        <AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/teams" element={<ManageTeams />} />
      <Route path="/admin/players" element={<ManagePlayers />} />
      <Route path="/admin/matches" element={<ManageMatches />} />

      {/* Scorer */}
      <Route path="/scorer/dashboard" element={<ProtectedRoute role="scorer">
        <ScorerDashboard /></ProtectedRoute>} />
      <Route path="/scorer/score/:matchId" element={<ScoreMatch />} />

      {/* Viewer */}
      <Route path="/viewer/dashboard" element={<ProtectedRoute role="viewer">
        <ViewerDashboard /></ProtectedRoute>} />
      <Route path="/viewer/live/:matchId" element={<LiveMatch />} />
      <Route path="/viewer/scorecard/:matchId" element={<Scorecard />} />
      <Route path="/viewer/commentary/:matchId" element={<Commentary />} />
    </Routes>
  );
}

export default App;