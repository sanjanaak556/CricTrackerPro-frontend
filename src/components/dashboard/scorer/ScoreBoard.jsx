import React from "react";

export default function ScoreBoard({ innings }) {
  if (!innings) {
    return (
      <div className="bg-gray-200 dark:bg-gray-900 rounded p-6 text-center text-gray-700 dark:text-gray-300">
        Waiting for innings to start...
      </div>
    );
  }

  const {
    totalRuns = 0,
    totalWickets = 0,
    totalOvers = "0.0",
    striker,
    nonStriker,
    currentBowler,
  } = innings;

  return (
    <div className="bg-gray-200 dark:bg-gray-900 rounded p-4 sm:p-6 space-y-4">
      {/* SCORE */}
      <div className="text-center">
        <div className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
          {totalRuns}/{totalWickets}
        </div>
        <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Overs: {totalOvers}
        </div>
      </div>

      {/* BATTERS */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-white dark:bg-gray-800 rounded p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Striker
          </div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {striker?.name || "—"}
            <span className="ml-1 text-green-500">*</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Non-Striker
          </div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {nonStriker?.name || "—"}
          </div>
        </div>
      </div>

      {/* BOWLER */}
      <div className="bg-white dark:bg-gray-800 rounded p-3 text-sm text-center">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Current Bowler
        </div>
        <div className="font-semibold text-gray-900 dark:text-white">
          {currentBowler?.name || "Not selected"}
        </div>
      </div>
    </div>
  );
}
