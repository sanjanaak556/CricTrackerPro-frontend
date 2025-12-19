import { useState, useEffect } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function Highlights() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await api.get("/viewer/highlights");
        setMatches(res || []);
      } catch (error) {
        console.error("Error fetching highlights", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Back */}
      <Link
        to="/viewer/dashboard"
        className="inline-flex items-center text-blue-600 hover:text-blue-400"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold">Match Highlights</h1>
      <p className="text-gray-600 mb-6">
        Recent completed matches and results.
      </p>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin w-10 h-10" />
        </div>
      ) : matches.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No completed matches available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((m) => (
            <div
              key={m._id}
              className="rounded-xl bg-white dark:bg-gray-900 p-4 border shadow hover:shadow-lg transition"
            >
              {/* Date */}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(m.createdAt).toLocaleDateString()}
              </p>

              {/* Teams */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <img src={m.teamA.logo} className="w-10 h-10 rounded-full" />
                  <p className="font-semibold dark:text-white">
                    {m.teamA.name}
                  </p>
                </div>

                <p className="font-bold text-gray-400">VS</p>

                <div className="flex items-center gap-3">
                  <img src={m.teamB.logo} className="w-10 h-10 rounded-full" />
                  <p className="font-semibold dark:text-white">
                    {m.teamB.name}
                  </p>
                </div>
              </div>

              {/* Full Result */}
              <p className="mt-3 text-blue-600 dark:text-blue-400 font-medium">
                {m.result}
              </p>

              {/* Winner and Margin */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Winner: <span className="font-semibold">{m.winner}</span>
              </p>

              {m.winMargin && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Margin: {m.winMargin}
                </p>
              )}

              {/* Summary Button (only if not abandoned) */}
              {m.status !== "abandoned" && (
                <button
                  className="mt-4 w-full py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() =>
                    (window.location.href = `/match-summary/${m._id}`)
                  }
                >
                  View Summary
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
