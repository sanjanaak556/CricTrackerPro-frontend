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

  useEffect(() => {
    if (!matchId) return;
    setLoading(true);
    Promise.all([
      api.get(`/matches/${matchId}`),
      api.get(`/matches/${matchId}/players`),
    ])
      .then(([matchRes, playersRes]) => {
        setMatch(matchRes);
        setTeamsWithPlayers(playersRes);
      })
      .catch((err) => {
        console.error("Error loading match details:", err);
        setError("Failed to load match details");
      })
      .finally(() => setLoading(false));
  }, [matchId]);

  const handleViewLive = (id) => navigate(`/viewer/live/${id}`);
  const handleEndMatch = async (id) => {
    if (!window.confirm("Mark this match as completed?")) return;
    try {
      await api.put(`/matches/${id}/complete`);
      // refresh
      const updated = await api.get(`/matches/${matchId}`);
      setMatch(updated);
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
              onClick={() => handleViewLive(match._id)}
              className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              title="Open live view"
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

            {tossWinner && (
              <div>
                <span className="font-medium">Toss Winner:</span>{" "}
                {tossWinner.name} ({electedTo})
              </div>
            )}

            {currentScore && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded">
                <div className="font-medium text-sm">Current Score</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {currentScore.runs}/{currentScore.wickets} (
                  {currentScore.overs})
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
                {/* LEFT SIDE → IMAGE + NAME + ROLE */}
                <div className="flex items-center gap-3">
                  {/* PLAYER IMAGE */}
                  <img
                    src={p.image || "/default-player.png"}
                    alt={p.name}
                    className="h-12 w-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                  />

                  {/* NAME + ROLE */}
                  <div>
                    <div className="font-medium dark:text-white">{p.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {p.role || ""}
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE → BADGES */}
                <div className="flex items-center gap-2">
                  {p.isCaptain && (
                    <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full">
                      C
                    </span>
                  )}
                </div>
              </div>
            ))}

            {(!teamAData ||
              !teamAData.players ||
              teamAData.players.length === 0) && (
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
                {/* LEFT SIDE → IMAGE + NAME + ROLE */}
                <div className="flex items-center gap-3">
                  {/* PLAYER IMAGE */}
                  <img
                    src={p.image || "/default-player.png"}
                    alt={p.name}
                    className="h-12 w-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                  />

                  {/* NAME + ROLE */}
                  <div>
                    <div className="font-medium dark:text-white">{p.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {p.role || ""}
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE → BADGES */}
                <div className="flex items-center gap-2">
                  {p.isCaptain && (
                    <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full">
                      C
                    </span>
                  )}
                </div>
              </div>
            ))}

            {(!teamBData ||
              !teamBData.players ||
              teamBData.players.length === 0) && (
              <div className="text-sm text-gray-500">No players found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
