import React, { useState, useEffect } from "react";
import api from "../../../services/api";

export default function AutoGenerateSummary({ onClose, onCreated }) {
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchCompletedMatches();
  }, []);

  const fetchCompletedMatches = async () => {
    try {
      setLoading(true);
      const res = await api.get("/matches?status=completed");
      const data = res?.data ?? res;
      setMatches(Array.isArray(data) ? data : data.matches ?? []);
    } catch (err) {
      console.error("Failed to fetch matches:", err);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedMatchId) return;

    try {
      setGenerating(true);
      await api.post(`/match-summary/auto-generate/${selectedMatchId}`);
      onCreated?.();
    } catch (err) {
      console.error("Auto generate error:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Auto Generate Match Summary
        </h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-medium dark:text-gray-300">
                Select Completed Match
              </label>

              <select
                value={selectedMatchId}
                onChange={(e) => setSelectedMatchId(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white outline-none"
                required
              >
                <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="">Choose a match...</option>
                {matches.map((match) => (
                  <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" key={match._id} value={match._id}>
                    {match.matchName} - {match.teamA?.name} vs {match.teamB?.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={generating}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                {generating ? "Generating..." : "Generate"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
