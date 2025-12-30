import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { socket } from "../../utils/socket";

import MatchHeader from "../../components/dashboard/scorer/MatchHeader";
import ScoreBoard from "../../components/dashboard/scorer/ScoreBoard";
import BallControls from "../../components/dashboard/scorer/BallControls";
import PlayerSelectionModal from "../../components/dashboard/scorer/PlayerSelectionModal";
import StartInningsModal from "../../components/dashboard/scorer/StartInningsModal";
import BowlerSelectionModal from "../../components/dashboard/scorer/BowlerSelectionModal";
import EndMatchModal from "../../components/dashboard/scorer/EndMatchModal";

export default function ScoringPage() {
    const { matchId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [match, setMatch] = useState(null);
    const [players, setPlayers] = useState([]);
    const [battingPlayers, setBattingPlayers] = useState([]);
    const [fieldingPlayers, setFieldingPlayers] = useState([]);
    const [battingTeamId, setBattingTeamId] = useState(null);
    const [bowlingTeamId, setBowlingTeamId] = useState(null);
    const [innings, setInnings] = useState(null);
    const [inningsStarted, setInningsStarted] = useState(false);
    const [overStarted, setOverStarted] = useState(false);
    const [showInningsModal, setShowInningsModal] = useState(false);
    const [showWicketModal, setShowWicketModal] = useState(false);
    const [showBowlerModal, setShowBowlerModal] = useState(false);
    const [showEndMatchModal, setShowEndMatchModal] = useState(false);
    const [wicketContext, setWicketContext] = useState(null);

    /* ======================================================
       INITIAL LOAD
    ====================================================== */
    useEffect(() => {
        const loadData = async () => {
            try {
                const matchData = await api.get(`/matches/${matchId}`);
                const playersData = await api.get(`/matches/${matchId}/players`);

                console.log("Players API Response:", playersData);
                console.log("Is Array?", Array.isArray(playersData));
                console.log("Type:", typeof playersData);

                setMatch(matchData);
                // Combine players from both teams into a flat array
                const allPlayers = [
                    ...playersData.teamA.players,
                    ...playersData.teamB.players
                ];
                setPlayers(allPlayers);

                // Determine batting and fielding teams based on innings
                let battingTeamId, fieldingTeamId;

                if (matchData.currentInnings && matchData.currentInnings.completed) {
                    // Second innings: swap teams from first innings
                    const firstInningsBattingTeam = matchData.currentInnings.battingTeam;
                    battingTeamId = firstInningsBattingTeam === matchData.teamA._id ? matchData.teamB._id : matchData.teamA._id;
                    fieldingTeamId = firstInningsBattingTeam;
                } else {
                    // First innings: use toss winner logic
                    const tossWinnerId = matchData.tossWinner?._id || matchData.tossWinner;
                    if (matchData.tossWinner && matchData.electedTo === 'bat') {
                        battingTeamId = tossWinnerId;
                        fieldingTeamId = tossWinnerId === matchData.teamA._id ? matchData.teamB._id : matchData.teamA._id;
                    } else if (matchData.tossWinner && matchData.electedTo === 'bowl') {
                        fieldingTeamId = tossWinnerId;
                        battingTeamId = tossWinnerId === matchData.teamA._id ? matchData.teamB._id : matchData.teamA._id;
                    } else {
                        // Default: teamA bats first if no toss info
                        battingTeamId = matchData.teamA._id;
                        fieldingTeamId = matchData.teamB._id;
                    }
                }

                // Ensure batting and bowling teams are different
                if (battingTeamId.toString() === fieldingTeamId.toString()) {
                    console.error("Batting and bowling teams are the same, fixing...");
                    fieldingTeamId = battingTeamId === matchData.teamA._id ? matchData.teamB._id : matchData.teamA._id;
                }

                // Filter players by team
                const battingPlayers = allPlayers.filter(player => player.teamId.toString() === battingTeamId.toString());
                const fieldingPlayers = allPlayers.filter(player => player.teamId.toString() === fieldingTeamId.toString());

                console.log("Batting Team ID:", battingTeamId);
                console.log("Bowling Team ID:", fieldingTeamId);
                console.log("Batting Players:", battingPlayers.length);
                console.log("Fielding Players:", fieldingPlayers.length);

                // Store filtered players (we'll add state for this)
                setBattingPlayers(battingPlayers);
                setFieldingPlayers(fieldingPlayers);
                setBattingTeamId(battingTeamId);
                setBowlingTeamId(fieldingTeamId);
                
                // Check if innings already started and not completed (and has striker set)
                console.log("currentInnings:", matchData.currentInnings);
                console.log("completed:", matchData.currentInnings?.completed);
                console.log("striker:", matchData.currentInnings?.striker);
                if (matchData.currentInnings && !matchData.currentInnings.completed && matchData.currentInnings.striker) {
                    setInnings(matchData.currentInnings);
                    setInningsStarted(true);
                    setOverStarted(!!matchData.currentInnings.currentOverId);
                }
                
                setLoading(false);
            } catch (err) {
                console.error("❌ Failed to load scoring page", err);
                navigate("/scorer/dashboard");
            }
        };

        loadData();
    }, [matchId, navigate]);

    /* ======================================================
       UPDATE BATTING/FIELDING PLAYERS WHEN INNINGS CHANGES
    ====================================================== */
    useEffect(() => {
        if (!innings || !match || !players.length) return;

        const battingTeamId = innings.battingTeam?._id || innings.battingTeam;
        const bowlingTeamId = innings.bowlingTeam?._id || innings.bowlingTeam;

        const battingPlayers = players.filter(player => player.teamId.toString() === battingTeamId.toString());
        const fieldingPlayers = players.filter(player => player.teamId.toString() === bowlingTeamId.toString());

        setBattingPlayers(battingPlayers);
        setFieldingPlayers(fieldingPlayers);
        setBattingTeamId(battingTeamId);
        setBowlingTeamId(bowlingTeamId);
    }, [innings, match, players]);

    /* ======================================================
       SOCKETS
    ====================================================== */
    useEffect(() => {
        if (!matchId) return;

        socket.emit("joinMatch", matchId);

        socket.on("inningsStarted", (data) => {
            setInnings(data.innings);
        });

        socket.on("inningsComplete", (data) => {
            console.log("🏏 Innings complete event received:", data);
            if (data.inningsNumber === 1) {
                // First innings completed, set target for second innings
                setMatch((prev) => ({
                    ...prev,
                    target: data.runs + 1
                }));
            }
        });

        socket.on("liveScoreUpdate", (data) => {
            setInnings((prev) => ({
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
                inningsNumber: data.inningsNumber
            }));
        });

        socket.on("newBatterNeeded", (payload) => {
            setWicketContext(payload);
            setShowWicketModal(true);
        });

        socket.on("overComplete", () => {
            setOverStarted(false);
        });

        return () => {
            socket.emit("leaveMatch", matchId);
            socket.off();
        };
    }, [matchId]);

    /* ======================================================
       START INNINGS
    ====================================================== */
    const startInnings = async ({ striker, nonStriker }) => {
        try {
            await api.post("/scorer/start-innings", {
                matchId,
                battingTeam: battingTeamId,
                bowlingTeam: bowlingTeamId,
                striker,
                nonStriker,
                bowler: null,
            });

            // Refetch match data to get updated currentInnings
            const updatedMatch = await api.get(`/matches/${matchId}?t=${Date.now()}`);
            setMatch(updatedMatch);
            if (updatedMatch.currentInnings) {
                setInnings(updatedMatch.currentInnings);
            }

            setInningsStarted(true);
            setShowInningsModal(false);

            // Show bowler modal to start first over
            setShowBowlerModal(true);
        } catch (err) {
            console.error("❌ Failed to start innings", err);
        }
    };

    /* ======================================================
       START OVER
    ====================================================== */
  const handleStartOver = async (bowlerId) => {
  if (!innings?._id) {
    console.error("❌ Cannot start over: inningsId missing");
    return;
  }

  try {
    await api.post(`/scorer/start-over/${matchId}`, {
      inningsId: innings._id,
      bowler: bowlerId,
    });

    setOverStarted(true);
    setShowBowlerModal(false);
  } catch (err) {
    console.error("❌ Failed to start over", err.response?.data || err);
  }
};

    /* ======================================================
       SUBMIT BALL
    ====================================================== */
    const submitBall = async (ballData) => {
        if (!overStarted) return;

        try {
            const payload = {
                matchId,
                inningsId: innings?._id,
                overId: innings?.currentOverId,
                striker: innings?.striker,
                nonStriker: innings?.nonStriker,
                // bowler will be fetched from over on server side
                runs: 0,
                extraType: "none",
                isWicket: false,
                wicketType: null,
                fielder: null,
                dismissedBatsman: null,
            };

            if (ballData.type === "RUN") {
                payload.runs = ballData.runs;
            } else if (ballData.type === "EXTRA") {
                payload.extraType = ballData.extraType;
            } else if (ballData.type === "WICKET") {
                payload.isWicket = true;
                payload.wicketType = ballData.wicketType;
                payload.fielder = ballData.fielder;
                payload.dismissedBatsman = ballData.dismissedBatsman;
            }

            await api.post("/scorer/ball", payload);
        } catch (err) {
            console.error("❌ Ball submit failed", err);
        }
    };

    /* ======================================================
       HANDLE WICKET SELECT
    ====================================================== */
    const handleWicketSelect = (wicketType) => {
        submitBall({ type: "WICKET", wicketType });
    };

    /* ======================================================
       CONFIRM NEW BATTER
    ====================================================== */
    const confirmNewBatter = async ({ newBatter, wicketType }) => {
        try {
            await api.post("/scorer/new-batter", {
                matchId,
                playerId: newBatter,
                wicketType,
            });

            setShowWicketModal(false);
            setWicketContext(null);
        } catch (err) {
            console.error("❌ Failed to set new batter", err);
        }
    };

    /* ======================================================
       UNDO LAST BALL
    ====================================================== */
    const undoLastBall = async () => {
        try {
            await api.post(`/scorer/undo/${matchId}`);
            // Refetch match data to update the UI
            const updatedMatch = await api.get(`/matches/${matchId}?t=${Date.now()}`);
            setMatch(updatedMatch);
            if (updatedMatch.currentInnings) {
                setInnings(updatedMatch.currentInnings);
            }
        } catch (err) {
            console.error("❌ Failed to undo last ball", err);
        }
    };

    /* ======================================================
       HANDLE MATCH END
    ====================================================== */
    const handleMatchEnd = (status) => {
        // Navigate back to scorer dashboard or match history
        navigate("/scorer/dashboard");
    };

    if (loading) {
        return <div className="p-6 text-gray-400">Loading scoring data...</div>;
    }

    return (
        <div className="p-4 space-y-4 max-w-5xl mx-auto">
        {/* MATCH HEADER */}
        <MatchHeader match={match} />

        {/* BATTING TEAM INDICATOR */}
        {innings && (
            <div className="flex items-center justify-center">
                <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg shadow-md text-center border border-green-400 animate-pulse">
                    <div className="text-sm font-semibold mb-1">
                        {innings.inningsNumber === 1 ? "1st Innings" : "2nd Innings"}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <span className="text-lg animate-bounce">🏏</span>
                        <span>Now Batting</span>
                    </div>
                    <div className="text-lg font-bold mt-1">
                        {innings.battingTeam?.name || (innings.battingTeam === match?.teamA?._id ? match.teamA.name : match?.teamB?.name)}
                    </div>
                </div>
            </div>
        )}

        {/* TARGET DISPLAY */}
        {match?.target && innings?.inningsNumber === 2 && (
            <div className="flex items-center justify-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-md text-center border border-blue-400">
                    <div className="text-sm font-semibold mb-1">
                        Target: {match.target}
                    </div>
                    <div className="text-lg font-bold">
                        Need {Math.max(0, match.target - (innings.totalRuns || 0))} runs from {Math.max(0, (match.overs * 6) - Math.floor((innings.totalOvers || 0) * 6) - ((innings.totalOvers || 0) % 1) * 10)} balls
                    </div>
                </div>
            </div>
        )}

        {/* SCOREBOARD */}
        <ScoreBoard innings={innings} />

            {/* START INNINGS BUTTON - only show if innings hasn't started */}
            {!inningsStarted && (
                <button
                    onClick={() => setShowInningsModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                    🏏 Start Innings
                </button>
            )}

            {/* START OVER BUTTON - show when innings started but over not started */}
            {inningsStarted && !overStarted && (
                <button
                    onClick={() => setShowBowlerModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                    🎯 Start New Over
                </button>
            )}

            {/* BALL CONTROLS */}
            <BallControls
                onSubmitBall={submitBall}
                onWicketSelect={handleWicketSelect}
                disabled={!overStarted || showWicketModal}
            />

            {/* UNDO LAST BALL BUTTON */}
            {inningsStarted && (
                <button
                    onClick={undoLastBall}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                    ↶ Undo Last Ball
                </button>
            )}

            {/* END MATCH BUTTON - always visible */}
            <button
                onClick={() => setShowEndMatchModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors mt-4 mx-2 sm:mx-4 md:mx-6"
            >
                🏁 End Match
            </button>

            {/* START INNINGS MODAL - use the new modal */}
            {showInningsModal && (
                <StartInningsModal
                    players={battingPlayers}
                    onConfirm={startInnings}
                    onClose={() => setShowInningsModal(false)}
                />
            )}

            {/* NEW BATTER MODAL - only for wickets */}
            {showWicketModal && (
                <PlayerSelectionModal
                    players={battingPlayers}
                    fieldingPlayers={fieldingPlayers}
                    striker={innings?.striker}
                    nonStriker={innings?.nonStriker}
                    onConfirm={confirmNewBatter}
                    onClose={() => {
                        setShowWicketModal(false);
                        setWicketContext(null);
                    }}
                />
            )}

            {/* BOWLER MODAL */}
            {showBowlerModal && (
                <BowlerSelectionModal
                    bowlers={fieldingPlayers.filter(p => p.role.toLowerCase() === 'bowler' || p.role.toLowerCase() === 'all-rounder')}
                    onConfirm={handleStartOver}
                    onClose={() => setShowBowlerModal(false)}
                />
            )}

            {/* END MATCH MODAL */}
            {showEndMatchModal && (
                <EndMatchModal
                    matchId={matchId}
                    onClose={() => setShowEndMatchModal(false)}
                    onMatchEnd={handleMatchEnd}
                />
            )}
        </div>
    );
}
