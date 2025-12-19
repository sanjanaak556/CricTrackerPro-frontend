import { useEffect, useState } from "react";
import api from "../../services/api";
import { Hand } from "lucide-react";

import { Trophy, Activity, CheckCircle, CalendarDays } from "lucide-react";

import StatsCard from "../../components/dashboard/scorer/StatsCard";
import MatchCard from "../../components/dashboard/scorer/MatchCard";
import LiveMatchBanner from "../../components/dashboard/scorer/LiveMatchBanner";

export default function ScorerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/scorer/dashboard");
        setData(res);
      } catch (err) {
        console.error("Dashboard error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white flex items-center gap-2">
          <Hand className="w-7 h-7 text-blue-600" />
          Welcome, {data.scorerName}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your matches and live scoring
        </p>
      </div>

      {/* Live Match Banner */}
      {data.liveMatch && <LiveMatchBanner match={data.liveMatch} />}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Matches Assigned"
          value={data.stats.totalMatches}
          icon={Trophy}
          color="bg-indigo-100 text-indigo-600"
        />
        <StatsCard
          title="Live Matches"
          value={data.stats.liveMatches}
          icon={Activity}
          color="bg-red-100 text-red-600"
          animate
        />
        <StatsCard
          title="Completed"
          value={data.stats.completedMatches}
          icon={CheckCircle}
          color="bg-green-100 text-green-600"
        />
        <StatsCard
          title="Today's Matches"
          value={data.stats.todayMatches}
          icon={CalendarDays}
          color="bg-yellow-100 text-yellow-600"
        />
      </div>

      {/* Assigned Matches */}
      <div>
        <h2 className="text-2xl font-semibold mb-5 dark:text-white">
          Assigned Matches
        </h2>

        {data.assignedMatches.length === 0 ? (
          <p className="text-gray-500">No matches assigned yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {data.assignedMatches.map((match) => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
