import { useState } from "react";
import api from "../../../services/api";

export default function EndMatchModal({
  matchId,
  onClose,
  onMatchEnd,
}) {
  const [action, setAction] = useState("");
  const [statusReason, setStatusReason] = useState("");
  const [loading, setLoading] = useState(false);


  const handleCompleteMatch = async () => {
    setLoading(true);
    try {
      await api.put(`/matches/${matchId}/complete`);
      onMatchEnd("completed");
      onClose();
    } catch (err) {
      console.error("❌ Failed to complete match", err);
      alert("Failed to complete match");
    } finally {
      setLoading(false);
    }
  };

  const handleAbandonMatch = async () => {
    if (!statusReason.trim()) {
      alert("Please provide a reason for abandoning the match");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/matches/${matchId}/abandon`, { statusReason });
      onMatchEnd("abandoned");
      onClose();
    } catch (err) {
      console.error("❌ Failed to abandon match", err);
      alert("Failed to abandon match");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-2">
      <div className="bg-white dark:bg-gray-900 rounded w-full max-w-md p-5 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          End Match
        </h2>

        {/* ACTION SELECTION */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Action
          </label>
          <select
            className="w-full border rounded p-2 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          >
            <option value="">Select Action</option>
            <option value="complete">Complete Match</option>
            <option value="abandon">Abandon Match</option>
          </select>
        </div>

        {/* ABANDON REASON */}
        {action === "abandon" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Reason for Abandonment
            </label>
            <textarea
              className="w-full border rounded p-2 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              placeholder="Enter reason for abandoning the match..."
              rows={3}
            />
          </div>
        )}



        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
            disabled={loading}
          >
            Cancel
          </button>

          {action === "complete" && (
            <button
              onClick={handleCompleteMatch}
              disabled={loading}
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Completing..." : "Complete Match"}
            </button>
          )}

          {action === "abandon" && (
            <button
              onClick={handleAbandonMatch}
              disabled={loading || !statusReason.trim()}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Abandoning..." : "Abandon Match"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
