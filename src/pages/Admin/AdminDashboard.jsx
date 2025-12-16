import ActivityFeed from "../../components/dashboard/admin/ActivityFeed";
import ChartsSection from "../../components/dashboard/admin/ChartsSection";
import OverviewCards from "../../components/dashboard/admin/OverviewCards";
import RecentMatchesTable from "../../components/dashboard/admin/RecentMatchesTable";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Top Cards Section */}
      <OverviewCards />

      {/* Recent Matches Table */}
      <RecentMatchesTable />

      {/* Charts */}
      <ChartsSection />

      {/* Activity Feed */}
      <ActivityFeed />
    </div>
  );
}
