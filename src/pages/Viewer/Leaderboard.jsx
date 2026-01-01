import React, { useState, useEffect } from "react";
import LeaderboardTable from "../../components/dashboard/viewer/LeaderboardTable";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../../services/api";

const Leaderboard = () => {
  const tabs = ["Teams", "Batters", "Bowlers"];
  const [activeTab, setActiveTab] = useState("Teams");
  const [teamRankings, setTeamRankings] = useState([]);
  const [batterRankings, setBatterRankings] = useState([]);
  const [bowlerRankings, setBowlerRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [teamsRes, battersRes, bowlersRes] = await Promise.all([
          api.get("/viewer/leaderboard/teams"),
          api.get("/viewer/leaderboard/batters"),
          api.get("/viewer/leaderboard/bowlers"),
        ]);

        setTeamRankings(teamsRes);
        setBatterRankings(battersRes);
        setBowlerRankings(bowlersRes);
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
        setError("Failed to load leaderboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <Link
          to="/viewer/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-400"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold dark:text-white">Leaderboard</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg dark:text-white">Loading leaderboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <Link
          to="/viewer/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-400"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold dark:text-white">Leaderboard</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Back */}
      <Link
        to="/viewer/dashboard"
        className="inline-flex items-center text-blue-600 hover:text-blue-400"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold dark:text-white">Leaderboard</h1>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-4 py-2 rounded-lg border
              dark:border-gray-700 dark:text-white
              transition
              ${
                activeTab === tab
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-blue-600 hover:text-white"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Display */}
      {activeTab === "Teams" && (
        <LeaderboardTable type="teams" data={teamRankings} />
      )}

      {activeTab === "Batters" && (
        <LeaderboardTable type="batters" data={batterRankings} />
      )}

      {activeTab === "Bowlers" && (
        <LeaderboardTable type="bowlers" data={bowlerRankings} />
      )}
    </div>
  );
};

export default Leaderboard;
