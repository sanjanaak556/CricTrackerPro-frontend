import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { ArrowLeft, Play, Eye, Flag } from "lucide-react";

export default function ViewMatchDetails() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [teamsWithPlayers, setTeamsWithPlayers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTossModal, setShowTossModal] = useState(false);
  const [tossData, setTossData] = useState({
    tossWinner: "",
    electedTo: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!matchId) return;
    fetchMatchDetails();
  }, [matchId]);

  const fetchMatchDetails = async () => {
    setLoading(true);
    try {
      const [matchRes, playersRes] = await Promise.all([
        api.get(`/matches/${matchId}`),
        api.get(`/matches/${matchId}/players`),
      ]);
      setMatch(matchRes);
      setTeamsWithPlayers(playersRes);
      setError(null);
    } catch (err) {
      console.error("Error loading match details:", err);
      setError("Failed to load match details");
    } finally {
      setLoading(false);
    }
  };

  const handleStartLive = () => {
    setShowTossModal(true);
    setValidationError("");
    setTossData({
      tossWinner: "",
      electedTo: "",
    });
  };

  const handleSubmitToss = async () => {
    // Validate both fields are selected
    if (!tossData.tossWinner) {
      setValidationError("Please select toss winner");
      return;
    }
    if (!tossData.electedTo) {
      setValidationError("Please select elected to (bat or bowl)");
      return;
    }

    setSubmitting(true);
    setValidationError("");
    
    try {
      const updateData = {
        tossWinner: tossData.tossWinner,
        electedTo: tossData.electedTo,
        status: "live",
      };

      // Send update request
      const response = await api.put(`/matches/${matchId}`, updateData);
      
      // Close modal
      setShowTossModal(false);
      setSubmitting(false);
      
      // Show success message
      alert("✅ Toss information saved successfully! Match status updated to LIVE.");
      
      // Refresh all data
      await fetchMatchDetails();
      
      // Reset toss data
      setTossData({
        tossWinner: "",
        electedTo: "",
      });
      
    } catch (err) {
      console.error("Error updating toss:", err);
      console.error("Error details:", err.response?.data);
      alert(`❌ Failed to update toss information: ${err.response?.data?.message || err.message}`);
      setSubmitting(false);
    }
  };

  const handleViewLive = (id) => navigate(`/viewer/live/${id}`);
  
  const handleEndMatch = async (id) => {
    if (!window.confirm("Mark this match as completed?")) return;
    try {
      await api.put(`/matches/${id}/complete`);
      await fetchMatchDetails();
      alert("Match marked as completed!");
    } catch (err) {
      console.error("Error ending match", err);
      alert("Failed to complete match");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (!match) {
    return <div className="p-6 text-center">Match not found.</div>;
  }

  const {
    matchName,
    matchNumber,
    matchType,
    overs,
    teamA,
    teamB,
    venue,
    umpires,
    status,
    currentScore,
    tossWinner,
    electedTo,
    scorerId,
  } = match;

  const teamAData = teamsWithPlayers?.teamA || null;
  const teamBData = teamsWithPlayers?.teamB || null;

  // Helper function to get toss winner name
  const getTossWinnerName = () => {
    if (!tossWinner) return null;
    
    // If tossWinner is an object with name property (populated team)
    if (typeof tossWinner === 'object' && tossWinner.name) {
      return tossWinner.name;
    }
    
    // If tossWinner is just an ID string, try to match with teamA or teamB
    const tossWinnerId = tossWinner.toString ? tossWinner.toString() : tossWinner;
    const teamAId = teamA?._id?.toString();
    const teamBId = teamB?._id?.toString();
    
    if (tossWinnerId === teamAId) {
      return teamA?.name || teamAData?.name || "Team A";
    }
    if (tossWinnerId === teamBId) {
      return teamB?.name || teamBData?.name || "Team B";
    }
    
    return "Unknown Team";
  };

  const tossWinnerName = getTossWinnerName();

  return (
    <div className="space-y-6">
      <Link
        to="/admin/matches"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-300"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Matches
      </Link>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={teamA?.logo || teamAData?.logo || "/default-team.png"}
            alt={teamA?.name || teamAData?.name || "Team A"}
            className="h-12 w-12 rounded object-cover"
          />
          <div>
            <h2 className="text-xl font-bold dark:text-white">{matchName}</h2>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Match #{matchNumber} • {matchType} • {overs} overs
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {teamA?.name || teamAData?.name} vs{" "}
              {teamB?.name || teamBData?.name}
            </div>
          </div>

          <img
            src={teamB?.logo || teamBData?.logo || "/default-team.png"}
            alt={teamB?.name || teamBData?.name || "Team B"}
            className="h-12 w-12 rounded object-cover ml-3"
          />
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              status === "upcoming"
                ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                : status === "live"
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            {status}
          </span>

          {/* Live / End buttons */}
          {status === "upcoming" && (
            <button
              onClick={handleStartLive}
              className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              title="Start live scoring"
            >
              <Play className="w-4 h-4" /> Start Live
            </button>
          )}

          {status === "live" && (
            <>
              <button
                onClick={() => handleViewLive(match._id)}
                className="inline-flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Eye className="w-4 h-4" /> View Live
              </button>

              <button
                onClick={() => handleEndMatch(match._id)}
                className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <Flag className="w-4 h-4" /> End Match
              </button>
            </>
          )}
        </div>
      </div>

      {/* Toss Modal */}
      {showTossModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">
                Set Toss Information
              </h3>
              <button
                type="button"
                onClick={() => setShowTossModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                disabled={submitting}
              >
                ✕
              </button>
            </div>
            
            {validationError && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded text-sm">
                {validationError}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Toss Winner *
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTossData({...tossData, tossWinner: teamA._id});
                      setValidationError("");
                    }}
                    className={`flex-1 px-3 py-2 rounded border ${
                      tossData.tossWinner === teamA._id 
                        ? "bg-blue-600 text-white border-blue-600" 
                        : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                    disabled={submitting}
                  >
                    {teamA.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTossData({...tossData, tossWinner: teamB._id});
                      setValidationError("");
                    }}
                    className={`flex-1 px-3 py-2 rounded border ${
                      tossData.tossWinner === teamB._id 
                        ? "bg-blue-600 text-white border-blue-600" 
                        : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                    disabled={submitting}
                  >
                    {teamB.name}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Elected To *
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTossData({...tossData, electedTo: "bat"});
                      setValidationError("");
                    }}
                    className={`flex-1 px-3 py-2 rounded border ${
                      tossData.electedTo === "bat" 
                        ? "bg-green-600 text-white border-green-600" 
                        : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                    disabled={submitting}
                  >
                    Bat
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTossData({...tossData, electedTo: "bowl"});
                      setValidationError("");
                    }}
                    className={`flex-1 px-3 py-2 rounded border ${
                      tossData.electedTo === "bowl" 
                        ? "bg-green-600 text-white border-green-600" 
                        : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                    disabled={submitting}
                  >
                    Bowl
                  </button>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <button
                  onClick={handleSubmitToss}
                  disabled={submitting}
                  className={`flex-1 px-4 py-2 rounded font-medium ${
                    submitting 
                      ? "bg-green-400 cursor-not-allowed" 
                      : "bg-green-600 hover:bg-green-700"
                  } text-white`}
                >
                  {submitting ? "Submitting..." : "Submit Toss"}
                </button>
                <button
                  onClick={() => setShowTossModal(false)}
                  disabled={submitting}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Match details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Summary */}
        <div className="col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold dark:text-white mb-3">
            Match Info
          </h3>

          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <div>
              <span className="font-medium">Venue:</span> {venue?.name || "—"}
            </div>
            <div>
              <span className="font-medium">City:</span> {venue?.city || "—"}
            </div>
            <div>
              <span className="font-medium">Ground Type:</span>{" "}
              {venue?.groundType || "—"}
            </div>

            <div>
              <span className="font-medium">Scorer:</span>{" "}
              {scorerId ? scorerId.name : "—"}
            </div>

            {tossWinner && tossWinnerName && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded">
                <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Toss Information
                </div>
                <div className="text-sm">
                  <span className="font-medium">Winner:</span> {tossWinnerName}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Decision:</span>{" "}
                  <span className="capitalize font-medium">{electedTo}</span>
                </div>
              </div>
            )}

            {status === "live" && currentScore && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900 rounded">
                <div className="font-medium text-sm text-green-800 dark:text-green-200">
                  Current Score
                </div>
                <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {currentScore.runs}/{currentScore.wickets}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Overs: {currentScore.overs}
                </div>
              </div>
            )}
          </div>

          {/* Umpires */}
          {Array.isArray(umpires) && umpires.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium dark:text-white">Umpires</h4>
              <ul className="mt-2 text-sm text-gray-700 dark:text-gray-300 list-disc ml-5">
                {umpires.map((u, idx) => (
                  <li key={idx}>
                    {u.name} {u.role ? `(${u.role})` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Center: Team A players */}
        <div className="col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={teamA?.logo || teamAData?.logo || "/default-team.png"}
                alt={teamA?.name || teamAData?.name || "Team A"}
                className="h-10 w-10 rounded object-cover"
              />
              <div>
                <div className="font-semibold dark:text-white">
                  {teamA?.name || teamAData?.name || "Team A"}
                  {tossWinner && tossWinnerName && tossWinnerName === (teamA?.name || teamAData?.name) && (
                    <span className="ml-2 text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full">
                      Won Toss
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  {teamAData?.players?.length ?? "0"} players
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-auto">
            {(teamAData?.players || []).map((p) => (
              <div
                key={p._id || p.id || p.name}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.image || "/default-player.png"}
                    alt={p.name}
                    className="h-12 w-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                  />
                  <div>
                    <div className="font-medium dark:text-white">{p.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {p.role || ""}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {p.isCaptain && (
                    <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full">
                      C
                    </span>
                  )}
                </div>
              </div>
            ))}

            {(!teamAData || !teamAData.players || teamAData.players.length === 0) && (
              <div className="text-sm text-gray-500">No players found.</div>
            )}
          </div>
        </div>

        {/* Right: Team B players */}
        <div className="col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={teamB?.logo || teamBData?.logo || "/default-team.png"}
                alt={teamB?.name || teamBData?.name || "Team B"}
                className="h-10 w-10 rounded object-cover"
              />
              <div>
                <div className="font-semibold dark:text-white">
                  {teamB?.name || teamBData?.name || "Team B"}
                  {tossWinner && tossWinnerName && tossWinnerName === (teamB?.name || teamBData?.name) && (
                    <span className="ml-2 text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full">
                      Won Toss
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  {teamBData?.players?.length ?? "0"} players
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-auto">
            {(teamBData?.players || []).map((p) => (
              <div
                key={p._id || p.id || p.name}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.image || "/default-player.png"}
                    alt={p.name}
                    className="h-12 w-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                  />
                  <div>
                    <div className="font-medium dark:text-white">{p.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {p.role || ""}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {p.isCaptain && (
                    <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full">
                      C
                    </span>
                  )}
                </div>
              </div>
            ))}

            {(!teamBData || !teamBData.players || teamBData.players.length === 0) && (
              <div className="text-sm text-gray-500">No players found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}