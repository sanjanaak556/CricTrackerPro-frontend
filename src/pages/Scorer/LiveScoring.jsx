// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// import useLiveMatchSocket from "../../hooks/useLiveMatchSocket";
// import api from "../../services/api";

// import ScoreHeader from "../../components/dashboard/scorer/ScoreHeader";
// import RunButtons from "../../components/dashboard/scorer/RunButtons";
// import ExtrasPanel from "../../components/dashboard/scorer/ExtrasPanel";
// import WicketPanel from "../../components/dashboard/scorer/WicketPanel";
// import OverBalls from "../../components/dashboard/scorer/OverBalls";
// import UndoButton from "../../components/dashboard/scorer/UndoButton";

// import BatterSelectModal from "../../components/dashboard/scorer/BatterSelectModal";
// import BowlerSelectModal from "../../components/dashboard/scorer/BowlerSelectModal";
// import ResumeBanner from "../../components/dashboard/scorer/ResumeBanner";
// import StartScoring from "./StartScoring";

// import { submitBall, undoLastBall, getLiveMatchData } from "../../services/scorerApi";
// import { socket } from "../../utils/socket";

// export default function LiveScoring() {
//   const { matchId } = useParams();

//   const [match, setMatch] = useState(null);
//   const [innings, setInnings] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [needStart, setNeedStart] = useState(false);
//   const [needBatter, setNeedBatter] = useState(false);
//   const [needBowler, setNeedBowler] = useState(false);

//   const [batters, setBatters] = useState([]);
//   const [bowlers, setBowlers] = useState([]);

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { liveData, commentary } = useLiveMatchSocket(matchId);

//   /* ---------------- INITIAL FETCH ---------------- */
//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await getLiveMatchData(matchId);

//         setMatch(res.match);
//         setInnings(res.innings);

//         // innings not started yet
//         if (!res.innings?.striker) {
//           setNeedStart(true);
//         }

//         setBatters(res.battingPlayers || []);
//         setBowlers(res.bowlingPlayers || []);
//       } catch (err) {
//         console.error("Live scoring load failed", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     load();
//   }, [matchId]);

//   /* ---------------- SOCKET EVENTS ---------------- */
//   useEffect(() => {
//     socket.emit("joinMatch", matchId);

//     socket.on("newBatterNeeded", () => setNeedBatter(true));
//     socket.on("overComplete", () => setNeedBowler(true));

//     return () => {
//       socket.emit("leaveMatch", matchId);
//       socket.off("newBatterNeeded");
//       socket.off("overComplete");
//     };
//   }, [matchId]);

//   /* ---------------- LIVE SCORE UPDATE ---------------- */
//   useEffect(() => {
//     if (!liveData) return;

//     setInnings(prev => ({
//       ...prev,
//       totalRuns: liveData.runs,
//       totalWickets: liveData.wickets,
//       totalOvers: liveData.overs,
//       striker: liveData.striker,
//       nonStriker: liveData.nonStriker,
//       currentBowler: liveData.bowler,
//     }));
//   }, [liveData]);

//   /* ---------------- HANDLERS ---------------- */
//   const safeSubmit = async (payload) => {
//     if (isSubmitting || needBatter || needBowler || needStart) return;
//     setIsSubmitting(true);
//     try {
//       await submitBall(matchId, payload);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleRun = (runs) =>
//     safeSubmit({ runs, extraType: "none", isWicket: false });

//   const handleExtra = (extraType) =>
//     safeSubmit({ runs: 0, extraType, isWicket: false });

//   const handleWicket = () =>
//     safeSubmit({ runs: 0, extraType: "none", isWicket: true });

//   const handleUndo = async () => {
//     if (isSubmitting) return;
//     setIsSubmitting(true);
//     await undoLastBall(matchId);
//     setIsSubmitting(false);
//   };

//   /* ---------------- LOADING ---------------- */
//   if (loading) {
//     return (
//       <div className="p-6 text-gray-700 dark:text-gray-300">
//         Loading live scoring…
//       </div>
//     );
//   }

//   /* ---------------- START MATCH ---------------- */
//   if (needStart) {
//     return (
//       <StartScoring
//         matchId={matchId}
//         onStarted={() => setNeedStart(false)}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 space-y-4">

//       <ResumeBanner />

//       {needBatter && (
//         <BatterSelectModal
//           players={batters}
//           onSelect={async (id) => {
//             await api.post(`/scorer/match/${matchId}/new-batter`, { playerId: id });
//             setNeedBatter(false);
//           }}
//         />
//       )}

//       {needBowler && (
//         <BowlerSelectModal
//           bowlers={bowlers}
//           onSelect={async (id) => {
//             await api.post(`/scorer/match/${matchId}/new-bowler`, { playerId: id });
//             setNeedBowler(false);
//           }}
//         />
//       )}

//       <ScoreHeader match={match} innings={innings} />

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

//         {/* Batting */}
//         <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border dark:border-gray-700">
//           <h2 className="text-sm font-semibold text-gray-500">Batting</h2>
//           <p className="text-sm text-gray-900 dark:text-gray-100">
//             Striker: {innings?.striker?.name || "—"}
//           </p>
//           <p className="text-sm text-gray-900 dark:text-gray-100">
//             Non-Striker: {innings?.nonStriker?.name || "—"}
//           </p>
//         </div>

//         {/* Controls */}
//         <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border dark:border-gray-700 space-y-4">
//           <OverBalls balls={innings?.currentOver?.balls || []} />
//           <RunButtons onRun={handleRun} disabled={isSubmitting} />
//           <ExtrasPanel onExtra={handleExtra} disabled={isSubmitting} />
//           <WicketPanel onWicket={handleWicket} disabled={isSubmitting} />
//           <UndoButton onUndo={handleUndo} disabled={isSubmitting} />
//         </div>

//         {/* Bowling */}
//         <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border dark:border-gray-700">
//           <h2 className="text-sm font-semibold text-gray-500">Bowling</h2>
//           <p className="text-sm text-gray-900 dark:text-gray-100">
//             Bowler: {innings?.currentBowler?.name || "—"}
//           </p>
//         </div>
//       </div>

//       {/* Commentary */}
//       <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border dark:border-gray-700">
//         <h2 className="text-sm font-semibold text-gray-500 mb-2">Commentary</h2>
//         <ul className="text-sm space-y-1 text-gray-800 dark:text-gray-200">
//           {commentary.map((c, i) => (
//             <li key={i}>{c.text}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
