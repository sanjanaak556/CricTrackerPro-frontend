import React, { useState } from "react";
import LeaderboardTable from "../../components/dashboard/viewer/LeaderboardTable";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Leaderboard = () => {
  const tabs = ["Teams", "Batters", "Bowlers"];
  const [activeTab, setActiveTab] = useState("Teams");

  // Dummy data for now — backend integration later
  const teamRankings = [
    { rank: 1, name: "Super Strikers", matches: 12, wins: 10, points: 20 },
    { rank: 2, name: "Royal Warriors", matches: 12, wins: 8, points: 16 },
    { rank: 3, name: "Thunder Hawks", matches: 12, wins: 7, points: 14 },
  ];

  const batterRankings = [
    {
      rank: 1,
      name: "Rahul Kumar",
      team: "Super Strikers",
      runs: 563,
      avg: 48.2,
    },
    {
      rank: 2,
      name: "Sam Peter",
      team: "Royal Warriors",
      runs: 510,
      avg: 45.6,
    },
    {
      rank: 3,
      name: "Akash Verma",
      team: "Thunder Hawks",
      runs: 488,
      avg: 42.3,
    },
  ];

  const bowlerRankings = [
    {
      rank: 1,
      name: "Vikram Singh",
      team: "Super Strikers",
      wickets: 24,
      eco: 6.2,
    },
    {
      rank: 2,
      name: "John Mathews",
      team: "Royal Warriors",
      wickets: 21,
      eco: 6.8,
    },
    {
      rank: 3,
      name: "Sahil Khan",
      team: "Thunder Hawks",
      wickets: 19,
      eco: 7.1,
    },
  ];

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
