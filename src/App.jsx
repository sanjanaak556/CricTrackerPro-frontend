import "./App.css";
import { useEffect } from "react";
import { socket } from "./utils/socket";
import { Routes, Route } from "react-router-dom";
import { loadTheme } from "./utils/theme";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";

// Admin
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageTeams from "./pages/Admin/ManageTeams";
import ManagePlayers from "./pages/Admin/ManagePlayers";
import ManageMatches from "./pages/Admin/ManageMatches";
import ViewMatchDetails from "./components/dashboard/admin/ViewMatchDetails";
import Reports from "./pages/Admin/Reports";
import ViewReportDetails from "./components/dashboard/admin/ViewReportDetails";
import UsersAndRoles from "./pages/Admin/UsersAndRoles";


// Viewer
import ViewerDashboard from "./pages/Viewer/ViewerDashboard";
import AllMatches from "./pages/Viewer/AllMatches";
import Leaderboard from "./pages/Viewer/Leaderboard";
import Highlights from "./pages/Viewer/Highlights";
import MatchHistory from "./pages/Viewer/MatchHistory";
import Teams from "./pages/Viewer/Teams";
import FollowedTeams from "./pages/Viewer/FollowedTeams";
import MatchPreview from "./pages/Viewer/MatchPreview";
import MatchSummary from "./pages/Viewer/MatchSummary";
import LiveMatch from "./pages/Viewer/LiveMatch";


// Scorer
import ScorerDashboard from "./pages/Scorer/ScorerDashboard";
import ManageScorerMatches from "./pages/Scorer/ManageScorerMatches";



function App() {
  // 🔹 Socket listeners
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

  // 🔹 Load theme on app start
  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/profile"
        element={
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        }
      />
      <Route path="/logout" element={<Logout />} />


      {/* ADMIN */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Manage Teams */}
      <Route
        path="/admin/teams"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout>
              <ManageTeams />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Manage Players */}
      <Route
        path="/admin/players"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout>
              <ManagePlayers />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Manage Matches */}
      <Route
        path="/admin/matches"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout>
              <ManageMatches />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* View Match Details */}
      <Route
        path="/admin/matches/view/:matchId"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout>
              <ViewMatchDetails />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Reports */}
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout>
              <Reports />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* View Report Details */}
      <Route
        path="/admin/reports/view/:reportId"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout>
              <ViewReportDetails />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Users and Roles */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout>
              <UsersAndRoles />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Settings */}
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />


      {/* SCORER */}
      <Route
        path="/scorer/dashboard"
        element={
          <ProtectedRoute role="scorer">
            <DashboardLayout>
              <ScorerDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Manage Scorer Matches */}
      <Route
        path="/scorer/matches"
        element={
          <ProtectedRoute role="scorer">
            <DashboardLayout>
              <ManageScorerMatches />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* MatchPreview (Scorer) */}
      <Route
        path="/scorer/match/:matchId"
        element={
          <ProtectedRoute role="scorer">
            <DashboardLayout>
              <MatchPreview />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Settings */}
      <Route
        path="/scorer/settings"
        element={
          <ProtectedRoute role="scorer">
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />


      {/* VIEWER */}
      <Route
        path="/viewer/dashboard"
        element={
          <ProtectedRoute role="viewer">
            <DashboardLayout>
              <ViewerDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* All Matches */}
      <Route
        path="/viewer/all-matches"
        element={
          <ProtectedRoute role="viewer">
            <DashboardLayout>
              <AllMatches />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Match Preview */}
      <Route
        path="/viewer/match/preview/:matchId"
        element={
          <ProtectedRoute role="viewer">
            <DashboardLayout>
              <MatchPreview />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Match Summary */}
      <Route
        path="/viewer/match/summary/:matchId"
        element={
          <ProtectedRoute role="viewer">
            <DashboardLayout>
              <MatchSummary />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Live Match */}
      <Route
        path="/viewer/match/live/:matchId"
        element={
          <ProtectedRoute role="viewer">
            <DashboardLayout>
              <LiveMatch />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Leaderboard */}
      <Route
        path="/viewer/leaderboard"
        element={
          <ProtectedRoute role="viewer">
            <DashboardLayout>
              <Leaderboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Highlights */}
      <Route
        path="/viewer/highlights"
        element={
          <ProtectedRoute role="viewer">
            <DashboardLayout>
              <Highlights />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Match History */}
      <Route
        path="/viewer/match-history"
        element={
          <ProtectedRoute role="viewer">
            <DashboardLayout>
              <MatchHistory />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Teams */}
      <Route
        path="/viewer/teams"
        element={
          <ProtectedRoute role="viewer">
            <DashboardLayout>
              <Teams />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Followed Teams */}
      <Route
        path="/viewer/followed-teams"
        element={
          <ProtectedRoute role="viewer">
            <DashboardLayout>
              <FollowedTeams />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Settings */}
      <Route
        path="/viewer/settings"
        element={
          <ProtectedRoute role="viewer">
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
