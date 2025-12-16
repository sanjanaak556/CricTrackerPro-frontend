import React from "react";
import { Eye, Edit, Trash } from "lucide-react";
import { Link } from "react-router-dom";

export default function ReportCard({ report, onEdit, onDelete }) {
  // try to show readable title
  const title =
    report.match?.matchName ||
    report.resultText ||
    `Match #${report.matchNumber ?? ""}` ||
    "Match Summary";

  const createdAt = report.createdAt ? new Date(report.createdAt) : null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>

        {createdAt && (
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
            {createdAt.toLocaleDateString()} {createdAt.toLocaleTimeString()}
          </p>
        )}

        <p className="mt-3 text-gray-700 dark:text-gray-200">
          <strong>Result:</strong>{" "}
          {report.resultText ? report.resultText : "No summary text"}
        </p>

        <p className="mt-2 text-gray-700 dark:text-gray-200">
          <strong>Winner:</strong>{" "}
          {report.winnerTeamId?.name ?? report.winnerName ?? "—"}{" "}
          {report.winType && report.winMargin ? `• ${report.winType} by ${report.winMargin}` : ""}
        </p>
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
