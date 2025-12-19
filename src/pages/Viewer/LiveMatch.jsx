import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { RefreshCw, Swords, User, Target, ArrowLeft } from "lucide-react";
import MatchEventAnimation from "../../components/dashboard/viewer/MatchEventAnimation";

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
  const [players, setPlayers] = useState(null);

  // ✨ NEW: match event animation state
  const [matchEvent, setMatchEvent] = useState(null);
  const [lastBallId, setLastBallId] = useState(null); // 🔧 FIX: prevent repeat animation

  /* -------------------- fetch -------------------- */
  const fetchLiveData = async () => {
    try {
      const matchRes = await api.get(`/matches/${matchId}`);
      setMatch(matchRes);

      const playersRes = await api.get(`/matches/${matchId}/players`);
      setPlayers(playersRes);

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

  /*  MATCH EVENT DETECTION (4 / 6 / WICKET) */
  useEffect(() => {
    if (!activeOver?.balls?.length) return;

    const lastBall = activeOver.balls[activeOver.balls.length - 1];

    // 🔧 FIX: avoid animation on polling refresh
    if (lastBall._id === lastBallId) return;

    setLastBallId(lastBall._id);

    if (lastBall.isWicket) setMatchEvent("WICKET");
    else if (lastBall.runs === 6) setMatchEvent("SIX");
    else if (lastBall.runs === 4) setMatchEvent("FOUR");

    if (lastBall.isWicket || lastBall.runs === 4 || lastBall.runs === 6) {
      setTimeout(() => setMatchEvent(null), 1800);
    }
  }, [activeOver]); // 👈 correct dependency

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">Loading live match…</div>
    );

  if (!match)
    return <div className="p-6 text-center text-red-500">Match not found</div>;

  /* -------------------- derived -------------------- */
  const oversBowled = Number(match.currentScore?.overs || 0);

  const crr =
    oversBowled > 0
      ? (match.currentScore.runs / oversBowled).toFixed(2)
      : "0.00";

  const totalOvers = match.overs || 0;
  const remainingOvers = totalOvers - oversBowled;

  const rrr =
    match.target && remainingOvers > 0
      ? ((match.target - match.currentScore.runs) / remainingOvers).toFixed(2)
      : null;

  /* -------------------- UI -------------------- */
  return (
    <div className="relative p-4 md:p-6 space-y-6 dark:text-white">
      {/* Back */}
      <Link
        to="/viewer/all-matches"
        className="inline-flex items-center text-blue-600 hover:text-blue-400"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Matches
      </Link>
      {/*  NEW: MATCH EVENT ANIMATION OVERLAY */}
      {matchEvent && <MatchEventAnimation type={matchEvent} />}

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
          <p>
            <b>Match:</b> {match.matchName}
          </p>
          <p>
            <b>Type:</b> {match.matchType}
          </p>
          <p>
            <b>Overs:</b> {match.overs}
          </p>
          <p>
            <b>Venue:</b> {match.venue?.name}
          </p>
          <p>
            <b>Toss:</b> {match.tossWinner?.name} ({match.tossDecision})
          </p>
          <p>
            <b>Umpires:</b>{" "}
            {Array.isArray(match.umpires)
              ? match.umpires.map((u) => u.name).join(", ")
              : "—"}
          </p>
          <p>
            <b>Scorer:</b> {match.scorerId?.name || "—"}
          </p>
          <p>
            <b>Date:</b>{" "}
            {match.scheduledAt
              ? new Date(match.scheduledAt).toLocaleString()
              : "—"}
          </p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {players &&
          [players.teamA, players.teamB].map((team, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow border dark:border-gray-700"
            >
              {/* Team Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {index === 0 ? match.teamA.name : match.teamB.name}
                </h3>
                <span className="text-xs text-gray-500">
                  {team.players.length} Players
                </span>
              </div>

              {/* Players */}
              <div className="space-y-3">
                {team.players.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        {p.name}
                        {p.isCaptain && (
                          <span className="text-[10px] px-2 py-[1px] rounded bg-yellow-500 text-black font-semibold">
                            C
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{p.role}</p>
                    </div>

                    {/* Icon */}
                    <span className="text-gray-400">
                      {p.role === "Batter" && "🏏"}
                      {p.role === "Bowler" && "🎯"}
                      {p.role === "All-Rounder" && "⚡"}
                      {p.role === "Wicket-Keeper" && "🧤"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* ================= BATTER & BOWLER ================= */}
      {activeInnings && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* STRIKER */}
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500 text-white">
                <Swords size={18} />
              </div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Striker
              </p>
            </div>

            {activeInnings.striker ? (
              <>
                <p className="text-lg font-bold text-green-600">
                  {activeInnings.striker.name} *
                </p>
                <p className="text-sm text-gray-500">
                  {activeInnings.strikerRuns ?? 0} runs •{" "}
                  {activeInnings.strikerBalls ?? 0} balls
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-400">Not decided</p>
            )}
          </div>

          {/* NON STRIKER */}
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500 text-white">
                <User size={18} />
              </div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Non-Striker
              </p>
            </div>

            {activeInnings.nonStriker ? (
              <>
                <p className="text-lg font-bold">
                  {activeInnings.nonStriker.name}
                </p>
                <p className="text-sm text-gray-500">
                  {activeInnings.nonStrikerRuns ?? 0} runs •{" "}
                  {activeInnings.nonStrikerBalls ?? 0} balls
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-400">Not decided</p>
            )}
          </div>

          {/* CURRENT BOWLER */}
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500 text-white">
                <Target size={18} />
              </div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Current Bowler
              </p>
            </div>

            {activeInnings.currentBowler ? (
              <>
                <p className="text-lg font-bold text-purple-500">
                  {activeInnings.currentBowler.name}
                </p>
                <p className="text-sm text-gray-500">
                  Overs: {activeInnings.bowlerOvers ?? "0.0"} • Runs:{" "}
                  {activeInnings.bowlerRuns ?? 0} • Wkts:{" "}
                  {activeInnings.bowlerWickets ?? 0}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-400">Not decided</p>
            )}
          </div>
        </div>
      )}

      {/* ================= ACTIVE OVER ================= */}
      {activeOver && (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-700">
          <h3 className="font-semibold mb-2">
            Over {activeOver.overNumber} — {activeOver.bowler?.name}
          </h3>
          <div className="flex gap-2 flex-wrap">
            {activeOver.balls?.map((ball) => (
              <span
                key={ball._id}
                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold ${ballStyle(
                  ball
                )}`}
              >
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
              <div
                key={over._id}
                className="border rounded-lg dark:border-gray-700"
              >
                <button
                  onClick={() =>
                    setOpenOverId(openOverId === over._id ? null : over._id)
                  }
                  className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span className="font-medium">Over {over.overNumber}</span>
                  <span className="text-sm text-gray-500">
                    {over.balls?.length || 0} balls
                  </span>
                </button>
                {openOverId === over._id && (
                  <div className="px-4 pb-3 flex gap-2 flex-wrap">
                    {over.balls?.map((ball) => (
                      <span
                        key={ball._id}
                        className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold ${ballStyle(
                          ball
                        )}`}
                      >
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
          {commentary.length === 0 && (
            <p className="text-sm text-gray-500">No commentary yet</p>
          )}
          {commentary.map((c) => (
            <div key={c._id} className={`text-sm ${commentaryColor[c.type]}`}>
              <span className="text-xs text-gray-400 mr-2">
                {new Date(c.createdAt).toLocaleTimeString()}
              </span>
              {c.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveMatch;
