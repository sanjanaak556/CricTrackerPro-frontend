import React from "react";

export default function MatchHeader({ match }) {
  if (!match) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded shadow p-4 space-y-3">
      {/* MATCH NAME */}
      {match.matchName && (
        <div className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
          {match.matchName}
        </div>
      )}

      {/* TEAMS */}
      <div className="flex items-center justify-between">
        {/* TEAM A */}
        <div className="flex items-center gap-2">
          {match.teamA?.logo && (
            <img
              src={match.teamA.logo}
              alt={match.teamA.name}
              className="w-8 h-8 object-contain"
            />
          )}
          <span className="font-semibold text-gray-900 dark:text-white">
            {match.teamA?.shortName || match.teamA?.name}
          </span>
        </div>

        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          VS
        </span>

        {/* TEAM B */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 dark:text-white">
            {match.teamB?.shortName || match.teamB?.name}
          </span>
          {match.teamB?.logo && (
            <img
              src={match.teamB.logo}
              alt={match.teamB.name}
              className="w-8 h-8 object-contain"
            />
          )}
        </div>
      </div>

      {/* MATCH META */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex gap-2">
          <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {match.matchType}
          </span>

          <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {match.overs} overs
          </span>
        </div>

        <span
          className={`px-3 py-1 rounded text-xs font-semibold
            ${
              match.status === "live"
                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                : match.status === "completed"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
            }
          `}
        >
          {match.status.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
