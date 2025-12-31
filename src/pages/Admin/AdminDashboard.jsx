import { useState, useEffect } from "react";
import ActivityFeed from "../../components/dashboard/admin/ActivityFeed";
import ChartsSection from "../../components/dashboard/admin/ChartsSection";
import OverviewCards from "../../components/dashboard/admin/OverviewCards";
import RecentMatchesTable from "../../components/dashboard/admin/RecentMatchesTable";
import api from "../../services/api";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await api.get("/admin/dashboard/stats");
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Top Cards Section */}
      <OverviewCards stats={dashboardData.stats} />

      {/* Recent Matches Table */}
      <RecentMatchesTable matches={dashboardData.recentMatches} />

      {/* Charts */}
      <ChartsSection charts={dashboardData.charts} />

      {/* Activity Feed */}
      <ActivityFeed activities={dashboardData.activities} />
    </div>
  );
}
