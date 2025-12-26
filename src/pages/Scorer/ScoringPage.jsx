import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { socket } from "../../utils/socket";

import MatchHeader from "../../components/dashboard/scorer/MatchHeader";
import ScoreBoard from "../../components/dashboard/scorer/ScoreBoard";
import BallControls from "../../components/dashboard/scorer/BallControls";
import PlayerSelectionModal from "../../components/dashboard/scorer/PlayerSelectionModal";
import StartInningsModal from "../../components/dashboard/scorer/StartInningsModal"; // NEW

export default function ScoringPage() {
    const { matchId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [match, setMatch] = useState(null);
    const [players, setPlayers] = useState([]);
    const [innings, setInnings] = useState(null);
    const [inningsStarted, setInningsStarted] = useState(false);
    const [overStarted, setOverStarted] = useState(false);
    const [showInningsModal, setShowInningsModal] = useState(false);
    const [showWicketModal, setShowWicketModal] = useState(false);
    const [showBowlerModal, setShowBowlerModal] = useState(false);
    const [wicketContext, setWicketContext] = useState(null); // ADD THIS

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
                setPlayers(Array.isArray(playersData) ? playersData : []);
                
                // Check if innings already started
                if (matchData.currentInnings) {
                    setInnings(matchData.currentInnings);
                    setInningsStarted(true);
                    setOverStarted(matchData.currentInnings.isOverActive || false);
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
                striker,
                nonStriker,
                bowler: null,
            });

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
            await api.post("/over/start", {
                inningsId: innings?._id,
                bowler: bowlerId,
                overNumber: innings ? parseInt(innings.totalOvers) + 1 : 1,
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
            await api.post("/scorer/ball", {
                matchId,
                inningsId: innings?._id,
                ...ballData,
            });
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
                    players={players}
                    onConfirm={startInnings}
                    onClose={() => setShowInningsModal(false)}
                />
            )}

            {/* NEW BATTER MODAL - only for wickets */}
            {showWicketModal && (
                <PlayerSelectionModal
                    players={players}
                    striker={innings?.striker}
                    nonStriker={innings?.nonStriker}
                    onConfirm={confirmNewBatter}
                    onClose={() => {
                        setShowWicketModal(false);
                        setWicketContext(null);
                    }}
                />
            )}

            {/* BOWLER MODAL - you need to create this component */}
            {showBowlerModal && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-2">
                    <div className="bg-white dark:bg-gray-900 rounded w-full max-w-md p-5 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Select Bowler for Next Over
                        </h2>
                        
                        <div className="space-y-3">
                            {players.filter(p => p.role === 'bowler' || p.role === 'all-rounder').map((player) => (
                                <button
                                    key={player._id}
                                    onClick={() => handleStartOver(player._id)}
                                    className="w-full text-left p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    {player.name}
                                </button>
                            ))}
                        </div>
                        
                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setShowBowlerModal(false)}
                                className="px-4 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}