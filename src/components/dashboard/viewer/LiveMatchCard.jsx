import React from "react";
import { PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LiveMatchCard = ({ match }) => {
  const navigate = useNavigate();

  return (
    <div
      className="p-5 bg-white dark:bg-gray-900 rounded-xl border 
                 shadow-sm hover:shadow-xl hover:-translate-y-1 
                 transition-all"
    >
      {/* Top Row: LIVE + Match Meta */}
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 text-xs font-semibold bg-red-600 text-white rounded-full animate-pulse">
          LIVE
        </span>

        <div className="text-xs text-gray-600 dark:text-gray-400">
          {match.matchType} • {match.overs ?? "?"} Overs
        </div>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between mt-4">
        {/* Team A */}
        <div className="flex items-center gap-3">
          <img
            src={match.teamA?.logo || "/default-logo.png"}
            alt={match.teamA?.name}
            className="h-10 w-10 rounded-full object-cover border"
          />
          <p className="font-semibold text-base dark:text-white">
            {match.teamA?.name}
          </p>
        </div>

        <p className="font-bold text-gray-500 dark:text-gray-400 text-sm">VS</p>

        {/* Team B */}
        <div className="flex items-center gap-3">
          <p className="font-semibold text-base dark:text-white">
            {match.teamB?.name}
          </p>
          <img
            src={match.teamB?.logo || "/default-logo.png"}
            alt={match.teamB?.name}
            className="h-10 w-10 rounded-full object-cover border"
          />
        </div>
      </div>

      {/* Score */}
      <div className="mt-4">
        <p className="text-3xl font-extrabold dark:text-white tracking-wide">
          {match.currentScore?.runs ?? 0}
          <span className="text-xl font-semibold text-gray-500">
            {" "}
            / {match.currentScore?.wickets ?? 0}
          </span>
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Overs: {match.currentScore?.overs ?? "0.0"} / {match.overs ?? "?"}
        </p>
      </div>

      {/* Venue + Officials */}
      <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-1">
        <p>
          <strong>Venue:</strong> {match.venue?.name}, {match.venue?.city}
        </p>

        <p>
          <strong>Umpires:</strong>{" "}
          {match.umpires?.length
            ? match.umpires.map((u) => u.name).join(", ")
            : "Not assigned"}
        </p>

        <p>
          <strong>Scorer:</strong> {match.scorerId?.name || "Not assigned"}
        </p>
      </div>

      {/* Watch Button */}
      <button
        className="mt-5 w-full py-2.5 flex items-center justify-center gap-2 
                   text-white font-semibold rounded-lg shadow 
                   bg-red-600 hover:bg-red-700 transition"
        onClick={() => navigate(`/viewer/match/${match._id}`)}
      >
        <PlayCircle size={20} />
        Watch Live
      </button>
    </div>
  );
};

export default LiveMatchCard;
