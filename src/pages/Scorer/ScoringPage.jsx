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

                // Determine batting and fielding teams
                const battingTeamId = matchData.tossWinner && matchData.electedTo === 'bat'
                    ? matchData.tossWinner._id || matchData.tossWinner
                    : (matchData.teamA._id === (matchData.tossWinner?._id || matchData.tossWinner) ? matchData.teamB._id : matchData.teamA._id);

                const fieldingTeamId = battingTeamId === matchData.teamA._id ? matchData.teamB._id : matchData.teamA._id;

                // Filter players by team
                const battingPlayers = allPlayers.filter(player => player.teamId === battingTeamId);
                const fieldingPlayers = allPlayers.filter(player => player.teamId === fieldingTeamId);

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
       SOCKETS
    ====================================================== */
    useEffect(() => {
        if (!matchId) return;

        socket.emit("joinMatch", matchId);

        socket.on("liveScoreUpdate", (data) => {
            setInnings((prev) => ({
                ...prev,
                totalRuns: data.runs,
                totalWickets: data.wickets,
                totalOvers: data.overs,
                striker: data.striker,
                nonStriker: data.nonStriker,
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
        try {
            await api.post("/overs/start", {
                inningsId: innings?._id,
                bowler: bowlerId,
            });

            setOverStarted(true);
            setShowBowlerModal(false);
        } catch (err) {
            console.error("❌ Failed to start over", err);
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
                bowler: innings?.currentBowler,
                runs: 0,
                extraType: "none",
                isWicket: false,
                wicketType: null,
            };

            if (ballData.type === "RUN") {
                payload.runs = ballData.runs;
            } else if (ballData.type === "EXTRA") {
                payload.extraType = ballData.extraType;
            } else if (ballData.type === "WICKET") {
                payload.isWicket = true;
                payload.wicketType = ballData.wicketType;
            }

            await api.post("/scorer/ball", payload);
        } catch (err) {
            console.error("❌ Ball submit failed", err);
        }
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

    if (loading) {
        return <div className="p-6 text-gray-400">Loading scoring data...</div>;
    }

    return (
        <div className="p-4 space-y-4 max-w-5xl mx-auto">
            {/* MATCH HEADER */}
            <MatchHeader match={match} />

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
                disabled={!overStarted}
            />

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
        </div>
    );
}