import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { ArrowLeft } from "lucide-react";

export default function MatchPreview() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [teamsWithPlayers, setTeamsWithPlayers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!matchId) return;

    Promise.all([
      api.get(`/matches/${matchId}`),
      api.get(`/matches/${matchId}/players`),
    ])
      .then(([matchRes, playersRes]) => {
        setMatch(matchRes);
        setTeamsWithPlayers(playersRes);
      })
      .catch((err) => {
        console.error("Failed to load match preview", err);
        setError("Failed to load match details");
      })
      .finally(() => setLoading(false));
  }, [matchId]);

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
    return <div className="p-6 text-center">Match not found</div>;
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
    tossWinner,
    electedTo,
    scheduledAt,
  } = match;

  const teamAData = teamsWithPlayers?.teamA || null;
  const teamBData = teamsWithPlayers?.teamB || null;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        to="/viewer/all-matches"
        className="inline-flex items-center text-blue-600 hover:text-blue-400"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Matches
      </Link>

      {/* Postponed Notice */}
      {match.status === "postponed" && (
        <div className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 p-4 rounded-xl shadow">
          <h3 className="font-bold text-lg">⚠ Match Postponed</h3>
          <p className="mt-1">
            {match.statusReason || "Reason not announced yet."}
          </p>
          <p className="text-sm mt-1 opacity-80">
            New schedule will be announced soon.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow flex flex-col md:flex-row md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <img src={teamA.logo} className="h-12 w-12 rounded" />
          <div>
            <h2 className="text-xl font-bold dark:text-white">{matchName}</h2>
            <p className="text-sm text-gray-500">
              Match #{matchNumber} • {matchType} • {overs} overs
            </p>
            <p className="text-sm text-gray-500">
              {teamA.name} vs {teamB.name}
            </p>
            {scheduledAt && (
              <p className="text-sm text-gray-500 mt-1">
                🕒 {new Date(scheduledAt).toLocaleString()}
              </p>
            )}
          </div>
          <img src={teamB.logo} className="h-12 w-12 rounded ml-2" />
        </div>

        {/* Status */}
        <div className="flex items-center">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
              status === "upcoming"
                ? "bg-blue-600 text-white"
                : status === "postponed"
                ? "bg-orange-500 text-white"
                : "bg-gray-500 text-white"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Match Info */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold dark:text-white mb-3">
            Match Info
          </h3>

          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <div>
              <strong>Venue:</strong> {venue?.name || "—"}
            </div>
            <div>
              <strong>City:</strong> {venue?.city || "—"}
            </div>

            {tossWinner && (
              <div>
                <strong>Toss:</strong> {tossWinner.name} elected to {electedTo}
              </div>
            )}
          </div>

          {/* Umpires */}
          {umpires?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium dark:text-white">Umpires</h4>
              <ul className="list-disc ml-5 text-sm">
                {umpires.map((u, i) => (
                  <li key={i}>{u.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Team A Players */}
        <TeamPlayersCard team={teamAData} />

        {/* Team B Players */}
        <TeamPlayersCard team={teamBData} />
      </div>
    </div>
  );
}

/* ------------------ Team Players Card ------------------ */

function TeamPlayersCard({ team }) {
  if (!team) return null;

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
      <div className="flex items-center gap-3 mb-4">
        <img src={team.logo} className="h-10 w-10 rounded" />
        <div>
          <div className="font-semibold dark:text-white">{team.name}</div>
          <div className="text-sm text-gray-500">
            {team.players?.length || 0} players
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-auto">
        {team.players?.map((p) => (
          <div
            key={p._id}
            className="flex items-center justify-between py-2 border-b"
          >
            <div className="flex items-center gap-3">
              <img
                src={p.image || "/default-player.png"}
                className="h-10 w-10 rounded-full"
              />
              <div>
                <div className="font-medium dark:text-white">{p.name}</div>
                <div className="text-sm text-gray-500">{p.role}</div>
              </div>
            </div>

            {p.isCaptain && (
              <span className="text-xs bg-yellow-400 text-black px-2 rounded">
                C
              </span>
            )}
          </div>
        ))}

        {team.players?.length === 0 && (
          <div className="text-sm text-gray-500">No players found</div>
        )}
      </div>
    </div>
  );
}
