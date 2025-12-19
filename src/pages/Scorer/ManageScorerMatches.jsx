import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import MatchCard from "../../components/dashboard/scorer/MatchCard";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const STATUS_FILTERS = [
  "all",
  "live",
  "upcoming",
  "completed",
  "abandoned",
  "postponed",
];

const ITEMS_PER_PAGE = 6;

const ManageScorerMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await api.get("/scorer/matches");
      setMatches(data);
    } catch (err) {
      console.error("Failed to load scorer matches", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- FILTERED MATCHES ---------- */
  const filteredMatches = useMemo(() => {
    if (statusFilter === "all") return matches;
    return matches.filter((m) => m.status === statusFilter);
  }, [matches, statusFilter]);

  /* ---------- PAGINATION ---------- */
  const totalPages = Math.ceil(filteredMatches.length / ITEMS_PER_PAGE);

  const paginatedMatches = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMatches.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMatches, currentPage]);

  /* ---------- RESET PAGE ON FILTER CHANGE ---------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  if (loading) {
    return <div className="p-6">Loading matches...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back link */}
      <Link
        to="/scorer/dashboard"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Back to Dashboard
      </Link>

      {/* Title */}
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
        Manage Matches
      </h1>

      {/* ---------- FILTERS ---------- */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition
              ${
                statusFilter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
          >
            {status.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ---------- MATCH GRID ---------- */}
      {paginatedMatches.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400">
          No matches found for this filter.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paginatedMatches.map((match) => (
            <MatchCard key={match._id} match={match} />
          ))}
        </div>
      )}

      {/* ---------- PAGINATION ---------- */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageScorerMatches;
