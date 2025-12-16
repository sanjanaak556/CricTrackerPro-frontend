import React, { useEffect, useState } from "react";
import MatchFilters from "../../components/dashboard/viewer/MatchFilters";
import MatchCard from "../../components/dashboard/viewer/MatchCard";
import api from "../../services/api";

const AllMatches = () => {
  const [matches, setMatches] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const fetchMatches = async (filter) => {
    try {
      setLoading(true);
      console.log("📥 Fetching matches, filter:", filter);
      const res = await api.get(
        `/matches${filter !== "ALL" ? `?status=${filter}` : ""}`
      );
      console.log("✅ Matches API response:", res);
      setMatches(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to fetch matches", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches(activeFilter);
  }, [activeFilter]);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-bold dark:text-white mb-4">All Matches</h1>

      <MatchFilters activeFilter={activeFilter} onChange={setActiveFilter} />

      {loading && <p className="mt-4 dark:text-white">Loading matches...</p>}

      {!loading && matches.length === 0 && (
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          No matches found.
        </p>
      )}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(matches) &&
          matches.map((match) => <MatchCard key={match._id} match={match} />)}
      </div>
    </div>
  );
};

export default AllMatches;
