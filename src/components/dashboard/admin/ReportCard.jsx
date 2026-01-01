import React from "react";
import { Eye, Edit, Trash } from "lucide-react";
import { Link } from "react-router-dom";

export default function ReportCard({ report, onEdit, onDelete }) {
  const title = report.matchId?.matchName || `Match #${report.matchId?.matchNumber ?? ""}` || "Match Summary";
  const matchType = report.matchId?.matchType || "—";
  const createdAt = report.createdAt ? new Date(report.createdAt) : null;

  const team1 = report.team1 || report.matchId?.teamA;
  const team2 = report.team2 || report.matchId?.teamB;
  const winner = report.winnerTeamId;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
          {matchType} • {createdAt ? `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}` : ""}
        </p>

        {/* Teams */}
        <div className="mt-3 flex items-center gap-4">
          {team1?.logo && (
            <img src={team1.logo} alt={team1.name} className="w-8 h-8 rounded-full" />
          )}
          <span className="text-gray-700 dark:text-gray-200 font-medium">{team1?.name || "—"}</span>
          <span className="text-gray-500">vs</span>
          {team2?.logo && (
            <img src={team2.logo} alt={team2.name} className="w-8 h-8 rounded-full" />
          )}
          <span className="text-gray-700 dark:text-gray-200 font-medium">{team2?.name || "—"}</span>
        </div>

        {/* Winner and Margin */}
        <p className="mt-2 text-gray-700 dark:text-gray-200">
          <strong>Winner:</strong>{" "}
          {winner?.name ?? "—"}{" "}
          {report.winType && report.winMargin ? `• ${report.winType} by ${report.winMargin}` : ""}
        </p>

        {/* Result Text */}
        <p className="mt-2 text-gray-700 dark:text-gray-200">
          <strong>Result:</strong>{" "}
          {report.resultText ? report.resultText : "No summary text"}
        </p>

        {/* Awards */}
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <p><strong>Player of the Match:</strong> {report.playerOfTheMatch?.name ?? "—"}</p>
          <p><strong>Top Scorer:</strong> {report.topScorer?.playerId?.name ?? "—"}</p>
          <p><strong>Best Bowler:</strong> {report.bestBowler?.playerId?.name ?? "—"}</p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-3 mt-4">
        <Link
          to={`/admin/reports/view/${report._id}`}
          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <Eye className="w-4 h-4" /> View
        </Link>

        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-yellow-600 hover:text-yellow-500"
        >
          <Edit className="w-4 h-4" /> Edit
        </button>

        <button
          onClick={onDelete}
          className="flex items-center gap-1 text-red-600 hover:text-red-500 ml-auto"
        >
          <Trash className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );
}
