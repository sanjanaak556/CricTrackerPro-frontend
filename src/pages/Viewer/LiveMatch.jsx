import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { RefreshCw } from "lucide-react";

/* -------------------- helpers -------------------- */
const ballBadge = (ball) => {
  if (ball.isWicket) return "W";
  if (ball.extraType && ball.extraType !== "none") return "E";
  return ball.runs;
};

const ballStyle = (ball) => {
  if (ball.isWicket) return "bg-red-500 text-white";
  if (ball.runs === 6) return "bg-purple-500 text-white";
  if (ball.runs === 4) return "bg-blue-500 text-white";
  if (ball.extraType && ball.extraType !== "none")
    return "bg-orange-400 text-white";
  return "bg-gray-200 dark:bg-gray-700";
};

const commentaryColor = {
  FOUR: "text-blue-500 font-semibold",
  SIX: "text-purple-500 font-semibold",
  WICKET: "text-red-500 font-semibold",
  EXTRA: "text-orange-500",
  INFO: "text-gray-500 italic",
  NORMAL: "",
};

const StatCard = ({ title, children }) => (
  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 w-full">
    <p className="text-xs text-gray-500 mb-1">{title}</p>
    {children}
  </div>
);

/* -------------------- component -------------------- */
const LiveMatch = () => {
  const { matchId } = useParams();

  const [match, setMatch] = useState(null);
  const [activeInnings, setActiveInnings] = useState(null);
  const [activeOver, setActiveOver] = useState(null);
  const [overs, setOvers] = useState([]);
  const [openOverId, setOpenOverId] = useState(null);
  const [commentary, setCommentary] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -------------------- fetch -------------------- */
  const fetchLiveData = async () => {
    try {
      const matchRes = await api.get(`/matches/${matchId}`);
      setMatch(matchRes);

      const inningsRes = await api.get(`/innings/match/${matchId}`);
      const inningsList = Array.isArray(inningsRes) ? inningsRes : [];
      const current = inningsList.find((i) => i.isActive);
      setActiveInnings(current || null);

      if (current?._id) {
        const overRes = await api.get(`/overs/active/${current._id}`);
        setActiveOver(overRes || null);

        const oversRes = await api.get(`/overs/innings/${current._id}`);
        setOvers(oversRes || []);

        const commRes = await api.get(`/commentary/innings/${current._id}`);
        setCommentary(commRes.commentary || []);
      }

      setLoading(false);
    } catch (err) {
      console.error("Live fetch error:", err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 6000);
    return () => clearInterval(interval);
  }, [matchId]);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">Loading live match…</div>
    );

  if (!match)
    return (
      <div className="p-6 text-center text-red-500">Match not found</div>
    );

  /* -------------------- derived -------------------- */
  const crr = match.currentScore?.overs
    ? (match.currentScore.runs / match.currentScore.overs).toFixed(2)
    : "0.00";

  const rrr = match.target && match.remainingOvers
    ? ((match.target - match.currentScore.runs) / match.remainingOvers).toFixed(2)
    : null;

  /* -------------------- UI -------------------- */
  return (
    <div className="p-4 md:p-6 space-y-6 dark:text-white">

      {/* ================= MATCH HEADER ================= */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border dark:border-gray-700 shadow">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={match.teamA?.logo} alt="A" className="w-10 h-10" />
            <h2 className="text-xl font-bold">{match.teamA?.name}</h2>
          </div>

          <span className="relative px-3 py-1 text-xs font-bold text-red-600 border border-red-500 rounded-full bg-red-500/20">
            <span className="absolute left-2 h-2 w-2 bg-red-600 rounded-full animate-ping"></span>
            <span className="absolute left-2 h-2 w-2 bg-red-600 rounded-full"></span>
            <span className="ml-4">LIVE</span>
          </span>

          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">{match.teamB?.name}</h2>
            <img src={match.teamB?.logo} alt="B" className="w-10 h-10" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <p><b>Match:</b> {match.matchName}</p>
          <p><b>Type:</b> {match.matchType}</p>
          <p><b>Overs:</b> {match.overs}</p>
          <p><b>Venue:</b> {match.venue?.name}</p>
          <p><b>Toss:</b> {match.tossWinner?.name} ({match.tossDecision})</p>
          <p><b>Umpires:</b> {match.umpires?.join(", ")}</p>
          <p><b>Scorer:</b> {match.scorer?.name}</p>
          <p><b>Date:</b> {new Date(match.startTime).toLocaleString()}</p>
        </div>

        {/* SCORE */}
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-2xl font-semibold">
              {match.currentScore?.runs}/{match.currentScore?.wickets}
            </p>
            <p className="text-sm text-gray-500">
              Overs: {match.currentScore?.overs} / {match.overs}
            </p>
            <p className="text-sm text-gray-500">CRR: {crr}</p>
            {rrr && <p className="text-sm text-gray-500">RRR: {rrr}</p>}
          </div>

          <button
            onClick={fetchLiveData}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* ================= PLAYERS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[match.teamA, match.teamB].map((team) => (
          <div key={team._id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-700">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <img src={team.logo} alt="" className="w-6 h-6" /> {team.name}
            </h3>
            <div className="space-y-2">
              {team.players?.map((p) => (
                <div key={p._id} className="flex items-center gap-3 text-sm">
                  <img src={p.image} className="w-8 h-8 rounded-full" />
                  <span className="w-6 text-gray-400">#{p.jersey}</span>
                  <span className="flex-1">{p.name}</span>
                  {p.isCaptain && (
                    <span className="px-2 text-xs bg-yellow-500 text-black rounded">C</span>
                  )}
                  <span className="text-xs text-gray-500">{p.role}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ================= BATTER & BOWLER ================= */}
      {activeInnings && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Striker 🏏">
            {activeInnings.striker ? (
              <>
                <p className="font-semibold text-green-600">
                  {activeInnings.striker.name} *
                </p>
                <p className="text-sm text-gray-500">
                  Runs: {activeInnings.strikerRuns ?? 0} ({activeInnings.strikerBalls ?? 0})
                </p>
              </>
            ) : <p className="text-sm text-gray-400">Not decided</p>}
          </StatCard>

          <StatCard title="Non-Striker">
            {activeInnings.nonStriker ? (
              <>
                <p className="font-semibold">{activeInnings.nonStriker.name}</p>
                <p className="text-sm text-gray-500">
                  Runs: {activeInnings.nonStrikerRuns ?? 0} ({activeInnings.nonStrikerBalls ?? 0})
                </p>
              </>
            ) : <p className="text-sm text-gray-400">Not decided</p>}
          </StatCard>

          <StatCard title="Current Bowler 🎯">
            {activeInnings.currentBowler ? (
              <>
                <p className="font-semibold text-purple-500">{activeInnings.currentBowler.name}</p>
                <p className="text-sm text-gray-500">
                  Overs: {activeInnings.bowlerOvers ?? "0.0"} | Runs: {activeInnings.bowlerRuns ?? 0} | Wkts: {activeInnings.bowlerWickets ?? 0}
                </p>
              </>
            ) : <p className="text-sm text-gray-400">Not decided</p>}
          </StatCard>
        </div>
      )}

      {/* ================= ACTIVE OVER ================= */}
      {activeOver && (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-700">
          <h3 className="font-semibold mb-2">Over {activeOver.overNumber} — {activeOver.bowler?.name}</h3>
          <div className="flex gap-2 flex-wrap">
            {activeOver.balls?.map((ball) => (
              <span key={ball._id} className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold ${ballStyle(ball)}`}>
                {ballBadge(ball)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ================= OVER BY OVER ================= */}
      {overs.length > 0 && (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-700">
          <h3 className="font-semibold mb-3">Over by Over</h3>
          <div className="space-y-2">
            {[...overs].reverse().map((over) => (
              <div key={over._id} className="border rounded-lg dark:border-gray-700">
                <button
                  onClick={() => setOpenOverId(openOverId === over._id ? null : over._id)}
                  className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span className="font-medium">Over {over.overNumber}</span>
                  <span className="text-sm text-gray-500">{over.balls?.length || 0} balls</span>
                </button>
                {openOverId === over._id && (
                  <div className="px-4 pb-3 flex gap-2 flex-wrap">
                    {over.balls?.map((ball) => (
                      <span key={ball._id} className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold ${ballStyle(ball)}`}>
                        {ballBadge(ball)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= COMMENTARY ================= */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-700">
        <h3 className="font-semibold mb-3">Live Commentary</h3>
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {commentary.length === 0 && <p className="text-sm text-gray-500">No commentary yet</p>}
          {commentary.map((c) => (
            <div key={c._id} className={`text-sm ${commentaryColor[c.type]}`}>
              <span className="text-xs text-gray-400 mr-2">{new Date(c.createdAt).toLocaleTimeString()}</span>
              {c.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveMatch;
