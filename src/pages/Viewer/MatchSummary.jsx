import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { ArrowLeft, Download } from "lucide-react";

export default function MatchSummary() {
  const { matchId } = useParams();

  const [match, setMatch] = useState(null);
  const [teamsWithPlayers, setTeamsWithPlayers] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!matchId) return;

    Promise.all([
      api.get(`/matches/${matchId}`),
      api.get(`/matches/${matchId}/players`),
      api.get(`/match-summary/${matchId}`),
    ])
      .then(([matchRes, playersRes, summaryRes]) => {
        setMatch(matchRes);
        setTeamsWithPlayers(playersRes);
        setSummary(summaryRes);
      })
      .catch((err) => {
        console.error("Failed to load match summary", err);
        setError("Failed to load match summary");
      })
      .finally(() => setLoading(false));
  }, [matchId]);

  const handleDownloadPDF = () => {
    const token = localStorage.getItem("token");

    const backendURL = "http://localhost:5000";

    window.open(
      `${backendURL}/api/match-summary/${matchId}/pdf?token=${token}`,
      "_blank"
    );
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

  const teamAData = teamsWithPlayers?.teamA;
  const teamBData = teamsWithPlayers?.teamB;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        to="/viewer/all-matches"
        className="inline-flex items-center text-blue-600 hover:text-blue-400"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Matches
      </Link>

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

        <div className="flex flex-col items-end gap-3">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-600 text-white">
            {status}
          </span>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      {/* Result Banner */}
      {summary?.resultText && (
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-xl text-center font-semibold">
          {summary.resultText}
        </div>
      )}

      {match.status === "abandoned" && (
        <div className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 p-4 rounded-xl shadow">
          <h3 className="font-bold text-lg">🚫 Match Abandoned - No Result</h3>
          <p className="mt-1">
            {match.statusReason ||
              "Match abandoned due to unavoidable circumstances."}
          </p>
          {match.abandonedAt && (
            <p className="text-sm mt-1 opacity-80">
              Abandoned at: {new Date(match.abandonedAt).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Match Info */}
        <MatchInfo
          venue={venue}
          tossWinner={tossWinner}
          electedTo={electedTo}
          umpires={umpires}
        />

        <TeamPlayersCard team={teamAData} />
        <TeamPlayersCard team={teamBData} />
      </div>

      {/* Innings Details */}
      {summary?.inningsDetails?.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold dark:text-white">
            Innings Summary
          </h3>

          {summary.inningsDetails.map((inn, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow"
            >
              <h4 className="font-semibold dark:text-white mb-2">
                {inn.teamId?.name || "Team"} Innings
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {inn.runs}/{inn.wickets} ({inn.overs})
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summary?.playerOfTheMatch && (
          <HighlightCard
            title="Player of the Match"
            value={summary.playerOfTheMatch.name}
          />
        )}

        {summary?.topScorer && (
          <HighlightCard
            title="Top Scorer"
            value={`${summary.topScorer.playerId?.name} – ${summary.topScorer.runs} runs`}
          />
        )}

        {summary?.bestBowler && (
          <HighlightCard
            title="Best Bowler"
            value={`${summary.bestBowler.playerId?.name} – ${summary.bestBowler.wickets}/${summary.bestBowler.runsConceded}`}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------ Components ------------------ */

function MatchInfo({ venue, tossWinner, electedTo, umpires }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold dark:text-white mb-3">Match Info</h3>

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
  );
}

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
      </div>
    </div>
  );
}

function HighlightCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow text-center">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="font-semibold dark:text-white mt-1">{value}</div>
    </div>
  );
}
