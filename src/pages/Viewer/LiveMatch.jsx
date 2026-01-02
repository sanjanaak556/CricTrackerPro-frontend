import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { socket, getConnectionStatus, addConnectionListener } from "../../utils/socket";
import { RefreshCw, Swords, User, Target, ArrowLeft, Zap } from "lucide-react";
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
  const [recentBalls, setRecentBalls] = useState([]); // Store last 10 balls
  const [commentary, setCommentary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState(null);

  //  NEW: match event animation state
  const [matchEvent, setMatchEvent] = useState(null);
  const [lastBallId, setLastBallId] = useState(null); // 🔧 FIX: prevent repeat animation

  // Socket connection status
  const [isSocketConnected, setIsSocketConnected] = useState(getConnectionStatus());
  const [pollingInterval, setPollingInterval] = useState(null);

  let cleanupConnectionListener;

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
        // Fetch recent balls from all overs
        const oversRes = await api.get(`/overs/innings/${current._id}`);
        const allBalls = oversRes.overs?.flatMap(over =>
          (over.balls || []).map(ball => ({
            ...ball,
            overNumber: over.overNumber,
            bowler: over.bowler,
            ballNumber: ball.ballNumber
          }))
        ) || [];

        // Get last 10 balls, most recent first
        const sortedBalls = allBalls.sort((a, b) =>
          new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp)
        );
        setRecentBalls(sortedBalls.slice(0, 10));

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

    // Join match room for live updates
    socket.emit("joinMatch", matchId);

    // Listen for innings started events
    socket.on("inningsStarted", (data) => {
      console.log("🏏 Innings started event received:", data);
      setActiveInnings(data.innings);
      setRecentBalls([]); // Reset recent balls for new innings
    });

    // Listen for innings complete events
    socket.on("inningsComplete", (data) => {
      console.log("🏏 Innings complete event received:", data);
      // Target handled server-side and persisted in database
    });

    // Listen for live score updates
    socket.on("liveScoreUpdate", (data) => {
      setMatch((prev) => ({
        ...prev,
        currentScore: {
          runs: data.runs,
          wickets: data.wickets,
          overs: data.overs
        }
      }));

      setActiveInnings((prev) => ({
        ...prev,
        totalRuns: data.runs,
        totalWickets: data.wickets,
        totalOvers: data.overs,
        battingTeam: data.battingTeam,
        bowlingTeam: data.bowlingTeam,
        striker: data.striker,
        nonStriker: data.nonStriker,
        currentBowler: data.currentBowler,
        fallOfWickets: data.fallOfWickets || [],
        strikerRuns: data.strikerRuns ?? 0,
        strikerBalls: data.strikerBalls ?? 0,
        nonStrikerRuns: data.nonStrikerRuns ?? 0,
        nonStrikerBalls: data.nonStrikerBalls ?? 0,
        bowlerOvers: data.bowlerOvers ?? "0.0",
        bowlerRuns: data.bowlerRuns ?? 0,
        bowlerWickets: data.bowlerWickets ?? 0,
        inningsNumber: data.inningsNumber
      }));
    });

    // Listen for ball added events
    socket.on("ballAdded", (data) => {
      const { ball, overNumber, bowler } = data;

      // Add new ball to recent balls (most recent first)
      const newBallWithContext = {
        ...ball,
        overNumber: overNumber,
        bowler,
        ballNumber: ball.ballNumber
      };

      setRecentBalls(prev => {
        const updated = [newBallWithContext, ...prev];
        // Keep only last 10 balls
        return updated.slice(0, 10);
      });

      // Trigger match event animation for special balls
      if (ball.isWicket) {
        setMatchEvent("WICKET");
        setTimeout(() => setMatchEvent(null), 1800);
      } else if (ball.runs === 6) {
        setMatchEvent("SIX");
        setTimeout(() => setMatchEvent(null), 1800);
      } else if (ball.runs === 4) {
        setMatchEvent("FOUR");
        setTimeout(() => setMatchEvent(null), 1800);
      }
    });

    // Listen for ball removed events (for undo)
    socket.on("ballRemoved", (data) => {
      const { ballId } = data;

      // Remove the undone ball from recent balls
      setRecentBalls(prev => prev.filter(ball => ball._id !== ballId));
    });

    // Listen for new commentary
    socket.on("newCommentary", (data) => {
      setCommentary((prev) => [data, ...prev]);
    });

    // Cleanup on unmount
    return () => {
      socket.emit("leaveMatch", matchId);
      socket.off("liveScoreUpdate");
      socket.off("ballAdded");
      socket.off("ballRemoved");
      socket.off("newCommentary");
      socket.off("overComplete");

      // Cleanup connection listener and polling
      cleanupConnectionListener();
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [matchId]);

  /*  MATCH EVENT DETECTION (4 / 6 / WICKET) */
  useEffect(() => {
    if (!recentBalls.length) return;

    const latestBall = recentBalls[0]; // Most recent ball is first in array

    //  avoid animation on polling refresh
    if (latestBall._id === lastBallId) return;

    setLastBallId(latestBall._id);

    if (latestBall.isWicket) setMatchEvent("WICKET");
    else if (latestBall.runs === 6) setMatchEvent("SIX");
    else if (latestBall.runs === 4) setMatchEvent("FOUR");

    if (latestBall.isWicket || latestBall.runs === 4 || latestBall.runs === 6) {
      setTimeout(() => setMatchEvent(null), 1800);
    }
  }, [recentBalls]);

  /* CONNECTION MONITORING & FALLBACK POLLING */
  useEffect(() => {
    // Set up connection listener
    cleanupConnectionListener = addConnectionListener((connected) => {
      setIsSocketConnected(connected);

      if (connected) {
        // Stop polling when connected
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
      } else {
        // Start polling when disconnected
        if (!pollingInterval) {
          const interval = setInterval(fetchLiveData, 5000); // Poll every 5 seconds
          setPollingInterval(interval);
        }
      }
    });

    // Initial check
    setIsSocketConnected(getConnectionStatus());

    // Cleanup on unmount
    return () => {
      if (cleanupConnectionListener) {
        cleanupConnectionListener();
      }
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, []); // Empty dependency array since we only want this to run once

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

  // Calculate target display for second innings - USING SCORING PAGE LOGIC
  const targetDisplay = match.target && activeInnings?.inningsNumber === 2
    ? (() => {
      const runsNeeded = Math.max(0, match.target - (match.currentScore?.runs || 0));
      const totalBalls = totalOvers * 6;
      const oversDecimal = match.currentScore?.overs || 0;
      const ballsBowled = Math.floor(oversDecimal) * 6 + Math.round((oversDecimal % 1) * 10);
      const ballsRemaining = Math.max(0, totalBalls - ballsBowled);
      return runsNeeded > 0 ? `Need ${runsNeeded} runs from ${ballsRemaining} balls` : null;
    })()
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
      {matchEvent && <MatchEventAnimation event={matchEvent} />}

      {/* ================= MATCH HEADER ================= */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border dark:border-gray-700 shadow">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={match.teamA?.logo} alt="A" className="w-10 h-10" />
            <h2 className="text-xl font-bold">{match.teamA?.name}</h2>
          </div>

          <span className={`relative px-3 py-1 text-xs font-bold border rounded-full ${isSocketConnected
              ? 'text-green-600 border-green-500 bg-green-500/20'
              : 'text-orange-600 border-orange-500 bg-orange-500/20'
            }`}>
            <span className={`absolute left-2 h-2 w-2 rounded-full ${isSocketConnected ? 'bg-green-600 animate-ping' : 'bg-orange-600'
              }`}></span>
            <span className={`absolute left-2 h-2 w-2 rounded-full ${isSocketConnected ? 'bg-green-600' : 'bg-orange-600'
              }`}></span>
            <span className="ml-4">
              {isSocketConnected ? 'LIVE' : 'POLLING'}
            </span>
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
            <b>Toss:</b> {match.tossWinner?.name} ({match.electedTo})
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

        {/* TARGET DISPLAY IN MATCH HEADER - USING SCORING PAGE LOGIC */}
        {match?.target && activeInnings?.inningsNumber === 2 && (
          <div className="mt-4 flex items-center justify-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-md text-center border border-blue-400">
              <div className="text-sm font-semibold mb-1">
                Target: {match.target}
              </div>
              <div className="text-lg font-bold">
                Need {Math.max(0, match.target - (match.currentScore?.runs || 0))} runs from {Math.max(0, (match.overs * 6) - Math.floor((match.currentScore?.overs || 0) * 6) - Math.round(((match.currentScore?.overs || 0) % 1) * 10))} balls
              </div>
            </div>
          </div>
        )}

        {/* BATTING TEAM INDICATOR */}
        {activeInnings && (
          <div className="mt-4 flex items-center justify-center">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg shadow-md text-center border border-green-400 animate-pulse">
              <div className="text-sm font-semibold mb-1">
                {activeInnings.inningsNumber === 1 ? "1st Innings" : "2nd Innings"}
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="text-lg animate-bounce">🏏</span>
                <span>Now Batting</span>
              </div>
              <div className="text-lg font-bold mt-1">
                {activeInnings.battingTeam?.name || (activeInnings.battingTeam === match?.teamA?._id ? match.teamA.name : match?.teamB?.name)}
              </div>
            </div>
          </div>
        )}

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
            <p className="text-sm text-gray-500">RRR: {rrr || 'N/A'}</p>
            {match.target && activeInnings?.inningsNumber === 2 && (
              <>
                <p className="text-sm text-gray-500">Target: {match.target}</p>
                <p className="text-sm font-semibold text-blue-600">
                  Need {Math.max(0, match.target - (match.currentScore?.runs || 0))} runs from {Math.max(0, (match.overs * 6) - Math.floor((match.currentScore?.overs || 0) * 6) - Math.round(((match.currentScore?.overs || 0) % 1) * 10))} balls
                </p>
              </>
            )}
          </div>

          <button
            onClick={fetchLiveData}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* ---- PLAYERS ---- */}
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

      {/* ---- BATTER & BOWLER ---- */}
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

      {/* ---- RECENT BALLS ---- */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-700">
        <h3 className="font-semibold mb-3">Recent Balls (Last 10)</h3>
        {recentBalls.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No balls bowled yet</p>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {recentBalls.map((ball, index) => (
              <span
                key={ball._id || `ball-${index}`}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold ${ballStyle(
                  ball
                )}`}
              >
                {ballBadge(ball)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ---- COMMENTARY ---- */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-700">
        <h3 className="font-semibold mb-3">Live Commentary</h3>
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {commentary.length === 0 && (
            <p className="text-sm text-gray-500">No commentary yet</p>
          )}
          {commentary.map((c, index) => (
            <div key={c._id || `commentary-${index}`} className={`text-sm ${commentaryColor[c.type]}`}>
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