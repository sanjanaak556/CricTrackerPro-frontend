import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const STATUS_FILTERS = ["all", "live", "upcoming", "completed", "abandoned", "postponed"];

function MatchHistory() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("completed");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await api.get("/scorer/matches");
        setMatches(data);
      } catch (err) {
        console.error("Failed to load matches", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return matches;
    return matches.filter((m) => m.status === statusFilter);
  }, [matches, statusFilter]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <Link to="/scorer/dashboard" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
      </Link>

      <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Match History</h1>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${statusFilter === s ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400">No matches found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((m) => (
            <div key={m._id} className="p-4 rounded-xl bg-white dark:bg-gray-900 shadow">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold dark:text-white">{m.matchName}</div>
                  <div className="text-sm text-gray-500">{m.teamA?.name} vs {m.teamB?.name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate(`/scorer/scoreboard/${m._id}`)} className="px-3 py-1 bg-blue-600 text-white rounded">View Scoreboard</button>
                  <button onClick={() => navigate(`/scorer/match/${m._id}`)} className="px-3 py-1 bg-gray-500 text-white rounded">View Match</button>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-2">{m.status}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MatchHistory;
