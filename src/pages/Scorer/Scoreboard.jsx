import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { ArrowLeft } from "lucide-react";

function Scoreboard() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [match, setMatch] = useState(null);
  const [teamsWithPlayers, setTeamsWithPlayers] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // load list when no matchId
    const fetchMatches = async () => {
      try {
        const data = await api.get("/scorer/matches");
        setMatches(data);
      } catch (err) {
        console.error("Failed to load matches", err);
      } finally {
        setLoadingList(false);
      }
    };

    if (!matchId) fetchMatches();
  }, [matchId]);

  useEffect(() => {
    if (!matchId) return;

    setLoadingDetail(true);
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
        console.error("Failed to load scoreboard", err);
        setError("Failed to load scoreboard");
      })
      .finally(() => setLoadingDetail(false));
  }, [matchId]);

  if (matchId) {
    if (loadingDetail) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full" />
        </div>
      );
    }

    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!match) return <div className="p-6">Match not found</div>;

    const teamAData = teamsWithPlayers?.teamA;
    const teamBData = teamsWithPlayers?.teamB;

    return (
      <div className="p-6 space-y-6">
        <Link
          to="/scorer/scoreboard"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Back to Scoreboard
        </Link>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow flex flex-col md:flex-row md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src={teamAData?.logo} className="h-12 w-12 rounded" />
            <div>
              <h2 className="text-xl font-bold dark:text-white">{match.matchName}</h2>
              <p className="text-sm text-gray-500">
                Match #{match.matchNumber} • {match.matchType} • {match.overs} overs
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {match.teamA?.name} vs {match.teamB?.name}
              </p>
            </div>
            <img src={teamBData?.logo} className="h-12 w-12 rounded ml-2" />
          </div>

          <div className="flex flex-col items-end gap-3">
            <button
              onClick={() => navigate(`/scorer/score/${matchId}`)}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Open Live Score
            </button>
          </div>
        </div>

        {/* Innings */}
        {summary?.inningsDetails?.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-white">Innings Summary</h3>

            {summary.inningsDetails.map((inn, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow">
                <h4 className="font-semibold dark:text-white mb-2">{inn.teamId?.name || "Team"} Innings</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{inn.runs}/{inn.wickets} ({inn.overs})</p>

                {/* Batting table */}
                {inn.batterStats?.length > 0 && (
                  <div className="mt-4 overflow-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500">
                          <th>Player</th>
                          <th>R</th>
                          <th>B</th>
                          <th>4s</th>
                          <th>6s</th>
                          <th>SR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inn.batterStats.map((b) => (
                          <tr key={b.playerId} className="border-t">
                            <td className="py-2">{b.name}</td>
                            <td>{b.runs}</td>
                            <td>{b.balls}</td>
                            <td>{b.fours}</td>
                            <td>{b.sixes}</td>
                            <td>{b.strikeRate?.toFixed ? b.strikeRate.toFixed(1) : b.strikeRate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Bowling table */}
                {inn.bowlerStats?.length > 0 && (
                  <div className="mt-4 overflow-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500">
                          <th>Bowler</th>
                          <th>O</th>
                          <th>M</th>
                          <th>R</th>
                          <th>W</th>
                          <th>Econ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inn.bowlerStats.map((b) => (
                          <tr key={b.playerId} className="border-t">
                            <td className="py-2">{b.name}</td>
                            <td>{b.overs}</td>
                            <td>{b.maidens}</td>
                            <td>{b.runs}</td>
                            <td>{b.wickets}</td>
                            <td>{b.economy?.toFixed ? b.economy.toFixed(2) : b.economy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Fall of wickets */}
                {inn.fallOfWickets?.length > 0 && (
                  <div className="mt-4 text-sm text-gray-500">
                    <strong>Fall of wickets:</strong> {inn.fallOfWickets.map(f => `${f.scoreAtFall} (${f.overAtFall})`).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {summary?.playerOfTheMatch && (
            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow text-center">
              <div className="text-sm text-gray-500">Player of the Match</div>
              <div className="font-semibold dark:text-white mt-1">{summary.playerOfTheMatch.name || summary.playerOfTheMatch}</div>
            </div>
          )}

          {summary?.topScorer && (
            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow text-center">
              <div className="text-sm text-gray-500">Top Scorer</div>
              <div className="font-semibold dark:text-white mt-1">{summary.topScorer?.playerId?.name} — {summary.topScorer?.runs} runs</div>
            </div>
          )}

          {summary?.bestBowler && (
            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow text-center">
              <div className="text-sm text-gray-500">Best Bowler</div>
              <div className="font-semibold dark:text-white mt-1">{summary.bestBowler?.playerId?.name} — {summary.bestBowler?.wickets}/{summary.bestBowler?.runsConceded}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // LIST VIEW
  if (loadingList) {
    return (
      <div className="p-6">Loading matches...</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Scoreboard</h1>

      {matches.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400">No matches available.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {matches.map((m) => (
            <div key={m._id} className="p-4 rounded-xl bg-white dark:bg-gray-900 shadow">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold dark:text-white">{m.matchName}</div>
                  <div className="text-sm text-gray-500">{m.teamA?.name} vs {m.teamB?.name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate(`/scorer/scoreboard/${m._id}`)} className="px-3 py-1 bg-blue-600 text-white rounded">View Scoreboard</button>
                  <button onClick={() => navigate(`/scorer/score/${m._id}`)} className="px-3 py-1 bg-green-600 text-white rounded">Open Live</button>
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

export default Scoreboard;
